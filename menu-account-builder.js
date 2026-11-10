/* Shared AuraDigital customer identity. The hosting environment must route /api
 * to the shared backend; unrelated-domain cookies are never assumed to work.
 */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),API='/api/customer';
  let current=null,verified=false,checking=null;
  async function api(path,body) {
    const response=await fetch(API+path,{method:body===undefined?'GET':'POST',cache:'no-store',credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const data=await response.json().catch(()=>({error:'Sign-in is unavailable here. Your draft remains on this device. Try again later.'}));
    if(!response.ok)throw new Error(data.error||'Account service unavailable.');
    return data;
  }
  function show(user,isVerified=false) {
    current=user;verified=isVerified;
    $('menuAccountFields').hidden=!!user;$('menuVerification').hidden=!user||verified;$('menuSignedIn').hidden=!user;
    for(const id of ['contactName','email'])$(id).closest('label').hidden=!!user;
    if(user){
      $('contactName').value=user.name;$('email').value=user.email;
      $('menuSignedIn').textContent='Signed in as '+user.name+'. Payment and publication still require verification.';
      $('menuPassword').value='';$('menuConfirmPassword').value='';
      $('menuVerificationEmail').textContent='Open the verification link sent to '+user.email+', then return here and check verification.';
    }
  }
  async function session() {
    const data=await api('/session');
    if(!data.user){show(null);return null;}
    // Verification comes from the backend, never a checkbox or client profile.
    const status=await api('/verification-status');
    show(data.user,status.verified===true);
    return data.user;
  }
  async function refresh() {
    if(checking)return checking;
    checking=(async()=>{try{await session();$('menuAccountStatus').textContent=current?(verified?'Email verified.':'Verify your email before submitting.'):'Create your AuraDigital account below or sign in in another tab.';}
      catch(error){show(null);$('menuAccountFields').hidden=true;$('menuAccountStatus').textContent=error.message;}
      finally{checking=null;}})();
    return checking;
  }
  window.ensureAuraMenuAccount=async()=>{
    await session();
    if(!current){
      if($('menuPassword').value!==$('menuConfirmPassword').value)throw new Error('Passwords do not match.');
      if(!$('menuAcceptTerms').checked)throw new Error('Accept the account terms before registration.');
      await api('/register',{name:$('contactName').value,email:$('email').value,password:$('menuPassword').value,acceptTerms:true});
      await session();
    }
    if(!current)throw new Error('Sign in before submitting.');
    if(!verified){await api('/send-verification',{});throw new Error('Open the verification link in your email, then return and check verification before submitting.');}
    return current;
  };
  $('menuVerify').onclick=async()=>{await refresh();};
  $('menuResend').onclick=async()=>{
    const button=$('menuResend');button.disabled=true;
    try{await api('/send-verification',{});$('menuAccountStatus').textContent='Verification link sent. Check your inbox and spam folder.';}
    catch(error){$('menuAccountStatus').textContent=error.message;}
    finally{button.disabled=false;}
  };
  refresh();window.addEventListener('focus',refresh);window.addEventListener('pageshow',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
