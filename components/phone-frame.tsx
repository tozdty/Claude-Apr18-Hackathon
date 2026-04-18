"use client";

import { ReactNode } from 'react';

// Light-mode palette
export const LIGHT = {
  pageBg:    '#F4F1EC',       // warm off-white page
  surface:   '#FFFFFF',       // cards
  surface2:  '#F7F5F0',       // inset / subtle zones
  ink:       '#0D1117',       // primary text
  ink70:     'rgba(13,17,23,0.70)',
  ink55:     'rgba(13,17,23,0.55)',
  ink40:     'rgba(13,17,23,0.40)',
  ink25:     'rgba(13,17,23,0.22)',
  hair:      'rgba(13,17,23,0.08)',
  hair2:     'rgba(13,17,23,0.12)',
  // semantic
  coral:     '#E14D3F',
  coralBg:   'rgba(225,77,63,0.08)',
  coralBd:   'rgba(225,77,63,0.30)',
  amber:     '#C68412',
  amberBg:   'rgba(198,132,18,0.10)',
  amberBd:   'rgba(198,132,18,0.28)',
  teal:      '#0A8F7F',
  tealBg:    'rgba(10,143,127,0.10)',
  tealBd:    'rgba(10,143,127,0.28)',
};

export function withAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

interface StatusBarProps {
  time?: string;
}

function StatusBar({ time = "3:47" }: StatusBarProps) {
  const c = LIGHT.ink;
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:54, zIndex:20,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'18px 30px 0',
      color:c, fontWeight:600, fontSize:15,
    }}>
      <span>{time}</span>
      <div style={{display:'flex', gap:6, alignItems:'center'}}>
        <svg width="17" height="11" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={withAlpha(c,0.4)} fill="none"/>
          <rect x="2" y="2" width="13" height="9" rx="1.5" fill={LIGHT.amber}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={withAlpha(c,0.4)}/>
        </svg>
      </div>
    </div>
  );
}

interface PhoneFrameProps {
  children: ReactNode;
  label?: string;
  time?: string;
}

export function PhoneFrame({ children, label, time }: PhoneFrameProps) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      {label && (
        <div style={{
          fontSize:11,
          fontWeight:600,
          letterSpacing:'0.08em',
          textTransform:'uppercase',
          color: LIGHT.ink55,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
          {label}
        </div>
      )}
      <div style={{
        width: 390, height: 844, borderRadius: 54,
        background: '#1B1B1F',
        position:'relative', overflow:'hidden',
        boxShadow:'0 40px 100px rgba(60,40,20,0.22), 0 0 0 10px #1B1B1F, 0 0 0 11px #3a3a40, 0 0 0 12px rgba(0,0,0,0.15)',
        fontFamily:'-apple-system, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
      }}>
        {/* dynamic island */}
        <div style={{
          position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
          width:124, height:36, borderRadius:22, background:'#000', zIndex:50,
        }}/>
        <StatusBar time={time}/>
        <div style={{position:'absolute', bottom:8, left:0, right:0, zIndex:60, display:'flex', justifyContent:'center', pointerEvents:'none'}}>
          <div style={{width:134, height:5, borderRadius:100, background:'rgba(13,17,23,0.35)'}}/>
        </div>
        <div style={{height:'100%', width:'100%', overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  );
}
