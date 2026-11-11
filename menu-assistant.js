/* Browser adapter for the deterministic assistant. All applied changes are reviewed. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), bridge = window.AuraMenuVoiceBridge, core = window.AuraMenuAssistantCore;
  if (!bridge || !core || !$('assistantSource')) return;
  let pending = null, recognizer = null, session = 0;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const status = (text, error = false) => { $('assistantStatus').textContent = text; $('assistantStatus').dataset.error = String(error); };
  function invalidate() { pending = null; $('assistantApply').hidden = true; $('assistantChanges').replaceChildren(); }
  function stop() {
    session += 1;
    const old = recognizer; recognizer = null;
    try { old?.abort?.(); } catch {}
    $('assistantStart').disabled = !Recognition; $('assistantStop').hidden = true;
  }
  for (const id of ['assistantSource', 'assistantMode']) $(id).addEventListener(id === 'assistantSource' ? 'input' : 'change', invalidate);
  $('assistantReview').onclick = () => {
    stop(); invalidate();
    try {
      const source = $('assistantSource').value, mode = $('assistantMode').value, state = bridge.getDraft();
      const proposal = core.propose(source, state, mode);
      pending = { source, mode, proposal, expected: JSON.stringify(state) };
      for (const change of proposal.changes) { const li = document.createElement('li'); li.textContent = change; $('assistantChanges').append(li); }
      if (proposal.unresolved.length) {
        const li = document.createElement('li'); li.textContent = 'Not understood; these lines will not be added: ' + proposal.unresolved.join(' · '); $('assistantChanges').append(li);
      }
      status('Review the changes and ignored lines above. Check missing prices, currency, categories and spelling before applying.');
      $('assistantApply').hidden = false;
    } catch (error) { status(error.message || 'Could not prepare changes.', true); }
  };
  $('assistantApply').onclick = () => {
    try {
      if (!pending || pending.source !== $('assistantSource').value || pending.mode !== $('assistantMode').value) throw new Error('Review the current text before applying.');
      bridge.applyReviewed(pending.proposal, pending.expected);
      invalidate(); $('assistantSource').value = '';
      status('Draft and live preview updated. Continue editing below. Nothing has been purchased or published.');
    } catch (error) { invalidate(); status(error.message || 'Review again before applying.', true); }
  };
  $('assistantCsv').onchange = async () => {
    invalidate(); stop();
    const file = $('assistantCsv').files?.[0];
    if (!file) return;
    // Bound before reading; UTF-8 multibyte text may use more bytes than characters.
    if (file.size > 60000 || !file.name.toLowerCase().endsWith('.csv')) { status('Choose a CSV file up to 60 KB (15,000 characters).', true); return; }
    try {
      const text = await file.text();
      if (text.length > 15000) throw new Error('CSV exceeds 15,000 characters.');
      core.csv(text); $('assistantSource').value = text;
      if ($('assistantMode').value === 'edit') $('assistantMode').value = 'append';
      status('CSV loaded. Review the proposed changes before applying.');
    } catch (error) { status(error.message || 'Could not read CSV.', true); }
    finally { $('assistantCsv').value = ''; }
  };
  document.addEventListener('auramenu:speech-start', event => { if (event.detail !== 'assistant') stop(); });
  $('assistantStart').onclick = () => {
    document.dispatchEvent(new CustomEvent('auramenu:speech-start', { detail: 'assistant' }));
    stop(); invalidate();
    if (!Recognition) return status('Speech recognition is unavailable. Type or use your keyboard microphone.', true);
    if (!window.isSecureContext) return status('Speech needs HTTPS or localhost. You can still type.', true);
    const activeSession = ++session;
    try {
      const r = new Recognition(); recognizer = r;
      r.lang = ({ en: 'en-US', tr: 'tr-TR', ar: 'ar-SA' })[document.documentElement.lang] || 'en-US';
      r.continuous = false; r.interimResults = false;
      r.onresult = event => {
        if (activeSession !== session) return;
        const text = Array.from(event.results).filter(value => value.isFinal).map(value => value[0]?.transcript || '').join(' ').trim();
        if (!text) return status('No speech detected. Try again or type.', true);
        $('assistantSource').value = text; invalidate(); status('Transcript ready. Correct it before reviewing.');
      };
      r.onerror = event => { if (activeSession === session) status(['not-allowed', 'service-not-allowed'].includes(event.error) ? 'Microphone permission denied. Type or enable microphone access in browser settings.' : 'Speech recognition failed. You can still type.', true); };
      r.onend = () => { if (activeSession === session) { recognizer = null; $('assistantStart').disabled = false; $('assistantStop').hidden = true; } };
      r.start(); $('assistantStart').disabled = true; $('assistantStop').hidden = false; status('Listening…');
    } catch { stop(); status('Speech recognition could not start. You can still type.', true); }
  };
  $('assistantStop').onclick = () => { try { recognizer?.stop(); } catch {} status('Finishing transcript…'); };
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  if (!Recognition) { $('assistantStart').disabled = true; status('Type details, paste CSV, or use your keyboard microphone.'); }
})();
