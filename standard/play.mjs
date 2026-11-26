import { button, el } from './dom.mjs';

export function playInvitation(t, dialog, signal) {
  const status = el('p','sm-game-status');
  status.setAttribute('aria-live','polite');
  const launch = button(t.play, async () => {
    launch.disabled = true;
    status.textContent = '';
    try {
      const { mountGame } = await import('./snake.mjs');
      if (!signal.aborted) dialog(t.play,(body, closeSignal) => mountGame(body,t,closeSignal));
    } catch {
      if (!signal.aborted) status.textContent = t.gameError;
    } finally { launch.disabled = false; }
  },'sm-action');
  return el('aside','sm-play',el('div','',el('strong','','AuraPlay'),el('p','',t.playText),status),launch);
}
