"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { DATA, DAY_START, DAY_END, NOW_MIN, fmt, fmtShort, sampleCurve, clamp } from '@/lib/pulse-data';
import { LIGHT, withAlpha } from './phone-frame';
import { 
  IPulse, IDrop, IMoon, IAlert, IBrain, ICheck, IUndo, IPlay, IPause,
  CHANNEL_ICON
} from './pulse-icons';

const ACCENT = '#0A8F7F';

// ─── Agent loop dots ───
function LoopDots() {
  const steps = ['W','P','D','R','A','L'];
  const [i,setI] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setI(v=>(v+1)%6),900); return ()=>clearInterval(id);},[]);
  return (
    <div style={{display:'flex', gap:3}}>
      {steps.map((s,idx)=>{
        const on = idx===i;
        return (
          <div key={s} style={{
            width:13,height:13,borderRadius:3,
            display:'grid', placeItems:'center',
            fontSize:7.5, fontFamily:'var(--font-mono)', fontWeight:600,
            color: on ? '#FFFFFF' : LIGHT.ink40,
            background: on ? ACCENT : 'transparent',
            border: `1px solid ${on ? ACCENT : LIGHT.hair2}`,
            boxShadow: on ? `0 0 6px ${withAlpha(ACCENT,0.55)}` : 'none',
            transition:'all .18s ease',
          }}>{s}</div>
        );
      })}
    </div>
  );
}

// ─── Section header ───
function SectionHeader({ left, right }: { left: string; right?: string }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'14px 22px 8px'}}>
      <span style={{color:LIGHT.ink40, fontSize:10, letterSpacing:0.14, fontWeight:600, textTransform:'uppercase'}}>{left}</span>
      {right && <span style={{color:LIGHT.ink25, fontSize:9.5, fontFamily:'var(--font-mono)'}}>{right}</span>}
    </div>
  );
}

