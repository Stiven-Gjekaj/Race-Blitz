// Tiny inline SVG sparkline helpers

export function sparkline(values, {width=120,height=30,color='#5cc8ff'}={}){
  if(!values || values.length===0) return '';
  const min = Math.min(...values), max = Math.max(...values);
  const scaleX = (i)=> (i/(values.length-1))*width;
  const scaleY = (v)=> height - ((v-min)/(max-min||1))*height;
  const d = values.map((v,i)=>`${i===0?'M':'L'}${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`).join(' ');
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="none" stroke="${color}" stroke-width="2"/></svg>`;
}

export function powerCurveSvg(peakKw=150){
  const pts=[]; for(let rpm=1000; rpm<=8000; rpm+=500){ const x=rpm/8000; const y=Math.sin(Math.PI*x)*peakKw; pts.push(y); }
  return sparkline(pts);
}

export function dragVsSpeedSvg(CdA=0.65){
  const pts=[]; for(let v=10; v<=70; v+=3){ pts.push(CdA*v*v*v); } return sparkline(pts,{color:'#7dd3a7'});
}

export function stintDegradationSvg(){
  const pts=[]; let v=1; for(let i=0;i<10;i++){ v*=1.08; pts.push(v); } return sparkline(pts,{color:'#ffcc66'});
}

export function paceDeltasSvg(){
  const pts=[]; let b=100; for(let i=0;i<12;i++){ b += (Math.random()*2-1)*2; pts.push(b); } return sparkline(pts,{color:'#ff6b6b'});
}

