
(function(){
  'use strict';
  const $ = (id) => document.getElementById(id);
  const zones = [
    ['Dhaka, Bangladesh','Asia/Dhaka'],['London, United Kingdom','Europe/London'],
    ['New York, USA','America/New_York'],['Los Angeles, USA','America/Los_Angeles'],
    ['Toronto, Canada','America/Toronto'],['Dubai, UAE','Asia/Dubai'],
    ['Riyadh, Saudi Arabia','Asia/Riyadh'],['Delhi, India','Asia/Kolkata'],
    ['Singapore','Asia/Singapore'],['Tokyo, Japan','Asia/Tokyo'],['Seoul, South Korea','Asia/Seoul'],
    ['Sydney, Australia','Australia/Sydney'],['Paris, France','Europe/Paris'],['Berlin, Germany','Europe/Berlin'],
    ['Moscow, Russia','Europe/Moscow'],['Cape Town, South Africa','Africa/Johannesburg'],
    ['Nairobi, Kenya','Africa/Nairobi'],['São Paulo, Brazil','America/Sao_Paulo'],
    ['Mexico City, Mexico','America/Mexico_City'],['UTC','UTC']
  ];
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const fmt = (zone, options) => new Intl.DateTimeFormat('en-GB', Object.assign({timeZone:zone}, options)).format(new Date());
  const timeFmt = (zone) => fmt(zone,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const dateFmt = (zone) => fmt(zone,{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  const zoneName = (zone) => {
    try {
      return new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'long'})
        .formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value || zone;
    } catch (_) { return zone; }
  };
  const setText = (id, value) => { const el=$(id); if(el) el.textContent=value; };

  const select = $('zoneSelect');
  if (select) {
    zones.forEach(([name, zone]) => {
      const option=document.createElement('option');
      option.value=zone; option.textContent=name+' · '+zone; select.appendChild(option);
    });
    try {
      const saved=localStorage.getItem('igersWorldZone');
      if(saved && zones.some(item => item[1]===saved)) select.value=saved;
    } catch (_) {}
  }

  function tick(){
    try {
      setText('bdTime', timeFmt('Asia/Dhaka'));
      setText('bdDate', dateFmt('Asia/Dhaka'));
      setText('localTime', timeFmt(localZone));
      setText('localDate', dateFmt(localZone));
      setText('localTz', 'Timezone: '+localZone+' · '+zoneName(localZone));
      const selected = (select && select.value) || 'UTC';
      setText('worldTime', timeFmt(selected));
      setText('worldDate', dateFmt(selected)+' · '+zoneName(selected));
      setText('liveTick', new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
      setText('liveState','LIVE');
    } catch (error) {
      const panel=$('timeStatus');
      if(panel) panel.innerHTML='<div class="live-left"><span class="live-dot"></span><div><b style="color:var(--danger)">LIVE UPDATE ERROR</b><span>Clock engine failed to render.</span></div></div>';
    }
  }
  if(select){
    select.addEventListener('change', () => {
      try { localStorage.setItem('igersWorldZone', select.value); } catch (_) {}
      tick();
    });
  }
  tick();
  setInterval(tick,1000);

  function weatherText(code){
    const map={0:['Clear sky','☀️'],1:['Mainly clear','🌤️'],2:['Partly cloudy','⛅'],3:['Overcast','☁️'],45:['Fog','🌫️'],48:['Rime fog','🌫️'],51:['Light drizzle','🌦️'],53:['Drizzle','🌦️'],55:['Heavy drizzle','🌧️'],61:['Light rain','🌦️'],63:['Rain','🌧️'],65:['Heavy rain','🌧️'],71:['Light snow','🌨️'],73:['Snow','🌨️'],75:['Heavy snow','❄️'],80:['Rain showers','🌦️'],81:['Showers','🌧️'],82:['Heavy showers','⛈️'],95:['Thunderstorm','⛈️'],96:['Thunderstorm + hail','⛈️'],99:['Thunderstorm + hail','⛈️']};
    return map[code] || ['Weather update','🌤️'];
  }
  async function loadWeather(){
    try {
      const url='https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FDhaka';
      const response=await fetch(url,{cache:'no-store'});
      if(!response.ok) throw new Error('Weather request failed');
      const data=await response.json();
      const current=data.current || {};
      const desc=weatherText(current.weather_code);
      setText('temp', Math.round(Number(current.temperature_2m))+'°C');
      setText('weatherText', desc[0]);
      setText('weatherIcon', desc[1]);
      setText('wind', Math.round(Number(current.wind_speed_10m))+' km/h');
      setText('humidity', Math.round(Number(current.relative_humidity_2m))+'%');
      setText('weatherUpdated', current.time ? new Date(current.time).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : 'Live');
      setText('weatherStatus','Live Dhaka weather loaded. The weather panel can fail independently without breaking the rest of the site.');
    } catch (_) {
      setText('weatherText','Weather unavailable');
      setText('weatherIcon','☁️');
      setText('weatherStatus','Weather is temporarily unavailable. Time and all other website sections remain functional.');
    }
  }

  function setWidth(id, pct){ const el=$(id); if(el) el.style.width=Math.max(0,Math.min(100,pct))+'%'; }
  function degToCompass(deg){ if(!Number.isFinite(deg)) return '--'; const dirs=['N','NE','E','SE','S','SW','W','NW']; return dirs[Math.round(deg/45)%8]; }
  async function loadEnvironment(){
    try{
      const url='https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=Asia%2FDhaka';
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('environment feed failed');
      const d=await r.json(), c=d.current||{};
      const h=Number(c.relative_humidity_2m), w=Number(c.wind_speed_10m), t=Number(c.temperature_2m), wd=Number(c.wind_direction_10m);
      setText('envHumidity',Number.isFinite(h)?Math.round(h)+'%':'--'); setWidth('humidityBar',Number.isFinite(h)?h:0);
      setText('envWind',Number.isFinite(w)?Math.round(w):'--'); setWidth('windBar',Number.isFinite(w)?Math.min(w,100):0);
      setText('windDir','Direction: '+(Number.isFinite(wd)?Math.round(wd)+'° · '+degToCompass(wd):'--'));
      setText('envTemp',Number.isFinite(t)?t.toFixed(1):'--'); setText('envTempText','Open-Meteo current atmospheric feed');
      setText('envState','LIVE'); setText('envUpdated',c.time?'Updated '+c.time.replace('T',' '):'Updated live');
      setText('radarSync','SYNC '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
      setText('envStatus','Environmental feed online. Humidity and airflow are live external readings for the Dhaka display point.');
    }catch(_){ setText('envState','OFFLINE'); setText('envUpdated','Live environmental feed unavailable'); setText('envStatus','Environmental feed unavailable. The rest of the interface remains operational.'); }
  }
  const bangladeshLat=23.8103, bangladeshLon=90.4125;
  function haversineKm(lat1,lon1,lat2,lon2){ const R=6371, toRad=x=>x*Math.PI/180, dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1); const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2; return 2*R*Math.asin(Math.sqrt(a)); }
  // Broad Asia polygon for a presentation/monitoring view. Events are classified by coordinates, not by name text.
  const asiaPolygon=[
    [26,39],[28,45],[31,50],[34,55],[36,60],[41,68],[48,74],[55,77],[64,88],[78,96],[81,108],[77,125],[72,141],[66,160],[56,169],[45,171],[34,169],[20,170],[8,160],[1,145],[-1,130],[4,114],[8,101],[10,88],[13,76],[17,65],[20,55],[23,45],[26,39]
  ];
  function pointInPolygon(lat,lon,poly=asiaPolygon){ let inside=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const yi=poly[i][0], xi=poly[i][1], yj=poly[j][0], xj=poly[j][1]; const intersects=((yi>lat)!==(yj>lat)) && (lon < (xj-xi)*(lat-yi)/(yj-yi)+xi); if(intersects) inside=!inside; } return inside; }
  function formatAgo(ms){ const min=Math.max(0,Math.round(ms/60000)); return min<1?'just now':min+' min ago'; }
  async function loadEarthquakes(){
    const alert=$('quakeAlert');
    try{
      const url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('earthquake feed failed');
      const data=await r.json(); const features=(data.features||[]).sort((a,b)=>(b.properties?.time||0)-(a.properties?.time||0));
      const relevant=features.filter(f=>{ const g=f.geometry?.coordinates||[]; const lat=Number(g[1]), lon=Number(g[0]), mag=Number(f.properties?.mag); return Number.isFinite(lat)&&Number.isFinite(lon)&&Number.isFinite(mag)&&pointInPolygon(lat,lon); }).slice(0,6);
      if(!relevant.length){ alert?.classList.add('clear'); alert?.classList.remove('attention'); setText('quakeMain','No recent qualifying earthquake event in the monitored view.'); setText('quakeMeta','USGS past-hour feed checked successfully · '+features.length+' global events scanned'); }
      else{
        const top=relevant[0], p=top.properties||{}, g=top.geometry?.coordinates||[]; const mag=Number(p.mag), dist=haversineKm(bangladeshLat,bangladeshLon,Number(g[1]),Number(g[0]));
        alert?.classList.remove('clear'); alert?.classList.add(mag>=5?'attention':'clear');
        setText('quakeMain','M'+(Number.isFinite(mag)?mag.toFixed(1):'?')+' · '+(p.place||'Unknown location'));
        setText('quakeMeta','Approx. '+Math.round(dist)+' km from Dhaka · '+formatAgo(Date.now()-Number(p.time||Date.now()))+' · USGS Asia-region feed view');
        setText('quakeTime',p.time?new Date(p.time).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):'--');
        const list=relevant.map(f=>{const pr=f.properties||{}, gg=f.geometry?.coordinates||[]; const m=Number(pr.mag); const di=haversineKm(bangladeshLat,bangladeshLon,Number(gg[1]),Number(gg[0])); return '<div class="eq-item"><span class="eq-mag">M'+(Number.isFinite(m)?m.toFixed(1):'?')+'</span><span class="eq-place">'+(pr.place||'Unknown')+' · '+Math.round(di)+' km</span></div>';}).join('');
        const ql=$('quakeList'); if(ql) ql.innerHTML=list;
      }
    }catch(_){ setText('quakeMain','Earthquake feed temporarily unavailable.'); setText('quakeMeta','USGS connection could not be reached from this browser.'); const ql=$('quakeList'); if(ql) ql.innerHTML=''; }
  }
  loadEnvironment(); setInterval(loadEnvironment,60000);
  loadEarthquakes(); setInterval(loadEarthquakes,60000);

  loadWeather();
})();