// ─── Bio bar ───
function BioBar() {
  const items = [
    { k:'HRV',  v:`${DATA.bio.hrv}ms`,  status:DATA.bio.hrvStatus },
    { k:'HR',   v:`${DATA.bio.hr}bpm`,  status:DATA.bio.hrStatus },
    { k:'SpO₂', v:`${DATA.bio.spo2}%`,  status:'low' as const },
    { k:'H₂O',  v:`${DATA.bio.dehydration}%`, status:DATA.bio.dehydrationStatus },
  ];
  const tone = (s: string) => s==='critical'?LIGHT.coral:s==='elevated'||s==='low'?LIGHT.amber:ACCENT;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:1,
      margin:'0 16px', background:LIGHT.hair, borderRadius:12, overflow:'hidden',
      border:`1px solid ${LIGHT.hair}`,
    }}>
      {items.map(it=>(
        <div key={it.k} style={{background:LIGHT.surface, padding:'9px 8px', textAlign:'center'}}>
          <div style={{color:LIGHT.ink40, fontSize:9, letterSpacing:0.14, fontWeight:600, textTransform:'uppercase', marginBottom:2}}>{it.k}</div>
          <div style={{fontFamily:'var(--font-mono)', color:tone(it.status), fontSize:13, fontWeight:600, letterSpacing:'-0.02em'}}>{it.v}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Forecast card + chart ───
function ForecastCard({ scrub, setScrub, playing, setPlaying }: { 
  scrub: number; 
  setScrub: (v: number) => void; 
  playing: boolean; 
  setPlaying: (v: boolean) => void 
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w,setW] = useState(358);
  useEffect(()=>{
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(es => { for (const e of es) setW(Math.max(280, Math.floor(e.contentRect.width))); });
    ro.observe(wrapRef.current);
    return ()=>ro.disconnect();
  },[]);

  const energyNow = Math.round(sampleCurve(scrub));
  const belowCrash = energyNow < DATA.crashLine;
  const toneColor = belowCrash ? LIGHT.coral : energyNow < 45 ? LIGHT.amber : ACCENT;

  return (
    <div style={{
      background:LIGHT.surface, borderRadius:18, border:`1px solid ${LIGHT.hair}`,
      padding:'14px 14px 10px', margin:'0 16px',
      boxShadow:'0 1px 0 rgba(13,17,23,0.02), 0 8px 24px -16px rgba(13,17,23,0.10)',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:8}}>
        <div>
          <div style={{color:LIGHT.ink40, fontSize:10, letterSpacing:0.12, fontWeight:600, textTransform:'uppercase'}}>12-hour forecast</div>
          <div style={{fontFamily:'var(--font-mono)', color:LIGHT.ink25, fontSize:9.5, marginTop:1}}>
            HRV · sleep · fuel · cortisol · location
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
            <span style={{fontFamily:'var(--font-mono)', color:toneColor, fontSize:22, fontWeight:600, lineHeight:1, letterSpacing:'-0.02em'}}>
              {energyNow}
            </span>
            <span style={{color:toneColor, fontSize:8.5, letterSpacing:0.1, textTransform:'uppercase', fontWeight:600, marginTop:2}}>
              {belowCrash ? 'crash zone' : energyNow<45 ? 'low' : 'stable'} · {fmt(scrub)}
            </span>
          </div>
          <button onClick={()=>setPlaying(p=>!p)} style={{
            width:28, height:28, borderRadius:7, border:`1px solid ${LIGHT.hair2}`,
            background:LIGHT.surface2, color:LIGHT.ink, display:'grid', placeItems:'center', cursor:'pointer',
          }}>{playing ? <IPause size={12}/> : <IPlay size={12}/>}</button>
        </div>
      </div>

      <div ref={wrapRef} style={{width:'100%'}}>
        <Chart width={w} height={170} scrub={scrub} setScrub={setScrub}/>
      </div>

      <div style={{display:'flex', gap:5, marginTop:8, overflowX:'auto', scrollbarWidth:'none'}}>
        {[['Wake', 6*60],['Trough', 12*60],['On-air', 15*60],['Crash', 16*60],['Now', NOW_MIN]].map(([label,t])=>{
          const active = Math.abs(scrub - (t as number)) < 2;
          return (
            <button key={label as string} onClick={()=>setScrub(t as number)} style={{
              flex:'0 0 auto', fontSize:10.5, padding:'5px 10px', borderRadius:999, cursor:'pointer',
              background: active ? withAlpha(ACCENT,0.12) : LIGHT.surface2,
              border: `1px solid ${active ? ACCENT : LIGHT.hair}`,
              color: active ? ACCENT : LIGHT.ink70,
              fontFamily:'-apple-system, system-ui',
            }}>{label}</button>
          );
        })}
      </div>
    </div>
  );
}

function Chart({ width, height, scrub, setScrub }: { width: number; height: number; scrub: number; setScrub: (v: number) => void }) {
  const padL = 28, padR = 14, padT = 18, padB = 22;
  const x = (t: number) => padL + ((t - DAY_START)/(DAY_END-DAY_START)) * (width - padL - padR);
  const y = (v: number) => padT + (1 - v/100) * (height - padT - padB);

  const pts = DATA.curve.map(p => ({ x:x(p.t), y:y(p.v), v:p.v, t:p.t, status:p.status }));

  const path = (() => {
    if (pts.length < 2) return '';
    const d = [`M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
    for (let i=0;i<pts.length-1;i++){
      const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
      const ten=0.2;
      const c1x=p1.x+(p2.x-p0.x)*ten, c1y=p1.y+(p2.y-p0.y)*ten;
      const c2x=p2.x-(p3.x-p1.x)*ten, c2y=p2.y-(p3.y-p1.y)*ten;
      d.push(`C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
    }
    return d.join(' ');
  })();
  const y0 = y(0);
  const fillPath = `${path} L${pts[pts.length-1].x.toFixed(1)} ${y0.toFixed(1)} L${pts[0].x.toFixed(1)} ${y0.toFixed(1)} Z`;
  const crashY = y(DATA.crashLine);
  const scrubX = x(scrub);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const handle = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = ('touches' in e && e.touches[0]) ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const px = (cx - rect.left) * (width / rect.width);
    const f = clamp((px - padL)/(width-padL-padR), 0, 1);
    setScrub(Math.round(DAY_START + f*(DAY_END-DAY_START)));
  };
  useEffect(()=>{
    const mv = (e: MouseEvent | TouchEvent)=>{ if (dragging.current) handle(e); };
    const up = ()=>{ dragging.current = false; };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', mv, {passive:true});
    window.addEventListener('touchend', up);
    return ()=>{
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', mv);
      window.removeEventListener('touchend', up);
    };
  });

  const flagColor = (sev: string)=> sev==='high' ? LIGHT.coral : LIGHT.amber;
  const hours = [6,9,12,15,18];

  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{display:'block', touchAction:'none', userSelect:'none', cursor:'ew-resize'}}
      onMouseDown={(e)=>{dragging.current=true; handle(e);}}
      onTouchStart={(e)=>{dragging.current=true; handle(e);}}>
      <defs>
        <linearGradient id="cFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25"/>
          <stop offset="80%" stopColor={ACCENT} stopOpacity="0.04"/>
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="dFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIGHT.coral} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={LIGHT.coral} stopOpacity="0"/>
        </linearGradient>
        <clipPath id="below"><rect x="0" y={crashY} width={width} height={height-crashY}/></clipPath>
        <clipPath id="past"><rect x="0" y="0" width={scrubX} height={height}/></clipPath>
        <clipPath id="future"><rect x={scrubX} y="0" width={width-scrubX} height={height}/></clipPath>
      </defs>

      <g opacity="0.6">
        {[0,25,50,75,100].map(v => (
          <line key={v} x1={padL} x2={width-padR} y1={y(v)} y2={y(v)} stroke={LIGHT.hair} strokeWidth="1"/>
        ))}
      </g>

      {[0,50,100].map(v => (
        <text key={v} x={padL-5} y={y(v)+3} textAnchor="end" fontSize="8" fill={LIGHT.ink40} fontFamily="var(--font-mono)">{v}</text>
      ))}
      {hours.map(h => (
        <text key={h} x={x(h*60)} y={height-7} textAnchor="middle" fontSize="8" fill={LIGHT.ink40} fontFamily="var(--font-mono)">
          {((h+11)%12)+1}{h<12?'a':'p'}
        </text>
      ))}

      <line x1={padL} x2={width-padR} y1={crashY} y2={crashY} stroke={withAlpha(LIGHT.coral,0.55)} strokeWidth="1" strokeDasharray="3 3"/>
      <text x={width-padR-3} y={crashY-3} textAnchor="end" fontSize="7.5" fill={LIGHT.coral} fontFamily="var(--font-mono)">crash · {DATA.crashLine}</text>

      <g clipPath="url(#below)"><path d={fillPath} fill="url(#dFill)"/></g>

      <g clipPath="url(#past)">
        <path d={fillPath} fill="url(#cFill)"/>
        <path d={path} fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinejoin="round"/>
      </g>
      <g clipPath="url(#future)" opacity="0.5">
        <path d={fillPath} fill="url(#cFill)" opacity="0.45"/>
        <path d={path} fill="none" stroke={ACCENT} strokeWidth="1.4" strokeDasharray="2 3"/>
      </g>

      {DATA.curve.map(p => {
        const flag = DATA.flags.find(f => Math.abs(f.t - p.t) < 60);
        const color = flag ? flagColor(flag.sev) : ACCENT;
        const reached = p.t <= scrub;
        return (
          <g key={p.t} opacity={reached?1:0.5}>
            <circle cx={x(p.t)} cy={y(p.v)} r={flag?4.5:3} fill={color} stroke={LIGHT.surface} strokeWidth="1.5"/>
            {flag && flag.sev==='high' && (
              <circle cx={x(p.t)} cy={y(p.v)} r="4.5" fill="none" stroke={color} strokeWidth="1">
                <animate attributeName="r" from="3" to="11" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            )}
          </g>
        );
      })}

      <line x1={scrubX} x2={scrubX} y1={padT-4} y2={height-padB+4} stroke={ACCENT} strokeWidth="1.1"/>
      <line x1={scrubX} x2={scrubX} y1={padT-4} y2={height-padB+4} stroke={ACCENT} strokeWidth="3" opacity="0.14"/>
      <rect x={scrubX-19} y={padT-15} width={38} height={13} rx="3" fill={LIGHT.surface} stroke={ACCENT} strokeOpacity="0.7"/>
      <text x={scrubX} y={padT-6} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill={ACCENT}>{fmt(scrub)}</text>
      <rect x={scrubX-5} y={(padT + height-padB)/2-11} width={10} height={22} rx="2.5" fill={ACCENT} stroke={LIGHT.surface} strokeWidth="1.2"
        style={{filter:`drop-shadow(0 0 6px ${withAlpha(ACCENT,0.65)})`}}/>
    </svg>
  );
}

