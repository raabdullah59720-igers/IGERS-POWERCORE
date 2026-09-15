
/* IGERS-BD-01 · Public Voice Mail module
 * Shared mode requires the included Node server or an equivalent deployment
 * exposing /api/voicemails. It intentionally does not use localStorage for
 * published voice recordings, so different users can hear the same feed.
 */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const els={
    recorder:$('voicemailRecorder'), timer:$('voicemailTimer'), state:$('voicemailState'),
    record:$('voicemailRecord'), stop:$('voicemailStop'), publish:$('voicemailPublish'), discard:$('voicemailDiscard'),
    preview:$('voicemailPreview'), status:$('voicemailStatus'), list:$('voicemailList'), count:$('voicemailCount'), refresh:$('voicemailRefresh')
  };
  if(!els.recorder||!els.record||!els.stop||!els.publish||!els.list) return;

  const MAX_SECONDS=60;
  let mediaRecorder=null, chunks=[], startedAt=0, recordedSeconds=0, timerHandle=null, previewBlob=null, previewUrl='';
  let mimeType='';

  function setStatus(msg,type=''){ if(!els.status)return; els.status.textContent=msg; els.status.className='feedback-status'+(type?' '+type:''); }
  function setState(v){ if(els.state) els.state.textContent=v; }
  function fmtTime(sec){ sec=Math.max(0,Math.floor(sec)); return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'); }
  function resetTimer(){ clearInterval(timerHandle); timerHandle=null; startedAt=0; if(els.timer)els.timer.textContent='00:00'; }
  function startTimer(){ clearInterval(timerHandle); timerHandle=setInterval(()=>{ const elapsed=Math.floor((Date.now()-startedAt)/1000); els.timer.textContent=fmtTime(elapsed); if(elapsed>=MAX_SECONDS) stopRecording(); },250); }
  function chooseMime(){
    if(!window.MediaRecorder) return '';
    const choices=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4'];
    return choices.find(x=>MediaRecorder.isTypeSupported(x))||'';
  }
  function extForMime(m){ if(m.includes('ogg'))return 'ogg'; if(m.includes('mp4'))return 'mp4'; if(m.includes('wav'))return 'wav'; return 'webm'; }
  function cleanupPreview(){ if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl='';} if(els.preview){els.preview.hidden=true;els.preview.removeAttribute('src');} previewBlob=null; }

  async function startRecording(){
    if(!window.isSecureContext && location.hostname!=='localhost' && location.hostname!=='127.0.0.1'){
      setStatus('Microphone recording requires HTTPS (or localhost) in the browser.','err'); return;
    }
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){ setStatus('This browser does not support microphone recording.','err'); return; }
    cleanupPreview(); setStatus(''); chunks=[]; mimeType=chooseMime();
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      mediaRecorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined);
      mimeType=mediaRecorder.mimeType||mimeType||'audio/webm';
      mediaRecorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
      mediaRecorder.onerror=()=>{stream.getTracks().forEach(t=>t.stop()); setState('ERROR'); setStatus('Recording failed.','err'); resetTimer(); els.record.disabled=false;els.stop.disabled=true;};
      mediaRecorder.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop());
        const elapsed=Math.min(MAX_SECONDS,Math.max(0,Math.floor((Date.now()-startedAt)/1000))); recordedSeconds=elapsed;
        resetTimer(); els.recorder.classList.remove('recording'); els.record.disabled=false; els.stop.disabled=true;
        previewBlob=new Blob(chunks,{type:mimeType||'audio/webm'});
        previewUrl=URL.createObjectURL(previewBlob);
        els.preview.src=previewUrl; els.preview.hidden=false;
        els.publish.disabled=previewBlob.size===0; els.discard.disabled=false; setState('READY TO PUBLISH');
        setStatus('Recording ready. Preview it, then publish it to the shared voicemail feed.','ok');
      };
      mediaRecorder.start(250); startedAt=Date.now(); els.recorder.classList.add('recording'); els.record.disabled=true; els.stop.disabled=false; els.publish.disabled=true; els.discard.disabled=true; setState('RECORDING'); startTimer();
    }catch(err){ setState('READY'); resetTimer(); const msg=err?.name==='NotAllowedError'?'Microphone permission was denied. Please allow microphone access and try again.':(err?.message||'Microphone could not be opened.'); setStatus(msg,'err'); }
  }

  function stopRecording(){ if(mediaRecorder&&mediaRecorder.state==='recording') mediaRecorder.stop(); }
  function discardRecording(){ cleanupPreview(); chunks=[]; setState('READY'); setStatus(''); els.publish.disabled=true; els.discard.disabled=true; }

  function dataUrlFromBlob(blob){ return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(blob);});}
  function relativeTime(ts){ try{return new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts));}catch(_){return new Date(ts).toLocaleString();} }
  function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  async function loadFeed(silent=false){
    if(!silent) els.list.innerHTML='<div class="voicemail-empty">Loading public voice messages…</div>';
    try{
      const r=await fetch('/api/voicemails',{cache:'no-store'}); if(!r.ok) throw new Error('Shared voicemail service unavailable');
      const data=await r.json(); const items=Array.isArray(data.items)?data.items:[];
      els.count.textContent=items.length+' message'+(items.length===1?'':'s');
      if(!items.length){ els.list.innerHTML='<div class="voicemail-empty"><strong>No public voice messages yet</strong><span>Be the first visitor to leave a voicemail.</span></div>'; return; }
      els.list.innerHTML=items.map(item=>{
        const id=encodeURIComponent(item.id); const dur=Number.isFinite(Number(item.duration))?fmtTime(item.duration):'--:--';
        return `<article class="voicemail-item"><div class="voicemail-meta"><strong>IGERS Visitor Voicemail</strong><span>${esc(relativeTime(item.createdAt))} · ${esc(dur)}</span></div><audio controls preload="none" src="/api/voicemails/${id}/audio"></audio><div class="voicemail-server-note">Public shared recording · available to all visitors</div></article>`;
      }).join('');
    }catch(err){
      if(!silent) els.list.innerHTML='<div class="voicemail-empty"><strong>Shared feed is unavailable</strong><span>Run the included Node server to enable public cross-user voicemail.</span></div>';
      els.count.textContent='Service offline';
    }
  }

  async function publishRecording(){
    if(!previewBlob) return;
    els.publish.disabled=true; els.discard.disabled=true; setState('UPLOADING'); setStatus('Uploading voicemail to the shared feed…');
    try{
      const dataUrl=await dataUrlFromBlob(previewBlob);
      const payload={audio:dataUrl,mimeType:previewBlob.type||mimeType||'audio/webm',duration:Math.max(1,Math.min(MAX_SECONDS,recordedSeconds||1))};
      const r=await fetch('/api/voicemails',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(result.error||'Voicemail upload failed');
      cleanupPreview(); chunks=[]; setState('PUBLISHED'); setStatus('Voicemail published. Other users can now hear it from the public feed.','ok'); els.publish.disabled=true; els.discard.disabled=true; await loadFeed(true);
    }catch(err){ els.publish.disabled=false; els.discard.disabled=false; setState('READY TO PUBLISH'); setStatus(err?.message||'Voicemail could not be published.','err'); }
  }

  els.record.addEventListener('click',startRecording); els.stop.addEventListener('click',stopRecording); els.discard.addEventListener('click',discardRecording); els.publish.addEventListener('click',publishRecording); els.refresh?.addEventListener('click',()=>loadFeed(false));
  setState('READY'); loadFeed(false);
})();
