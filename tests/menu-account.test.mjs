import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source=readFileSync(new URL('../menu-account-builder.js',import.meta.url),'utf8');
async function fixture({user=null,verified=false,fail=false}={}) {
 const elements=new Map(),calls=[];
 const el=id=>{if(!elements.has(id)){const label={hidden:false};elements.set(id,{hidden:false,value:'',checked:false,textContent:'',disabled:false,closest:()=>label});}return elements.get(id);};
 let current=user,isVerified=verified;
 const window={},document={hidden:false,getElementById:el,addEventListener(){}};window.addEventListener=()=>{};
 const fetch=async(url,options)=>{calls.push({url,options});if(fail)return {ok:false,json:async()=>{throw new Error('Not JSON');}};
 const path=url.replace('/api/customer','');let data={};
 if(path==='/session')data={user:current};
 else if(path==='/verification-status')data={verified:isVerified};
 else if(path==='/register'){const body=JSON.parse(options.body);current={id:'u',email:body.email,name:body.name};data={user:current};}
 else if(path==='/send-verification')data={sent:true};
 else throw new Error('Unexpected endpoint '+path);
 return {ok:true,json:async()=>data};};
 runInNewContext(source,{window,document,fetch});
 await new Promise(resolve=>setImmediate(resolve));
 return {window,el,calls,verify(){isVerified=true;}};
}
test('builder reuses shared identity, refuses unverified submission and refreshes verification',async()=>{const f=await fixture({user:{id:'u',name:'Owner',email:'owner@test.test'}});await assert.rejects(()=>f.window.ensureAuraMenuAccount(),/verification link/);assert.equal(f.el('menuVerification').hidden,false);assert(f.calls.some(c=>c.url==='/api/customer/send-verification'));f.verify();const user=await f.window.ensureAuraMenuAccount();assert.equal(user.id,'u');assert.equal(f.el('menuVerification').hidden,true);assert.equal(f.el('menuAccountFields').hidden,true);assert(f.calls.every(c=>c.options.credentials==='same-origin'&&c.options.cache==='no-store'));});
test('registration requires matching passwords and explicit terms; password never enters session display',async()=>{const f=await fixture();f.el('contactName').value='Owner';f.el('email').value='owner@test.test';f.el('menuPassword').value='Long password 123';f.el('menuConfirmPassword').value='different';await assert.rejects(()=>f.window.ensureAuraMenuAccount(),/match/);f.el('menuConfirmPassword').value='Long password 123';await assert.rejects(()=>f.window.ensureAuraMenuAccount(),/terms/);f.el('menuAcceptTerms').checked=true;await assert.rejects(()=>f.window.ensureAuraMenuAccount(),/verification link/);const registration=f.calls.find(c=>c.url.endsWith('/register'));assert.equal(JSON.parse(registration.options.body).acceptTerms,true);assert.equal(f.el('menuPassword').value,'');assert.equal(f.el('menuConfirmPassword').value,'');assert.equal(f.calls.some(c=>c.url.startsWith('/api/aurapops')),false);});
test('missing proxy/provider fails closed with a recoverable message and cannot claim verification',async()=>{const f=await fixture({fail:true});assert.match(f.el('menuAccountStatus').textContent,/draft remains/);await assert.rejects(()=>f.window.ensureAuraMenuAccount(),/unavailable/);assert.equal(f.el('menuAccountFields').hidden,true);assert.equal(f.calls.some(c=>c.url.endsWith('/register')),false);});
