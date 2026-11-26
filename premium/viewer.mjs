import { button, el } from '../standard/dom.mjs';
import { smashMesh } from './smash-model.mjs';

const vertexSource=`
attribute vec3 position, normal, color;
uniform vec2 angles;
uniform vec2 scale;
varying vec3 tint;
vec3 rotate(vec3 p) {
  float cy=cos(angles.x),sy=sin(angles.x),cx=cos(angles.y),sx=sin(angles.y);
  vec3 q=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);
  return vec3(q.x,q.y*cx-q.z*sx,q.y*sx+q.z*cx);
}
void main() {
  vec3 p=rotate(position);
  vec3 n=rotate(normal);
  tint=color*(.56+.44*max(0.0,dot(n,normalize(vec3(-.5,.85,.65)))));
  gl_Position=vec4(p.xy*scale,-.5*p.z,1.0);
}`;
const fragmentSource=`
precision mediump float;
varying vec3 tint;
void main(){ gl_FragColor=vec4(tint,1.0); }`;

export function mountModel(stage,t,signal) {
  const canvas=el('canvas');
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',t.viewing);
  const gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'low-power'});
  if (!gl) throw new Error('WebGL unavailable');
  const program=gl.createProgram();
  const buffer=gl.createBuffer();
  if (!program || !buffer) throw new Error('WebGL allocation failed');
  let resize;
  const cleanup=()=>{
    resize?.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  signal.addEventListener('abort',cleanup,{once:true});
  try {
    for (const [type,source] of [[gl.VERTEX_SHADER,vertexSource],[gl.FRAGMENT_SHADER,fragmentSource]]) {
      const shader=gl.createShader(type);
      if (!shader) throw new Error('WebGL allocation failed');
      gl.shaderSource(shader,source);
      gl.compileShader(shader);
      const valid=gl.getShaderParameter(shader,gl.COMPILE_STATUS);
      if (valid) gl.attachShader(program,shader);
      gl.deleteShader(shader);
      if (!valid) throw new Error('WebGL shader failed');
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('WebGL link failed');
  } catch (error) {
    signal.removeEventListener('abort',cleanup);
    cleanup();
    throw error;
  }
  gl.useProgram(program);
  const mesh=smashMesh();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
  for (const [index,name] of ['position','normal','color'].entries()) {
    const location=gl.getAttribLocation(program,name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location,3,gl.FLOAT,false,36,index*12);
  }
  const angles=gl.getUniformLocation(program,'angles');
  const scale=gl.getUniformLocation(program,'scale');
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0,0,0,0);
  let yaw=-.24,pitch=.24,zoom=1,drag;
  function draw() {
    if (document.hidden || signal.aborted || gl.isContextLost()) return;
    const pixels=Math.min(devicePixelRatio,1.5);
    const width=Math.max(1,Math.round(canvas.clientWidth*pixels));
    const height=Math.max(1,Math.round(canvas.clientHeight*pixels));
    if (canvas.width!==width || canvas.height!==height) { canvas.width=width; canvas.height=height; }
    gl.viewport(0,0,width,height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const unit=Math.min(width,height)*.88*zoom;
    gl.uniform2f(angles,yaw,pitch);
    gl.uniform2f(scale,unit/width,unit/height);
    gl.drawArrays(gl.TRIANGLES,0,mesh.length/9);
  }
  const rotate=(x,y)=>{yaw+=x;pitch=Math.max(-1.35,Math.min(1.35,pitch+y));draw();};
  const magnify=factor=>{zoom=Math.max(.55,Math.min(1.65,zoom*factor));draw();};
  canvas.addEventListener('pointerdown',event=>{
    if (drag) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
  },{signal});
  canvas.addEventListener('pointermove',event=>{
    if (drag?.id!==event.pointerId) return;
    rotate((event.clientX-drag.x)*.013,(event.clientY-drag.y)*.013);
    drag.x=event.clientX;
    drag.y=event.clientY;
  },{signal});
  for (const name of ['pointerup','pointercancel','lostpointercapture']) {
    canvas.addEventListener(name,event=>{if(drag?.id===event.pointerId) drag=null;},{signal});
  }
  canvas.addEventListener('webglcontextlost',()=>{
    if (signal.aborted) return;
    const notice=el('p','',t.modelFailed);
    notice.setAttribute('role','status');
    stage.replaceChildren(notice);
    resize?.disconnect();
  },{signal});
  const controls=el('div','pa-model-controls',
    button(t.left,()=>rotate(-.24,0),'sm-pill'),
    button(t.right,()=>rotate(.24,0),'sm-pill'),
    button(t.up,()=>rotate(0,-.24),'sm-pill'),
    button(t.down,()=>rotate(0,.24),'sm-pill'),
    button(t.zoomIn,()=>magnify(1.15),'sm-pill'),
    button(t.zoomOut,()=>magnify(1/1.15),'sm-pill'),
    button(t.reset,()=>{yaw=-.24;pitch=.24;zoom=1;draw();},'sm-pill'));
  stage.append(canvas,controls);
  resize=new ResizeObserver(draw);
  resize.observe(canvas);
  document.addEventListener('visibilitychange',draw,{signal});
  draw();
}
