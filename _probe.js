/* 行為診斷（gitignored）：釘出士氣模型的數值。
   目標四格都要對：勢均力敵沒人崩 / 被伏擊脆的崩硬的不崩 / 雙方殘破弱的先崩 / 打順了穩。 */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const noop=()=>{};
function mkCtx(){const b={canvas:null,measureText:()=>({width:40}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>null,getImageData:()=>({data:[]}),setLineDash:noop,getLineDash:()=>[]};return new Proxy(b,{get(t,k){return k in t?t[k]:(typeof k==='string'?noop:undefined)},set(t,k,v){t[k]=v;return true}})}
function mkCv(w=1280,h=720){return{width:w,height:h,style:{},getContext:()=>mkCtx(),getBoundingClientRect:()=>({left:0,top:0,width:w,height:h}),addEventListener:noop,removeEventListener:noop,requestPointerLock:noop}}
function mkEl(t){const e={tagName:(t||'div').toUpperCase(),style:{},dataset:{},children:[],classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},appendChild(c){this.children.push(c);return c},removeChild:noop,addEventListener:noop,removeEventListener:noop,setAttribute:noop,getAttribute:()=>null,querySelector:()=>null,querySelectorAll:()=>[],insertBefore(c){this.children.push(c);return c},remove:noop,focus:noop,blur:noop,click:noop};return t==='canvas'?Object.assign(mkCv(),e):e}
function boot(){
  let src=fs.readFileSync(path.join(__dirname,'index.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1].replace(/requestAnimationFrame\(frame\);\s*$/,'');
  const store={},cvEl=mkCv();
  const sb={console,document:{body:mkEl('body'),head:mkEl('head'),pointerLockElement:null,getElementById:i=>i==='cv'?cvEl:null,createElement:mkEl,createTextNode:()=>mkEl('t'),addEventListener:noop,removeEventListener:noop,exitPointerLock:noop,querySelector:()=>null,querySelectorAll:()=>[]},localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},clear:noop},performance:{now:()=>Date.now()},location:{search:''},requestAnimationFrame:noop,cancelAnimationFrame:noop,addEventListener:noop,removeEventListener:noop,alert:noop,prompt:()=>null,confirm:()=>false,getComputedStyle:()=>({getPropertyValue:()=>''}),devicePixelRatio:1,innerWidth:1280,innerHeight:720,setTimeout,clearTimeout,setInterval,clearInterval};
  sb.window=sb;sb.globalThis=sb;vm.createContext(sb);vm.runInContext(src,sb);
  const R=c=>vm.runInContext(c,sb); R('pointerLocked = true;'); return R;
}
const R = boot();
R("enterArena('melee');");

// 在 VM 裡定義評估函式，避免在字串裡拼太複雜的程式
R(`globalThis.__evalCase = function(exp, Ap, Ae, mom){
  CONFIG.morale.absExp = exp;
  simTime = 0; resetFactionMorale();
  factionMorale.player = Ap; factionMorale.enemy = Ae;
  if (mom) grantMomentum('enemy', mom, 15);
  const res = resolveOf('player');
  const broke = Object.keys(ARCH_BREAK_PCT).filter(function(a){ return res < 50 * ARCH_BREAK_PCT[a] / 100; })
                     .map(function(a){ return ARCHETYPES[a].name; });
  return { line: moraleLine('player'), res: res, broke: broke.join('、') || '（無）' };
};`);

console.log('=== 門檻對照（「佔自己那半的 %」→ 實際戰意門檻）===');
console.log(R(`(function(){
  const rows = [];
  ['levy','archer','footman','manatarms'].forEach(function(t){
    rows.push('  ' + ENEMY_TYPES[t].name.padEnd(5) + String(BREAK_PCT[t]).padStart(3) + '%  → 戰意 < ' + (50*BREAK_PCT[t]/100).toFixed(1));
  });
  Object.keys(ARCH_BREAK_PCT).forEach(function(a){
    rows.push('  我方' + ARCHETYPES[a].name + ' ' + String(ARCH_BREAK_PCT[a]).padStart(3) + '%  → 戰意 < ' + (50*ARCH_BREAK_PCT[a]/100).toFixed(1));
  });
  return rows.join('\\n');
})()`));

const CASES = [
  ['勢均力敵      ', 100, 100, 0,  '沒人崩'],
  ['被伏擊(敵氣勢+60)', 100, 100, 60, '脆的崩、磐石不崩'],
  ['雙方殘破 20/20 ',  20,  20, 0,  '弱的先崩'],
  ['你打順了 80/20 ',  80,  20, 0,  '沒人崩'],
  ['你快輸了 20/80 ',  20,  80, 0,  '幾乎全崩'],
];
console.log('\n=== 四種局面 × absExp（四格都要對）===');
for (const k of [0.0, 0.7, 1.0, 1.5]) {
  console.log('  absExp ' + k.toFixed(1));
  for (const c of CASES) {
    const r = R(`__evalCase(${k}, ${c[1]}, ${c[2]}, ${c[3]})`);
    console.log('      ' + c[0] + ' 線' + r.line.toFixed(0).padStart(3) +
      ' 戰意' + r.res.toFixed(1).padStart(6) + '  崩：' + r.broke.padEnd(10) + ' （期望：' + c[4] + '）');
  }
}

console.log('\n=== absExp=1.0：氣勢隨時間衰退（伏擊 +60 / 15s）===');
R('CONFIG.morale.absExp = 1.0; simTime = 0; resetFactionMorale(); grantMomentum("enemy", 60, 15);');
for (let t = 0; t <= 16; t += 4) {
  console.log(R(`(function(){
    simTime = ${t};
    const res = resolveOf('player');
    const broke = Object.keys(ARCH_BREAK_PCT).filter(function(a){ return res < 50*ARCH_BREAK_PCT[a]/100; }).map(function(a){ return ARCHETYPES[a].name; });
    return '  ' + String(${t}).padStart(2) + 's  敵方氣勢 +' + momentumOf('enemy').toFixed(0).padStart(2) +
      '  戰局線 ' + moraleLine('player').toFixed(0).padStart(2) + '  我方戰意 ' + res.toFixed(1).padStart(5) +
      '  崩潰：' + (broke.length ? broke.join('、') : '（無，已回穩）');
  })()`));
}

console.log('\n=== 絕對士氣不受氣勢影響 / 斬將奪回氣勢 ===');
console.log(R(`(function(){
  simTime = 0; resetFactionMorale(); grantMomentum('enemy', 60, 15);
  const a0 = moraleOf('player'), before = resolveOf('player');
  simTime = 3; grantMomentum('player', CONFIG.morale.momentumElite);
  const after = resolveOf('player');
  simTime = 20;
  return '  絕對士氣 ' + a0 + ' → 氣勢退盡後 ' + moraleOf('player') + '（沒有永久受創）\\n' +
         '  被伏擊戰意 ' + before.toFixed(1) + ' → 斬將後 ' + after.toFixed(1) + '（推回 +' + (after-before).toFixed(1) + '）';
})()`));
