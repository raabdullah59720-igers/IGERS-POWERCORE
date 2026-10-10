from pathlib import Path
import hashlib, subprocess, sys, tempfile, unittest, shutil

ADDON = Path(__file__).resolve().parent
PATCHER = ADDON / 'apply-language-upgrade.py'
LEGACY_OPTIONS = '''<select id="igersLanguageSelect">
<option value="auto">Auto</option><option value="en">English</option>
<option value="bn">বাংলা</option><option value="hi">हिन्दी</option>
<option value="ar">العربية</option><option value="zh">中文</option>
<option value="es">Español</option><option value="fr">Français</option>
<option value="ru">Русский</option></select>'''
INDEX = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>IGERS</title></head>
<body>{LEGACY_OPTIONS}<p>Concept</p><script src="./i18n.js"></script><script src="./app.js"></script></body></html>'''
RUNTIME = '''window.IGERSLanguage = {{ set: function(code) {{ document.documentElement.lang = code; }} }};
const existingLanguages = ["en","bn","hi","ar","zh","es","fr","ru"];
'''

def digest(p: Path):
    h=hashlib.sha256(); h.update(p.read_bytes()); return h.hexdigest()

class PatchGuardTests(unittest.TestCase):
    def test_patch_applies_only_to_language_enabled_tree_and_is_idempotent(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td)
            (root/'index.html').write_text(INDEX, encoding='utf-8')
            (root/'i18n.js').write_text(RUNTIME, encoding='utf-8')
            (root/'app.js').write_text('/* original panel app */', encoding='utf-8')
            (root/'sw.js').write_text('const CACHE="old-cache";', encoding='utf-8')
            before_app=digest(root/'app.js'); before_sw=digest(root/'sw.js'); before_i18n=digest(root/'i18n.js')
            cmd=[sys.executable,str(PATCHER),'--app',str(root),'--source',str(ADDON)]
            r=subprocess.run(cmd,capture_output=True,text=True)
            self.assertEqual(r.returncode,0, r.stderr+r.stdout)
            html=(root/'index.html').read_text(encoding='utf-8')
            self.assertEqual(html.count('igers-language-addon.css'),1)
            self.assertEqual(html.count('igers-language-addon.js'),1)
            self.assertIn('Русский',html); self.assertIn('Español',html); self.assertNotIn('option value="ja"',html)
            self.assertEqual(digest(root/'app.js'),before_app)
            self.assertEqual(digest(root/'sw.js'),before_sw)
            self.assertEqual(digest(root/'i18n.js'),before_i18n)
            self.assertTrue((root/'.igers-language-backups/index.html.before-20261010-ja-ur-vi-3.bak').is_file())
            r2=subprocess.run(cmd,capture_output=True,text=True)
            self.assertEqual(r2.returncode,0,r2.stderr+r2.stdout)
            self.assertEqual((root/'index.html').read_text(encoding='utf-8').count('igers-language-addon.js'),1)

    def test_stale_baseline_stops_without_any_write(self):
        # The currently available baseline has no selector/i18n runtime. Guard must fail closed.
        with tempfile.TemporaryDirectory() as td:
            root=Path(td)
            (root/'index.html').write_text('<!doctype html><html><head></head><body><p>Concept</p></body></html>',encoding='utf-8')
            (root/'sw.js').write_text('const CACHE="old-cache";',encoding='utf-8')
            before={p.name:digest(p) for p in root.iterdir()}
            r=subprocess.run([sys.executable,str(PATCHER),'--app',str(root),'--source',str(ADDON)],capture_output=True,text=True)
            self.assertEqual(r.returncode,3,r.stdout+r.stderr)
            self.assertIn('SAFE STOP',r.stderr)
            self.assertEqual(before,{p.name:digest(p) for p in root.iterdir()})
            self.assertNotIn('igers-language-addon.js',(root/'index.html').read_text(encoding='utf-8'))

    def test_embedded_test_fixture_cannot_fake_the_app_runtime(self):
        # A copied add-on test page inside the repo must not satisfy the guard.
        with tempfile.TemporaryDirectory() as td:
            root=Path(td)
            (root/'index.html').write_text('<!doctype html><html><head></head><body><p>Concept</p></body></html>',encoding='utf-8')
            (root/'sw.js').write_text('const CACHE="old-cache";',encoding='utf-8')
            fixture=root/'upgrade'/'browser-smoke'; fixture.mkdir(parents=True)
            shutil.copy2(ADDON/'browser-smoke'/'index.html',fixture/'index.html')
            before={str(p.relative_to(root)):digest(p) for p in root.rglob('*') if p.is_file()}
            r=subprocess.run([sys.executable,str(PATCHER),'--app',str(root),'--source',str(ADDON)],capture_output=True,text=True)
            self.assertEqual(r.returncode,3,r.stdout+r.stderr)
            self.assertIn('SAFE STOP',r.stderr)
            after={str(p.relative_to(root)):digest(p) for p in root.rglob('*') if p.is_file()}
            self.assertEqual(before,after)

if __name__=='__main__': unittest.main(verbosity=2)
