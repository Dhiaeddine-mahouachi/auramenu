// Original low-poly model for the fictional burger fixture.
const rings = [
  {color:[.83,.42,.14],profile:[[0,-.52],[.59,-.52],[.76,-.45],[.84,-.33],[.83,-.25],[0,-.23]]},
  {color:[.25,.40,.10],profile:[[.7,-.27],[.9,-.23],[.89,-.17],[.71,-.13]],wave:.04},
  {color:[.28,.12,.071],profile:[[0,-.18],[.69,-.18],[.87,-.14],[.87,-.04],[.82,.01],[0,.04]],wave:.025},
  {color:[.98,.66,.07],profile:[[0,.018],[.88,.02],[.85,.075],[0,.08]],wave:.015},
  {color:[.31,.12,.07],profile:[[0,.07],[.82,.08],[.86,.13],[.83,.23],[0,.24]],wave:.02},
  {color:[.41,.52,.13],profile:[[.58,.21],[.88,.25],[.86,.29],[.64,.30]],wave:.028},
  {color:[.94,.72,.32],profile:[[0,.30],[.85,.30],[.87,.36],[.81,.49],[.68,.61],[.44,.69],[.18,.725],[0,.73]]},
];

export function smashMesh() {
  const data=[];
  const slices=40;
  const triangle=(a,b,c,color)=>{
    const u=b.map((value,i)=>value-a[i]),v=c.map((value,i)=>value-a[i]);
    const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const length=Math.hypot(...normal);
    if (length<1e-7) return;
    const unit=normal.map(value=>value/length);
    for (const corner of [a,b,c]) data.push(...corner,...unit,...color);
  };
  for (const {profile,color,wave=0} of rings) {
    function position(index,step) {
      const [radius,height]=profile[index];
      const angle=step*2*Math.PI/slices;
      const r=radius*(1+wave*Math.cos(angle*7));
      return [r*Math.cos(angle),height+wave*Math.sin(angle*5)*radius,r*Math.sin(angle)];
    }
    for (let row=1;row<profile.length;row++) {
      for (let step=0;step<slices;step++) {
        const a=position(row-1,step),b=position(row,step),c=position(row,step+1),d=position(row-1,step+1);
        triangle(a,b,c,color);
        triangle(a,c,d,color);
      }
    }
  }
  return new Float32Array(data);
}
