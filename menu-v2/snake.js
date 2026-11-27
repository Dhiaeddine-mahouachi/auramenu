/* AuraMenu 2.0 — "Snack Snake": lightweight food-themed Snake game.
   Loaded only when a guest opens it; no effect on the menu's first load. */
(function () {
  "use strict";
  const FOODS = ["🍔", "🍕", "🌯", "🍩", "🥙", "🍉", "🧁", "🥐", "🍓", "🍟", "🥗", "🍋"];
  function start(root, theme) {
    const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
    const N = 16, S = cv.width / N; let snake, dir, next, food, score, timer, dead;
    const bestKey = "am2-snake-best"; let best = 0; try { best = Number(localStorage.getItem(bestKey)) || 0; } catch {}
    root.querySelector("[data-best]").textContent = best;
    const place = () => { do { food = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0, e: FOODS[(Math.random() * FOODS.length) | 0] }; } while (snake.some((p) => p.x === food.x && p.y === food.y)); };
    const reset = () => { snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }]; dir = next = { x: 1, y: 0 }; score = 0; dead = false; place(); upd(); clearInterval(timer); timer = setInterval(step, 130); draw(); };
    const upd = () => (root.querySelector("[data-score]").textContent = score);
    const turn = (d) => { const m = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[d]; if (m && (m.x !== -dir.x || m.y !== -dir.y)) next = m; };
    function step() {
      dir = next; const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
      if (snake.some((p) => p.x === h.x && p.y === h.y)) { dead = true; clearInterval(timer); if (score > best) { best = score; try { localStorage.setItem(bestKey, best); } catch {} root.querySelector("[data-best]").textContent = best; } draw(); return; }
      snake.unshift(h); if (h.x === food.x && h.y === food.y) { score++; upd(); place(); } else snake.pop(); draw();
    }
    function draw() {
      ctx.fillStyle = theme.surface.trim() || "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "rgba(0,0,0,.04)"; for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) if ((x + y) % 2) ctx.fillRect(x * S, y * S, S, S);
      snake.forEach((p, i) => { ctx.fillStyle = i ? theme.accent : theme.accent2; const r = S / 2.4; ctx.beginPath(); ctx.roundRect(p.x * S + 1.5, p.y * S + 1.5, S - 3, S - 3, r); ctx.fill(); });
      const h = snake[0]; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(h.x * S + S * 0.35, h.y * S + S * 0.38, 2.4, 0, 7); ctx.arc(h.x * S + S * 0.65, h.y * S + S * 0.38, 2.4, 0, 7); ctx.fill();
      ctx.font = `${S * 0.82}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(food.e, food.x * S + S / 2, food.y * S + S / 2 + 1);
      if (dead) { ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(0, 0, cv.width, cv.height); ctx.fillStyle = "#fff"; ctx.font = "bold 28px system-ui"; ctx.fillText(`🍽️ ${score}`, cv.width / 2, cv.height / 2); }
    }
    const key = (e) => { const k = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" }[e.key]; if (k) { e.preventDefault(); turn(k); } };
    root.addEventListener("keydown", key);
    root.querySelectorAll("[data-dir]").forEach((b) => (b.onclick = () => turn(b.dataset.dir)));
    let sx, sy; cv.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    cv.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return; turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up"); });
    root.querySelector("[data-restart]").onclick = reset;
    const obs = new MutationObserver(() => { if (!document.body.contains(root)) { clearInterval(timer); obs.disconnect(); } }); obs.observe(document.body, { childList: true });
    reset(); cv.focus();
  }
  window.AuraSnake = { start };
})();