// ─── Stat tiles ───
function StatTiles({ scrub }: { scrub: number }) {
  const e = Math.round(sampleCurve(scrub));
  let hyd = 48;
  if (scrub >= 11*60) hyd += 12;
  if (scrub >= 14*60) hyd += 8;
  hyd = clamp(hyd + Math.floor((scrub - DAY_START)/60 * 0.6), 38, 78);
  const sleepDebt = DATA.sleep.debtH;

  const cards = [
    { icon: IPulse, label:'Energy',    value:e,                 unit:'',  tone:e<DATA.crashLine?'coral':e<45?'amber':'teal', sub:`HRV ${DATA.bio.hrv}ms` },
    { icon: IDrop,  label:'Hydration', value:hyd,               unit:'%', tone:hyd<55?'amber':'teal',                         sub:'−1.4% bw' },
    { icon: IMoon,  label:'Sleep debt',value:sleepDebt.toFixed(1),unit:'h',tone:'coral',                                      sub:'7d rolling' },
  ];

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'0 16px'}}>
      {cards.map(c => {
        const color = c.tone==='coral'?LIGHT.coral : c.tone==='amber'?LIGHT.amber : ACCENT;
        const Icon = c.icon;
        return (
          <div key={c.label} style={{background:LIGHT.surface, border:`1px solid ${LIGHT.hair}`, borderRadius:12, padding:'10px 11px'}}>
            <div style={{display:'flex', alignItems:'center', gap:6, marginBottom:6}}>
              <div style={{color}}><Icon size={14}/></div>
              <span style={{color:LIGHT.ink40, fontSize:9.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.1}}>{c.label}</span>
            </div>
            <div style={{fontFamily:'var(--font-mono)', color, fontSize:22, fontWeight:600, lineHeight:1, letterSpacing:'-0.02em'}}>
              {c.value}<span style={{fontSize:12, opacity:0.7}}>{c.unit}</span>
            </div>
            <div style={{fontFamily:'var(--font-mono)', color:LIGHT.ink40, fontSize:9.5, marginTop:3}}>{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Log card (intervention) ───
function LogCard({ iv, reached, recent }: { iv: typeof DATA.log[0]; reached: boolean; recent: boolean }) {
  const Icon = CHANNEL_ICON[iv.channelKey] || IPulse;
  const color = iv.tone==='coral' ? LIGHT.coral : iv.tone==='amber' ? LIGHT.amber : ACCENT;
  const bg    = iv.tone==='coral' ? LIGHT.coralBg : iv.tone==='amber' ? LIGHT.amberBg : withAlpha(ACCENT,0.10);
  const opacity = reached ? 1 : 0.38;

  return (
    <div style={{display:'flex', gap:12, opacity, transition:'opacity .3s ease'}}>
      <div style={{position:'relative', width:18, flexShrink:0}}>
        <div style={{position:'absolute', top:14, bottom:-14, left:8, width:1, background:LIGHT.hair2}}/>
        <div style={{
          position:'absolute', top:10, left:4, width:10, height:10, borderRadius:'50%',
          background: reached ? color : LIGHT.surface2,
          border:`1.5px solid ${color}`,
          boxShadow: reached ? `0 0 8px ${withAlpha(color,0.5)}` : 'none',
        }}/>
      </div>

      <div style={{
        flex:1, minWidth:0,
        background:LIGHT.surface, borderRadius:12, border:`1px solid ${LIGHT.hair}`,
        borderLeft: recent ? `2px solid ${color}` : `1px solid ${LIGHT.hair}`,
        padding:'12px 13px',
        boxShadow: recent ? `0 0 0 1px ${withAlpha(color,0.2)}, 0 6px 18px -10px ${withAlpha(color,0.5)}` : 'none',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:8}}>
          <div style={{width:26, height:26, borderRadius:7, background:bg, color, border:`1px solid ${color}40`, display:'grid', placeItems:'center'}}><Icon size={14}/></div>
          <div style={{minWidth:0, flex:1}}>
            <div style={{color, fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.08, lineHeight:1.2}}>{iv.channel}</div>
            <div style={{fontFamily:'var(--font-mono)', color:LIGHT.ink40, fontSize:9.5}}>signal fusion</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2}}>
            {iv.critical && (
              <span style={{fontSize:8.5, padding:'1.5px 5px', borderRadius:3, color:LIGHT.coral, background:LIGHT.coralBg, border:`1px solid ${LIGHT.coralBd}`, letterSpacing:0.08, fontWeight:600}}>CRITICAL</span>
            )}
            <span style={{fontFamily:'var(--font-mono)', color:LIGHT.ink55, fontSize:10}}>{fmt(iv.t)}</span>
          </div>
        </div>

        <div style={{position:'relative', paddingLeft:10, marginBottom:8}}>
          <div style={{position:'absolute', left:0, top:2, bottom:2, width:2, borderRadius:1, background: color, opacity:0.55}}/>
          <div style={{color:LIGHT.ink, fontSize:12.5, lineHeight:1.45, fontStyle:'italic'}}>
            &quot;{iv.message}&quot;
          </div>
        </div>

        <div style={{background:LIGHT.surface2, border:`1px solid ${LIGHT.hair}`, borderRadius:7, padding:'7px 9px', marginBottom:8, display:'flex', gap:7}}>
          <span style={{fontSize:8.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.1, color, flexShrink:0, paddingTop:1}}>WHY THIS</span>
          <span style={{color:LIGHT.ink70, fontSize:10.5, lineHeight:1.45}}>{iv.why}</span>
        </div>

        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background: reached ? withAlpha(ACCENT,0.08) : LIGHT.surface2,
          border: reached ? `1px solid ${withAlpha(ACCENT,0.25)}` : `1px solid ${LIGHT.hair}`,
          borderRadius:7, padding:'7px 9px',
        }}>
          <div style={{width:16, height:16, borderRadius:4, background:ACCENT, color:'#fff', display:'grid', placeItems:'center', flexShrink:0}}>
            <ICheck size={11}/>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{color: ACCENT, fontSize:11, fontWeight:500, lineHeight:1.3}}>{iv.action}</div>
            <div style={{fontFamily:'var(--font-mono)', color:LIGHT.ink40, fontSize:9.5}}>{iv.meta}</div>
          </div>
          <button style={{color:LIGHT.ink55, fontSize:9.5, padding:'3px 7px', borderRadius:4, border:`1px solid ${LIGHT.hair}`, display:'flex', alignItems:'center', gap:4, background:LIGHT.surface, cursor:'pointer'}}>
            <IUndo size={10}/> Undo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Senses row ───
function SensesRow() {
  const tone = (t: string)=> t==='coral'?LIGHT.coral : t==='amber'?LIGHT.amber : t==='teal'?ACCENT : LIGHT.ink70;
  return (
    <div>
      <SectionHeader left="CONNECTED SENSES" right={`${DATA.senses.length} streams · live`} />
      <div style={{display:'flex', gap:8, overflowX:'auto', padding:'0 16px 6px', scrollbarWidth:'none'}}>
        {DATA.senses.map((s) => (
          <div key={s.mono} style={{
            flex:'0 0 auto', minWidth:148,
            background:LIGHT.surface, borderRadius:12, border:`1px solid ${LIGHT.hair}`,
            padding:'10px 12px', display:'flex', flexDirection:'column', gap:6,
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div style={{
                width:22, height:22, borderRadius:5,
                background:LIGHT.surface2, border:`1px solid ${LIGHT.hair}`,
                display:'grid', placeItems:'center',
                fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
                color:LIGHT.ink70, letterSpacing:0.04,
              }}>{s.mono}</div>
              <span style={{color:LIGHT.ink, fontSize:11.5, fontWeight:500}}>{s.name}</span>
              <span style={{
                marginLeft:'auto', width:5, height:5, borderRadius:'50%',
                background: ACCENT, boxShadow:`0 0 5px ${withAlpha(ACCENT,0.8)}`,
                animation:'blink 1.8s ease-in-out infinite',
              }}/>
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:10.5, color:tone(s.tone), letterSpacing:'-0.01em'}}>
              {s.signal}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Learning strip ───
function LearningStrip() {
  const { day, totalDays, confidence, signals, interventions } = DATA.learning;
  return (
    <div style={{margin:'0 16px', padding:'10px 13px', background:LIGHT.surface, border:`1px solid ${LIGHT.hair}`, borderRadius:12, display:'flex', flexDirection:'column', gap:8}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <IBrain size={13} style={{color:ACCENT}}/>
        <span style={{color:LIGHT.ink40, fontSize:10, letterSpacing:0.14, fontWeight:600, textTransform:'uppercase'}}>Pulse is learning</span>
        <span style={{marginLeft:'auto', fontFamily:'var(--font-mono)', color: ACCENT, fontSize:10}}>day {day} / {totalDays}</span>
      </div>
      <div style={{display:'flex', gap:2}}>
        {Array.from({length: totalDays}).map((_,i)=>{
          const on = i < day; const now = i === day-1;
          return (
            <div key={i} style={{flex:1, height: now?8:5, borderRadius:1.5,
              background: on ? ACCENT : LIGHT.hair2,
              opacity: on ? (now?1:0.5+i/day*0.4) : 1,
              boxShadow: now ? `0 0 6px ${withAlpha(ACCENT,0.7)}` : 'none',
            }}/>
          );
        })}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:9.5, color:LIGHT.ink55}}>
        <span>confidence <span style={{color:LIGHT.ink}}>{confidence}%</span></span>
        <span>signals <span style={{color:LIGHT.ink}}>{signals}</span></span>
        <span>acts <span style={{color:LIGHT.ink}}>{interventions}</span></span>
        <span style={{color: ACCENT}}>↑ +12% / 7d</span>
      </div>
    </div>
  );
}

// ─── Main Agent Brain Screen ───
export function AgentBrainScreen({ scrub, setScrub, playing, setPlaying }: { 
  scrub: number; 
  setScrub: (v: number) => void; 
  playing: boolean; 
  setPlaying: (v: boolean) => void 
}) {
  const mostRecentId = useMemo(()=>{
    const reached = DATA.log.filter(i => i.t <= scrub);
    return reached.length ? reached[reached.length-1].id : null;
  }, [scrub]);

  return (
    <div style={{
      width:'100%', height:'100%', overflowY:'auto',
      background:LIGHT.pageBg, color:LIGHT.ink,
      paddingTop:54, paddingBottom:34, scrollbarWidth:'none',
    }}>
      {/* header */}
      <div style={{padding:'10px 20px 6px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{position:'relative', width:18, height:18}}>
            <div style={{position:'absolute', inset:0, borderRadius:'50%', border:`1.5px solid ${ACCENT}`, boxShadow:`0 0 10px ${withAlpha(ACCENT,0.45)}`}}/>
            <div style={{position:'absolute', inset:5, borderRadius:'50%', background:ACCENT, boxShadow:`0 0 6px ${withAlpha(ACCENT,0.7)}`}}/>
          </div>
          <span style={{fontSize:16, fontWeight:700, color:ACCENT, letterSpacing:'-0.02em'}}>Pulse</span>
        </div>
        <LoopDots/>
      </div>

      {/* title */}
      <div style={{padding:'4px 20px 14px'}}>
        <div style={{color:LIGHT.ink, fontSize:26, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.1}}>
          Good afternoon, Maya
        </div>
        <div style={{marginTop:6, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:6, padding:'3px 8px 3px 7px', borderRadius:999, background:LIGHT.coralBg, border:`1px solid ${LIGHT.coralBd}`}}>
            <span style={{width:6, height:6, borderRadius:'50%', background:LIGHT.coral, boxShadow:`0 0 6px ${LIGHT.coral}`, animation:'blink 1.8s ease-in-out infinite'}}/>
            <span style={{color:LIGHT.coral, fontSize:10.5, fontWeight:600, letterSpacing:0.04}}>Crash at 4:00 PM</span>
          </span>
          <span style={{color:LIGHT.ink55, fontSize:11, fontFamily:'var(--font-mono)'}}>
            {DATA.user.location}
          </span>
        </div>
      </div>

      <BioBar/>

      <SectionHeader left="Today&apos;s body forecast" right="updated 14s ago"/>
      <ForecastCard scrub={scrub} setScrub={setScrub} playing={playing} setPlaying={setPlaying}/>

      <div style={{marginTop:10}}>
        <StatTiles scrub={scrub}/>
      </div>

      <SectionHeader left={`Pulse activity · ${DATA.log.length}`} right="channel chosen by Pulse"/>
      <div style={{padding:'0 16px', display:'flex', flexDirection:'column', gap:10}}>
        {DATA.log.map(iv => (
          <LogCard key={iv.id} iv={iv} reached={iv.t <= scrub} recent={iv.id===mostRecentId}/>
        ))}
      </div>

      <SensesRow/>

      <SectionHeader left="Pulse is learning" right="model v0.14"/>
      <LearningStrip/>

      <div style={{padding:'18px 20px 8px', textAlign:'center'}}>
        <div style={{fontFamily:'var(--font-mono)', color:LIGHT.ink25, fontSize:9.5, letterSpacing:0.04}}>
          Watch · Predict · Decide · Reach · Act · Learn
        </div>
      </div>
      
      <style>{`
        @keyframes blink { 0%,100% { opacity: .45 } 50% { opacity: 1 } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
