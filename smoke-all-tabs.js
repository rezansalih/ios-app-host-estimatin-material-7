#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const DIR=path.join(__dirname,'..');
// app.js / app-ui.js are external files; inline them (function replacement, so
// the "$" sequences in the sources are not read as substitution patterns).
let html=fs.readFileSync(path.join(DIR,'index.html'),'utf8');
html = html.replace('<link rel="stylesheet" href="./new-style.css">',
  () => '<style>' + fs.readFileSync(path.join(DIR, 'new-style.css'), 'utf8') + '<\/style>')
   .replace(/<script src="\.\/app\.js"[^>]*><\/script>/,
  ()=>'<script>'+fs.readFileSync(path.join(DIR,'app.js'),'utf8')+'<\/script>')
  .replace(/<script src="\.\/app-ui\.js"[^>]*><\/script>/,
  ()=>'<script>'+fs.readFileSync(path.join(DIR,'app-ui.js'),'utf8')+'<\/script>')
  .replace(/<script src="\.\/concrete-calculations\.js"[^>]*><\/script>/,
  ()=>'<script>'+fs.readFileSync(path.join(DIR,'concrete-calculations.js'),'utf8')+'<\/script>');

// Lazy calc chunks: inline them here (a real browser fetches calc-*.js on first tool open).
html = html.replace('</body>', () => ['calc-concrete','calc-blocks','calc-bricks','calc-steel','calc-earthwork'].map(n => '<script>' + fs.readFileSync(path.join(DIR, n + '.js'), 'utf8') + '<\/script>').join('') + '</body>');
const tick=ms=>new Promise(r=>setTimeout(r,ms));
async function boot(){
  const vc=new VirtualConsole(); const errs=[];
  vc.on('jsdomError',e=>errs.push(String(e.message).split('\n')[0]));
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
    beforeParse(w){w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent:()=>false});w.scrollTo=()=>{};w.Element.prototype.scrollIntoView=()=>{};}});
  await tick(250); return {dom,errs};
}
const set=(d,id,v)=>{const e=d.getElementById(id); if(!e) throw new Error('missing #'+id); e.value=String(v);};
(async()=>{
  // BLOCKS: 10x3 wall, 0.2 m, 1 leaf, hollow block 40x20x20
  let env=await boot(); let d=env.dom.window.document;
  set(d,'block-wall-length',10); set(d,'block-wall-height',3); set(d,'block-wall-width-input',0.2);
  set(d,'block-leaves',1); set(d,'block-mortar-thickness',1.0); set(d,'block-mortar-ratio','1:4');
  set(d,'block-cost',1.2); set(d,'block-cement-cost',8); set(d,'block-sand-cost',25);
  set(d,'block-num-windows',1); set(d,'block-window-width',2); set(d,'block-window-height',1.5);
  d.getElementById('calculate-blocks').click();
  console.log('BLOCKS  :', d.getElementById('blocks-result').textContent.replace(/\s+/g,' ').slice(0,300));
  console.log('  errors:', env.errs);

  // CONCRETE
  env=await boot(); d=env.dom.window.document;
  set(d,'concrete-length',5); set(d,'concrete-width',4); set(d,'concrete-thickness',0.2); set(d,'concrete-quantity',1);
  d.getElementById('calculate-concrete').click();
  console.log('CONCRETE:', d.getElementById('concrete-result').textContent.replace(/\s+/g,' ').slice(0,220));
  console.log('  errors:', env.errs);

  // STEEL
  env=await boot(); d=env.dom.window.document;
  try{
    set(d,'one-way-dist-length',5); set(d,'one-way-bar-length',5); set(d,'one-way-spacing',150); set(d,'one-way-diameter',12);
    const b=d.getElementById('calculate-steel'); if(b) b.click();
    console.log('STEEL   :', d.getElementById('steel-result')?.textContent.replace(/\s+/g,' ').slice(0,160) || '(no result el)');
  }catch(e){ console.log('STEEL   : setup issue -', e.message); }
  console.log('  errors:', env.errs);

  // EARTHWORK
  env=await boot(); d=env.dom.window.document;
  try{
    const ids=['earthwork-length','earthwork-width','earthwork-depth','earthwork-sections','earthwork-swell','earthwork-truck'];
    const present=ids.filter(i=>d.getElementById(i));
    console.log('EARTHWORK inputs found:', present.join(', '));
  }catch(e){ console.log('EARTHWORK: setup issue -', e.message); }

  // Language switch smoke: make sure ku / ks / ar render without throwing
  for (const lang of ['ku','ks','ar']) {
    env=await boot(); d=env.dom.window.document;
    env.dom.window.localStorage.setItem('language',lang);
    set(d,'brick-wall-length',5); set(d,'brick-wall-height',3); set(d,'brick-wall-width-input',0.115);
    set(d,'brick-num-windows',1); set(d,'brick-window-width',1.2); set(d,'brick-window-height',1.2);
    d.getElementById('calculate-bricks').click();
    const t=d.getElementById('bricks-result').textContent.replace(/\s+/g,' ');
    const m=t.match(/([^\s]+ [^\s]*م٣[^\s]*)|\d+\.\d+ m³/g);
    console.log(lang.toUpperCase(),':', t.slice(0,150), '| errors:', env.errs.length);
  }
})();
