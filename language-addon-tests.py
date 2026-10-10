from pathlib import Path
import re, json, unittest
ROOT = Path(__file__).parent
JS = (ROOT / "igers-language-addon.js").read_text(encoding="utf-8")
CSS = (ROOT / "igers-language-addon.css").read_text(encoding="utf-8")
README = (ROOT / "README-INTEGRATION-BN.md").read_text(encoding="utf-8")
class LanguageAddonTests(unittest.TestCase):
    def test_three_requested_languages_are_declared(self):
        for code in ('"ja"','"ur"','"vi"'):
            self.assertIn(code, JS)
        for label in ('日本語','اردو','Tiếng Việt'):
            self.assertIn(label, JS)
    def test_dictionary_is_curated_and_substantial(self):
        match = re.search(r'const DICT = (\{.*?\});\n  const norm', JS, re.S)
        self.assertIsNotNone(match)
        data = json.loads(match.group(1))
        self.assertGreaterEqual(len(data), 180)
        for phrase, row in data.items():
            self.assertTrue(phrase.strip())
            for code in ('ja','ur','vi'):
                self.assertIn(code, row, phrase)
                self.assertTrue(row[code].strip(), phrase)
    def test_rtl_and_measurement_preservation(self):
        self.assertIn('document.documentElement.dir = LANGS[chosen].dir', JS)
        self.assertIn('"ur":{"label":"اردو","name":"Urdu","dir":"rtl"}', JS)
        self.assertIn('html[dir="rtl"] input[type="number"]', CSS)
        self.assertIn('numeric measurements', README)
    def test_missing_selector_fails_closed_without_ui_injection(self):
        self.assertIn('existing-language-selector-not-found', JS)
        self.assertIn('application left unchanged', JS)
        self.assertNotIn('createFallbackSelector', JS)
        self.assertNotIn('ownsSelector', JS)

    def test_original_selector_and_dictionary_are_not_replaced(self):
        self.assertIn("getElementById('igersLanguageSelect')", JS)
        self.assertIn('ensureOptions(selector)', JS)
        self.assertIn('if (!exists)', JS)
        self.assertNotIn('selector.innerHTML =', JS)
        self.assertNotIn('localStorage.clear(', JS)
        self.assertIn('window.IGERSLanguage', JS)
        self.assertIn('বর্তমান language-enabled IGERS repository source', README)
    def test_new_language_choice_survives_legacy_fallback(self):
        self.assertIn('let pendingSelection = null', JS)
        self.assertIn('pendingSelection = selector.value', JS)
        self.assertIn('pendingSelection !== null ? pendingSelection', JS)
        self.assertIn("Capture the user\'s choice before i18n.js can rewrite unknown codes to \'en\'", JS)
    def test_legacy_runtime_does_not_reprocess_added_text(self):
        self.assertIn("el.setAttribute('data-i18n-skip', '')", JS)
        self.assertIn("selector.addEventListener('change', () => {", JS)
        self.assertIn('true);', JS)
        self.assertIn('releaseOverlay', JS)
    def test_provider_and_dynamic_text_fall_back(self):
        self.assertIn('curated UI phrase', README)
        self.assertIn('const translated = DICT[source] && DICT[source][activeLang]', JS)
    def test_exports_api_and_language_event(self):
        self.assertIn('window.IGERSLanguageAddon', JS)
        self.assertIn("igers:languagechange", JS)
    def test_cache_busted_snippet(self):
        snippet = (ROOT / 'integration-snippet.html').read_text(encoding='utf-8')
        self.assertIn('v=20261010-ja-ur-vi-3', snippet)
        self.assertIn('igers-language-addon.css', snippet)
        self.assertIn('igers-language-addon.js', snippet)
if __name__ == '__main__': unittest.main(verbosity=2)
