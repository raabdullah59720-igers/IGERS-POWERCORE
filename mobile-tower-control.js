
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const KEY='igersTowerMonitorV1';
  const towers=[
    {id:'BD-DHK-01',name:'Dhaka Central',rssi:-68,sinr:22,backhaul:97,power:96,mode:'monitor'},
    {id:'BD-CML-01',name:'Cumilla Gateway',rssi:-75,sinr:16,backhaul:91,power:88,mode:'monitor'},
    {id:'BD-CTG-01',name:'Chattogram Port',rssi:-63,sinr:25,backhaul:99,power:94,mode:'monitor'},
    {id:'BD-RAJ-01',name:'Rajshahi North',rssi:-81,sinr:11,backhaul:86,power:89,mode:'monitor'},
    {id:'BD-RNG-01',name:'Rangpur North',rssi:-78,sinr:13,backhaul:93,power:92,mode:'monitor'},
    {id:'BD-KHL-01',name:'Khulna West',rssi:-72,sinr:18,backhaul:90,power:87,mode:'maintenance'},
    {id:'BD-SYL-01',name:'Sylhet East',rssi:-70,sinr:20,backhaul:95,power:90,mode:'monitor'},
    {id:'BD-BAR-01',name:'Barishal South',rssi:-84,sinr:9,backhaul:82,power:85,mode:'maintenance'}
  ];
  const state={monitoring:true,towers:JSON.parse(JSON.stringify(towers))};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
  }
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x?.towers?.length){state.monitoring=x.monitoring!==false;state.towers=x.towers;}}catch(_){} }
  function status(t){if(t.mode==='maintenance')return 'down';if(t.rssi>-70&&t.sinr>=18&&t.backhaul>=92&&t.power>=88)return 'good';return 'watch';}
  function label(s){return s==='good'?'HEALTHY':s==='watch'?'WATCH':'SERVICE';}
  function bar(v,min,max){return Math.max(4,Math.min(100,Math.round((v-min)/(max-min)*100)));}
  function render(){
    const list=$('towerList'); if(!list)return;
    const counts={good:0,watch:0,down:0}; let health=0;
    list.innerHTML=state.towers.map(t=>{
      const s=status(t); counts[s]++; const sig=bar(t.sinr,0,30); const b=Math.max(0,Math.min(100,t.backhaul)); const p=Math.max(0,Math.min(100,t.power)); health+=(s==='good'?100:s==='watch'?72:35);
      return `<article class="tower-card ${s}" data-id="${t.id}"><div class="tower-row-top"><div><div class="tower-name">${t.name}</div><div class="tower-id">${t.id} · Bangladesh monitor node</div></div><span class="tower-chip ${s==='good'?'good':s==='watch'?'watch':'down'}">${label(s)}</span></div><div class="tower-services"><div class="tower-service"><small>RSSI</small><b>${t.rssi} dBm</b><div class="tower-signal-bar"><i style="width:${bar(t.rssi,-100,-50)}%"></i></div></div><div class="tower-service"><small>SINR</small><b>${t.sinr} dB</b><div class="tower-signal-bar"><i style="width:${sig}%"></i></div></div><div class="tower-service"><small>BACKHAUL</small><b>${t.backhaul}%</b><div class="tower-signal-bar"><i style="width:${b}%"></i></div></div><div class="tower-service"><small>POWER</small><b>${t.power}%</b><div class="tower-signal-bar"><i style="width:${p}%"></i></div></div></div><div class="tower-actions"><button data-id="${t.id}" data-mode="monitor" type="button">Monitor</button><button data-id="${t.id}" data-mode="maintenance" type="button">Maintenance</button><button data-id="${t.id}" data-mode="reset" type="button">Reset telemetry</button></div></article>`;
    }).join('');
    $('towerNodeCount').textContent=state.towers.length; $('towerHealthyCount').textContent=counts.good; $('towerWatchCount').textContent=counts.watch; $('towerServiceCount').textContent=counts.down;
    const pct=Math.round(health/state.towers.length); $('towerHealthPercent').textContent=pct+'%'; $('towerHealthBar').style.width=pct+'%';
    const chip=$('towerAlertChip'); if(chip){chip.className='tower-chip '+(counts.down?'down':counts.watch?'watch':'good');chip.textContent=counts.down?'SERVICE':counts.watch?'ATTENTION':'CLEAR';}
    document.querySelectorAll('.tower-node').forEach(n=>{const t=state.towers.find(x=>x.id===n.dataset.tower);n.classList.remove('watch','down');if(t)n.classList.add(status(t)==='watch'?'watch':status(t)==='down'?'down':'');});
  }
  function log(msg){const e=$('towerCommandLog');if(e)e.textContent=new Date().toLocaleTimeString('en-GB')+' · '+msg;}
  function scan(){state.towers.forEach(t=>{if(t.mode==='maintenance')return;t.rssi=Math.max(-95,Math.min(-55,t.rssi+Math.round((Math.random()-.5)*6)));t.sinr=Math.max(4,Math.min(28,t.sinr+Math.round((Math.random()-.5)*4)));t.backhaul=Math.max(70,Math.min(100,t.backhaul+Math.round((Math.random()-.5)*5)));t.power=Math.max(65,Math.min(100,t.power+Math.round((Math.random()-.5)*3)));});save();render();log('Network scan complete · monitoring telemetry refreshed.');}
  function reset(){state.towers=JSON.parse(JSON.stringify(towers));state.monitoring=true;save();render();syncToolbar();log('Local tower telemetry reset to baseline.');}
  function syncToolbar(){const b=$('towerMonitorToggle');if(b)b.textContent='Monitoring: '+(state.monitoring?'ON':'OFF');const g=$('towerGlobalBadge');if(g){g.className='tower-chip '+(state.monitoring?'live':'watch');g.innerHTML='<span class="tower-dot"></span> '+(state.monitoring?'LIVE · LOCAL MONITOR':'PAUSED · LOCAL MONITOR');}}
  function command(cmd){const m={coverage:'Coverage check complete · signal-quality view updated.',backhaul:'Backhaul check complete · carrier transmit controls are not exposed in this browser layer.',power:'Power health check complete · battery/grid state is monitor-only.',sync:'Telemetry sync requested · local model refreshed.',maintenance:'Maintenance queue reviewed · service-mode nodes highlighted.',alerts:'Signal alerts reviewed · inspect WATCH/SERVICE nodes in the list.'};if(cmd==='coverage'||cmd==='backhaul'||cmd==='power'||cmd==='sync')scan();log(m[cmd]||'Command accepted.');}
  function bind(){load();syncToolbar();render();$('towerMonitorToggle')?.addEventListener('click',()=>{state.monitoring=!state.monitoring;save();syncToolbar();log('Monitoring '+(state.monitoring?'enabled':'paused')+'.');});$('towerRunScan')?.addEventListener('click',scan);$('towerResetTelemetry')?.addEventListener('click',reset);document.addEventListener('click',e=>{const b=e.target.closest('#towerList button');if(b){const t=state.towers.find(x=>x.id===b.dataset.id);if(!t)return;if(b.dataset.mode==='maintenance'){t.mode='maintenance';log(t.name+' moved to local maintenance mode.');}else if(b.dataset.mode==='monitor'){t.mode='monitor';log(t.name+' returned to monitoring mode.');}else {Object.assign(t,towers.find(x=>x.id===t.id));log(t.name+' telemetry baseline restored.');}save();render();}const c=e.target.closest('.tower-command-grid button');if(c)command(c.dataset.cmd);});setInterval(()=>{if(state.monitoring){scan();}else{$('towerLastSync')&&( $('towerLastSync').textContent='Paused · '+new Date().toLocaleTimeString('en-GB'));}},4500);setInterval(()=>{const e=$('towerLastSync');if(e&&state.monitoring)e.textContent='Sync '+new Date().toLocaleTimeString('en-GB');},1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
