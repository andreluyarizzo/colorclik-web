// Screen coordinates, verified against the original 24 fps Flow film.
// Times are interpolated along the filmed arc, never between layered faces.
export const gazeArc = [
  {angle:-180,time:1.55}, {angle:-135,time:2.45},
  {angle:-90,time:3.25}, {angle:-45,time:3.65},
  {angle:0,time:4.55}, {angle:45,time:5.45},
  {angle:90,time:6.35}, {angle:135,time:7.55},
  {angle:180,time:8.05},
];
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
export function normalizePointer(x,y,rect){
  return {x:clamp(2*(x-rect.left)/rect.width-1,-1,1),y:clamp(2*(y-rect.top)/rect.height-1,-1,1)};
}
export function gazeTime(x,y,previous=0){
  const radius=Math.hypot(x,y);
  // The only open-eyed frontal hold is near the end. Keep the original still
  // when an initial pointer lands in the dead zone instead of playing a sweep.
  const neutral=previous<.025?0:9.42;
  if(radius<.16)return neutral;
  const angle=Math.atan2(y,x)*180/Math.PI;
  let index=gazeArc.findIndex(p=>p.angle>=angle);index=Math.max(1,index);
  const a=gazeArc[index-1],b=gazeArc[index];
  const directional=a.time+(b.time-a.time)*(angle-a.angle)/(b.angle-a.angle);
  // Never hold on a blink, but let those frames play naturally in transit.
  for(const [start,end] of [[.9,1.22],[2.95,3.2],[3.88,4.02],[8.4,8.85]]){
    if(directional>start&&directional<end)return directional<(start+end)/2?start-.05:end+.05;
  }
  return directional;
}
export function damp(current,target,dt,tau){return current+(target-current)*(1-Math.exp(-Math.min(dt,.05)/tau));}
