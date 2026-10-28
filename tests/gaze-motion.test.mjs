import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePointer,gazeTime,gazeArc,damp} from '../src/gaze-motion.mjs';
test('normalizes within the hero, with clamped coordinates outside its edges',()=>{
 const rect={left:80,top:100,width:1000,height:600};
 assert.deepEqual(normalizePointer(580,400,rect),{x:0,y:0});
 assert.deepEqual(normalizePointer(80,100,rect),{x:-1,y:-1});
 assert.deepEqual(normalizePointer(3000,2000,rect),{x:1,y:1});
});
test('uses measured source moments for the eight compass directions',()=>{
 for(const pose of gazeArc.slice(1,-1)){
  const angle=pose.angle*Math.PI/180;
  assert.ok(Math.abs(gazeTime(Math.cos(angle),Math.sin(angle))-pose.time)<1e-8);
 }
 assert.equal(gazeTime(-1,0),8.05);
 assert.equal(gazeTime(0,0,0),0);
 assert.equal(gazeTime(0,0,8),9.42);
});
test('damping converges monotonically and stays bounded after a suspended tab',()=>{
 let value=-1;
 for(let i=0;i<180;i++){const next=damp(value,1,1/60,.09);assert.ok(next>=value&&next<=1);value=next;}
 assert.ok(Math.abs(value-1)<1e-6);
 assert.ok(damp(0,1,30,.28)<.2);
});
