(()=>{
const $=id=>document.getElementById(id),API="/api/aurapops/account";let current=null,checking;
async function api(path,body){const r=await fetch(API+path,{method:body===undefined?"GET":"POST",cache:"no-store",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:body===undefined?undefined:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Account service unavailable.");return d;}
function show(d){current=d.user||null;const pending=d.verificationRequired||current&&!current.emailVerified;$("menuAccountFields").hidden=!!current||!!pending;$("menuVerification").hidden=!pending;$("menuSignedIn").hidden=!current;
for(const id of ["contactName","email"]){$(id).closest("label").hidden=!!current||!!pending;}
if(current){$("contactName").value=current.name;$("email").value=current.email;$("menuSignedIn").textContent="Signed in as "+current.name+" · This menu belongs to your account.";$("menuPassword").value="";$("menuConfirmPassword").value="";}
if(pending)$("menuVerificationEmail").textContent="Verify "+(d.email||current?.email||"your email")+" with the six-digit code.";
$("menuAccountStatus").textContent="";}
async function refresh(){if(checking)return checking;checking=(async()=>{try{show(await api("/session"));}catch(e){$("menuAccountFields").hidden=true;$("menuAccountStatus").textContent="Account connection unavailable. Please refresh or try again shortly.";}finally{checking=null;}})();return checking;}
window.ensureAuraMenuAccount=async()=>{
let d=await api("/session");show(d);
if(!d.user&&!d.verificationRequired){
if($("menuPassword").value!==$("menuConfirmPassword").value)throw new Error("Passwords do not match.");
d=await api("/register",{name:$("contactName").value,email:$("email").value,password:$("menuPassword").value,confirmPassword:$("menuConfirmPassword").value});show(d);
}
if(d.verificationRequired||!d.user?.emailVerified){if(d.user&&!d.verificationRequired){await api("/verification/send",{});show({...d,verificationRequired:true});}throw new Error("Check your email and verify the code below before submitting your menu.");}
return d.user;
};
$("menuVerify").onclick=async()=>{const b=$("menuVerify");b.disabled=true;try{const d=await api("/verification/confirm",{code:$("menuVerificationCode").value});show(d);$("menuAccountStatus").textContent="Email verified. Submit your menu to save it to your account.";}catch(e){$("menuAccountStatus").textContent=e.message;}finally{b.disabled=false;}};
$("menuResend").onclick=async()=>{const b=$("menuResend");b.disabled=true;try{await api("/verification/send",{});$("menuAccountStatus").textContent="New code sent. Check your inbox and spam folder.";}catch(e){$("menuAccountStatus").textContent=e.message;}finally{b.disabled=false;}};
refresh();window.addEventListener("focus",refresh);window.addEventListener("pageshow",refresh);document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh();});
})();