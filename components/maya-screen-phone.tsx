"use client";

import { useMemo } from 'react';
import { DATA, fmt, DAY_START, DAY_END } from '@/lib/pulse-data';
import { LIGHT, withAlpha } from './phone-frame';
import { 
  IWatch, IMail, IPhone, IChat, ICircleCheck, IMoon
} from './pulse-icons';

const ACCENT = '#0A8F7F';

const CHANNEL_ICON_MAYA: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = { 
  watch: IWatch, 
  mail: IMail, 
  call: IPhone, 
  chat: IChat 
};

// Helper to get the current state based on scrub position
function getMayaState(scrub: number) {
  const interventions = DATA.log.filter(i => i.t <= scrub);
  const futureInterventions = DATA.log.filter(i => i.t > scrub);
  
  // Before first intervention (before 6:12 AM)
  if (interventions.length === 0) {
    return { type: 'sleep' as const };
  }
  
  // Check if we're at an intervention (within a 10 minute window after it)
  const currentIntervention = interventions.find(i => scrub >= i.t && scrub < i.t + 10);
  if (currentIntervention) {
    return { 
      type: 'intervention' as const, 
      intervention: currentIntervention 
    };
  }
  
  // After last intervention (after 10:45 PM + window) 
  const lastIntervention = DATA.log[DATA.log.length - 1];
  if (scrub >= lastIntervention.t + 10 && scrub >= DAY_END) {
    return { type: 'sleep_mode' as const };
  }
  
  // Between interventions - show "All clear" with next check-in time
  const nextIntervention = futureInterventions[0];
  return { 
    type: 'clear' as const, 
    nextTime: nextIntervention?.t 
  };
}

// Sleep screen
function SleepScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0D1117',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: withAlpha(ACCENT, 0.15),
        display: 'grid', placeItems: 'center',
        marginBottom: 24,
      }}>
        <IMoon size={28} style={{ color: ACCENT }}/>
      </div>
      <div style={{
        color: LIGHT.ink40,
        fontSize: 14,
        fontWeight: 500,
        textAlign: 'center',
        letterSpacing: '-0.01em',
        lineHeight: 1.5,
      }}>
        Pulse is watching.
      </div>
      <div style={{
        color: withAlpha('#FFFFFF', 0.4),
        fontSize: 13,
        marginTop: 8,
        letterSpacing: '-0.01em',
      }}>
        Rest.
      </div>
    </div>
  );
}

// All clear screen
function AllClearScreen({ nextTime }: { nextTime?: number }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: LIGHT.pageBg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: withAlpha(ACCENT, 0.12),
        border: `2px solid ${withAlpha(ACCENT, 0.3)}`,
        display: 'grid', placeItems: 'center',
        marginBottom: 28,
      }}>
        <ICircleCheck size={36} style={{ color: ACCENT }}/>
      </div>
      <div style={{
        color: LIGHT.ink,
        fontSize: 22,
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        marginBottom: 12,
      }}>
        All clear.
      </div>
      {nextTime && nextTime <= DAY_END + 6*60 && (
        <div style={{
          color: LIGHT.ink55,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Next check-in at {fmt(nextTime)}
        </div>
      )}
    </div>
  );
}

