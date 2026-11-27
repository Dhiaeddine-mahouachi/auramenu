const { chromium } = require('playwright');
const origin = process.env.AURA_TEST_ORIGIN || "http://127.0.0.1:4173";
async function main() {
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']});
 try {
  for(const path of ['/index.html?lang=en','/menu-v2.html?design=sofra&gallery=1&lang=en','/menu-v2.html?design=velvet&gallery=1&lang=en']){
   const readings=[];
   for(let i=0;i<10;i++){
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.route('**/*', r=>r.request().url().startsWith(origin)?r.continue():r.abort());
    await page.addInitScript(()=>{
      window.vitals={lcp:0,cls:0};
      let start=0,end=0,sum=0;
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.vitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries()){
        if(e.hadRecentInput)continue;
        if(e.startTime-end<1000&&e.startTime-start<5000)sum+=e.value;else{start=e.startTime;sum=e.value;}
        end=e.startTime;window.vitals.cls=Math.max(sum,window.vitals.cls);
      }}).observe({type:'layout-shift',buffered:true});
    });
    const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.goto(origin+path,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(3500);
    readings.push(await page.evaluate(()=>window.vitals));
    await context.close();
   }
   const p75=(key)=>readings.map(x=>x[key]).sort((a,b)=>a-b)[Math.ceil(readings.length*.75)-1];
   console.log(JSON.stringify({path,samples:readings.length,p75LcpMs:Math.round(p75('lcp')),p75Cls:Number(p75('cls').toFixed(3)),lcpSamples:readings.filter(x=>x.lcp>0).length}));
  }
 }finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
