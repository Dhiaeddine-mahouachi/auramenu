import { button, el } from './dom.mjs';

const bestKey = 'auramenu-snake-best';
const edge = 16;
const arrows = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
export function mountGame(root, t, signal) {
  const canvas = el('canvas','sm-canvas');
  canvas.width = canvas.height = 256;
  canvas.setAttribute('aria-label',t.controls);
  const context = canvas.getContext('2d');
  const style = getComputedStyle(root);
  const score = el('bdi','','0');
  const best = el('bdi','','0');
  const message = el('p','sm-game-message');
  message.setAttribute('role','status');
  let high = 0;
  try { high = Math.max(0,Number(localStorage.getItem(bestKey)) || 0); } catch {}
  best.textContent = high;
  let snake, direction, queued, food, timer, scoreValue, startPoint;
  function draw() {
    context.fillStyle = style.getPropertyValue('--sm-surface').trim() || '#eeeeee';
    context.fillRect(0,0,256,256);
    context.fillStyle = style.getPropertyValue('--sm-text').trim() || '#151515';
    snake.forEach(([x,y]) => context.fillRect(x*edge+1,y*edge+1,edge-2,edge-2));
    if (food) {
      context.fillStyle = style.getPropertyValue('--sm-accent').trim() || '#bd3f18';
      context.fillRect(food[0]*edge+2,food[1]*edge+2,edge-4,edge-4);
      context.strokeStyle = style.getPropertyValue('--sm-text').trim() || '#151515';
      context.strokeRect(food[0]*edge+2,food[1]*edge+2,edge-4,edge-4);
    }
  }
  function placeFood() {
    const occupied = new Set(snake.map(([x,y]) => y*edge+x));
    const free = Array.from({length:edge*edge},(_,index) => index).filter(index => !occupied.has(index));
    const cell = free[Math.floor(Math.random()*free.length)];
    food = cell === undefined ? null : [cell%edge,Math.floor(cell/edge)];
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function reset() {
    stop();
    snake = [[7,7],[6,7],[5,7]];
    direction = [1,0];
    queued = null;
    scoreValue = 0;
    score.textContent = '0';
    message.textContent = '';
    placeFood();
    draw();
  }
  function tick() {
    if (queued) direction = queued;
    queued = null;
    const x = snake[0][0] + direction[0], y = snake[0][1] + direction[1];
    const eat = food && x === food[0] && y === food[1];
    if (x < 0 || y < 0 || x >= edge || y >= edge || snake.some(([sx,sy],index) => (eat || index < snake.length-1) && sx === x && sy === y)) {
      stop();
      message.textContent = t.over;
      start.textContent = t.restart;
      return;
    }
    snake.unshift([x,y]);
    if (eat) {
      score.textContent = ++scoreValue;
      if (scoreValue > high) {
        best.textContent = high = scoreValue;
        try { localStorage.setItem(bestKey,String(high)); } catch {}
      }
      placeFood();
      if (!food) { stop(); message.textContent = t.over; }
    } else snake.pop();
    draw();
  }
  function turn(next) {
    if (timer && !queued && next[0]*direction[0]+next[1]*direction[1] === 0) queued = next;
  }
  const start = button(t.start,() => {
    reset();
    start.textContent = t.restart;
    timer = setInterval(tick,143);
  },'sm-action');
  root.append(el('div','sm-score',el('span','',t.score,' ',score),el('span','',t.best,' ',best)),
    canvas,el('p','',t.controls),message,start);
  root.addEventListener('keydown',event => {
    if (!Object.hasOwn(arrows,event.key)) return;
    event.preventDefault();
    turn(arrows[event.key]);
  },{signal});
  canvas.addEventListener('pointerdown',event => {
    startPoint = [event.clientX,event.clientY];
    canvas.setPointerCapture(event.pointerId);
  },{signal});
  canvas.addEventListener('pointercancel',() => { startPoint = null; },{signal});
  canvas.addEventListener('pointerup',event => {
    if (!startPoint) return;
    const x = event.clientX-startPoint[0], y = event.clientY-startPoint[1];
    startPoint = null;
    if (Math.max(Math.abs(x),Math.abs(y)) >= 12) turn(Math.abs(x)>Math.abs(y) ? [Math.sign(x),0] : [0,Math.sign(y)]);
  },{signal});
  document.addEventListener('visibilitychange',() => {
    if (document.hidden && timer) { stop(); message.textContent = t.pause; }
  },{signal});
  signal.addEventListener('abort',stop,{once:true});
  reset();
}