// Sleep mode active screen (end of day)
function SleepModeScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0D1117',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: withAlpha(ACCENT, 0.15),
        border: `2px solid ${withAlpha(ACCENT, 0.25)}`,
        display: 'grid', placeItems: 'center',
        marginBottom: 28,
      }}>
        <ICircleCheck size={36} style={{ color: ACCENT }}/>
      </div>
      <div style={{
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        All clear.
      </div>
      <div style={{
        color: withAlpha('#FFFFFF', 0.6),
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        Sleep mode active.
      </div>
      <div style={{
        color: withAlpha('#FFFFFF', 0.4),
        fontSize: 13,
        textAlign: 'center',
        marginTop: 4,
      }}>
        See you tomorrow.
      </div>
    </div>
  );
}

// Intervention card screen
function InterventionScreen({ intervention }: { intervention: typeof DATA.log[0] }) {
  const Icon = CHANNEL_ICON_MAYA[intervention.channelKey] || IWatch;
  const isCall = intervention.channelKey === 'call';
  
  if (isCall) {
    return <IncomingCallScreen intervention={intervention}/>;
  }
  
  const color = intervention.tone === 'coral' ? LIGHT.coral : 
                intervention.tone === 'amber' ? LIGHT.amber : ACCENT;
  const bg = intervention.tone === 'coral' ? LIGHT.coralBg : 
             intervention.tone === 'amber' ? LIGHT.amberBg : withAlpha(ACCENT, 0.1);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: LIGHT.pageBg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 320,
        background: LIGHT.surface,
        borderRadius: 24,
        border: `1px solid ${LIGHT.hair}`,
        padding: 28,
        boxShadow: '0 12px 40px rgba(13,17,23,0.12)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: bg,
          border: `1.5px solid ${color}40`,
          display: 'grid', placeItems: 'center',
          marginBottom: 20,
        }}>
          <Icon size={28} style={{ color }}/>
        </div>
        
        {/* Channel label */}
        <div style={{
          color,
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}>
          {intervention.channel}
        </div>
        
        {/* Message */}
        <div style={{
          color: LIGHT.ink,
          fontSize: 18,
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.5,
          letterSpacing: '-0.02em',
          marginBottom: 20,
        }}>
          {intervention.message}
        </div>
        
        {/* Action taken */}
        <div style={{
          width: '100%',
          background: LIGHT.surface2,
          border: `1px solid ${LIGHT.hair}`,
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 24,
        }}>
          <div style={{
            color: LIGHT.ink55,
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}>
            Pulse handled this
          </div>
          <div style={{
            color: ACCENT,
            fontSize: 13,
            lineHeight: 1.45,
          }}>
            {intervention.action}
          </div>
        </div>
        
        {/* Got it button */}
        <button style={{
          width: '100%',
          height: 48,
          background: ACCENT,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
        }}>
          Got it
        </button>
      </div>
    </div>
  );
}

// Incoming call screen (for the phone call intervention)
function IncomingCallScreen({ intervention }: { intervention: typeof DATA.log[0] }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 32px 60px',
    }}>
      {/* Pulse logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 32,
      }}>
        <div style={{position:'relative', width:16, height:16}}>
          <div style={{position:'absolute', inset:0, borderRadius:'50%', border:`1.5px solid ${ACCENT}`, boxShadow:`0 0 10px ${withAlpha(ACCENT,0.45)}`}}/>
          <div style={{position:'absolute', inset:4, borderRadius:'50%', background:ACCENT, boxShadow:`0 0 6px ${withAlpha(ACCENT,0.7)}`}}/>
        </div>
        <span style={{fontSize:14, fontWeight:600, color:ACCENT, letterSpacing:'-0.02em'}}>Pulse</span>
      </div>
      
      {/* Avatar */}
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${withAlpha(ACCENT, 0.7)} 100%)`,
        display: 'grid', placeItems: 'center',
        marginBottom: 24,
        boxShadow: `0 0 40px ${withAlpha(ACCENT, 0.3)}`,
      }}>
        <IPhone size={44} style={{ color: '#FFFFFF' }}/>
      </div>
      
      {/* Calling label */}
      <div style={{
        color: withAlpha('#FFFFFF', 0.6),
        fontSize: 14,
        marginBottom: 8,
      }}>
        Incoming call via car audio
      </div>
      
      {/* Critical badge */}
      {intervention.critical && (
        <div style={{
          background: LIGHT.coralBg,
          border: `1px solid ${LIGHT.coralBd}`,
          borderRadius: 999,
          padding: '4px 12px',
          marginBottom: 32,
        }}>
          <span style={{
            color: LIGHT.coral,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}>CRITICAL</span>
        </div>
      )}
      
      {/* Message preview */}
      <div style={{
        color: '#FFFFFF',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 1.55,
        padding: '0 12px',
        marginBottom: 'auto',
        maxWidth: 280,
      }}>
        &quot;{intervention.message}&quot;
      </div>
      
      {/* Call buttons */}
      <div style={{
        display: 'flex', gap: 48,
        marginTop: 40,
      }}>
        {/* Decline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <button style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#E14D3F',
            border: 'none',
            display: 'grid', placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(225,77,63,0.4)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" transform="rotate(135, 12, 12)"/>
            </svg>
          </button>
          <span style={{ color: withAlpha('#FFFFFF', 0.6), fontSize: 12 }}>Decline</span>
        </div>
        
        {/* Accept */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <button style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#22C55E',
            border: 'none',
            display: 'grid', placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
          }}>
            <IPhone size={28} style={{ color: '#FFFFFF' }}/>
          </button>
          <span style={{ color: withAlpha('#FFFFFF', 0.6), fontSize: 12 }}>Accept</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Maya Screen ───
export function MayaScreen({ scrub }: { scrub: number }) {
  const state = useMemo(() => getMayaState(scrub), [scrub]);

  return (
    <div style={{
      width: '100%', height: '100%',
      overflow: 'hidden',
    }}>
      {state.type === 'sleep' && <SleepScreen />}
      {state.type === 'clear' && <AllClearScreen nextTime={state.nextTime} />}
      {state.type === 'sleep_mode' && <SleepModeScreen />}
      {state.type === 'intervention' && <InterventionScreen intervention={state.intervention!} />}
    </div>
  );
}
