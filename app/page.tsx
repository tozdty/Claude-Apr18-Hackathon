'use client';

import { useState } from 'react';

type ActionScreen = 
  | 'incoming-call'
  | 'order-food'
  | 'text-assistant'
  | 'calendar-block'
  | 'watch-sleep'
  | 'slack-dm';

const ACTION_SCREENS: { id: ActionScreen; label: string }[] = [
  { id: 'incoming-call', label: 'Incoming Call' },
  { id: 'order-food', label: 'Order Food' },
  { id: 'text-assistant', label: 'Text Assistant' },
  { id: 'calendar-block', label: 'Calendar Block' },
  { id: 'watch-sleep', label: 'Watch Sleep' },
  { id: 'slack-dm', label: 'Slack DM' },
];

export default function NutriBytesActions() {
  const [activeScreen, setActiveScreen] = useState<ActionScreen>('incoming-call');

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 gap-8"
      style={{ background: '#F4F1EC' }}
    >
      {/* Title */}
      <div className="text-center mb-2">
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1C1C1E', marginBottom: 8 }}>
          NutriBytes Actions
        </h1>
        <p style={{ fontSize: 16, color: '#8E8E93' }}>
          The Hands — NutriBytes doesn&apos;t just advise, it executes
        </p>
      </div>

      {/* Action Selector */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {ACTION_SCREENS.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setActiveScreen(screen.id)}
            className="px-4 py-2 rounded-full transition-all"
            style={{
              background: activeScreen === screen.id ? '#1C1C1E' : '#FFFFFF',
              color: activeScreen === screen.id ? '#FFFFFF' : '#1C1C1E',
              border: '1px solid #E5E5EA',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {screen.label}
          </button>
        ))}
      </div>

      {/* Phone Frame */}
      <div 
        className="relative"
        style={{
          width: 393,
          height: 852,
          background: '#1C1C1E',
          borderRadius: 55,
          padding: 11,
          boxShadow: '0 50px 100px rgba(0,0,0,0.25), 0 30px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Screen */}
        <div 
          className="relative overflow-hidden flex flex-col"
          style={{
            width: '100%',
            height: '100%',
            background: '#FFFFFF',
            borderRadius: 44,
          }}
        >
          {activeScreen === 'incoming-call' && <IncomingCallScreen />}
          {activeScreen === 'order-food' && <OrderFoodScreen />}
          {activeScreen === 'text-assistant' && <TextAssistantScreen />}
          {activeScreen === 'calendar-block' && <CalendarBlockScreen />}
          {activeScreen === 'watch-sleep' && <WatchSleepScreen />}
          {activeScreen === 'slack-dm' && <SlackDMScreen />}
        </div>
      </div>
    </div>
  );
}

// Status Bar Component
function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? '#FFFFFF' : '#1C1C1E';
  return (
    <div 
      className="flex items-center justify-between px-8 pt-4 pb-2"
      style={{ minHeight: 54 }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color }}>9:41</span>
      <div 
        style={{
          width: 126,
          height: 34,
          background: '#000000',
          borderRadius: 20,
        }}
      />
      <div className="flex items-center gap-1">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path d="M1 4C1 2.89543 1.89543 2 3 2H4C5.10457 2 6 2.89543 6 4V8C6 9.10457 5.10457 10 4 10H3C1.89543 10 1 9.10457 1 8V4Z" fill={color}/>
          <path d="M7 3C7 1.89543 7.89543 1 9 1H10C11.1046 1 12 1.89543 12 3V9C12 10.1046 11.1046 11 10 11H9C7.89543 11 7 10.1046 7 9V3Z" fill={color}/>
          <path d="M13 1C13 0.447715 13.4477 0 14 0H15C15.5523 0 16 0.447715 16 1V11C16 11.5523 15.5523 12 15 12H14C13.4477 12 13 11.5523 13 11V1Z" fill={color}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.5 2.5C10.7 2.5 12.7 3.3 14.2 4.6L15.6 3.2C13.8 1.6 11.3 0.5 8.5 0.5C5.7 0.5 3.2 1.6 1.4 3.2L2.8 4.6C4.3 3.3 6.3 2.5 8.5 2.5ZM5.1 6.4L6.5 7.8C7.1 7.3 7.8 7 8.5 7C9.2 7 9.9 7.3 10.5 7.8L11.9 6.4C10.9 5.5 9.7 5 8.5 5C7.3 5 6.1 5.5 5.1 6.4ZM8.5 9C7.9 9 7.5 9.4 7.5 10C7.5 10.6 7.9 11 8.5 11C9.1 11 9.5 10.6 9.5 10C9.5 9.4 9.1 9 8.5 9Z" fill={color}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={color} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={color}/>
          <path d="M25 4V9C26.1046 9 27 8.10457 27 7V6C27 4.89543 26.1046 4 25 4Z" fill={color} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// Home Indicator
function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex justify-center pb-2">
      <div 
        style={{
          width: 140,
          height: 5,
          borderRadius: 3,
          background: dark ? '#FFFFFF' : '#1C1C1E',
          opacity: 0.3,
        }}
      />
    </div>
  );
}

// NutriBytes Avatar
function NutriBytesAvatar({ size = 120 }: { size?: number }) {
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)',
        boxShadow: '0 10px 40px rgba(10, 143, 127, 0.4)',
      }}
    >
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
      </svg>
    </div>
  );
}

// 1. Incoming Call Screen
function IncomingCallScreen() {
  return (
    <div 
      className="flex-1 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)',
      }}
    >
      <StatusBar dark />
      
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <NutriBytesAvatar />
        <h2 style={{ fontSize: 28, fontWeight: 400, color: '#FFFFFF', marginTop: 24, marginBottom: 8 }}>
          NutriBytes
        </h2>
        <p style={{ fontSize: 18, color: '#8E8E93' }}>incoming call</p>
      </div>

      <div className="px-8 pb-20">
        <div className="flex items-center justify-center gap-20">
          <div className="flex flex-col items-center gap-3">
            <button 
              className="flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: '#FF3B30',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M23 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(135 12 12)"/>
              </svg>
            </button>
            <span style={{ fontSize: 14, color: '#FFFFFF' }}>Decline</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              className="flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: '#30D158',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M23 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span style={{ fontSize: 14, color: '#FFFFFF' }}>Accept</span>
          </div>
        </div>
      </div>

      <HomeIndicator dark />
    </div>
  );
}

// 2. Order Food Screen (Uber Eats style confirmation)
function OrderFoodScreen() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E5EA]">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: '#06C167',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="#FFFFFF" strokeWidth="2"/>
              <path d="M3 10H21" stroke="#FFFFFF" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>UBER EATS</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E' }}>Order Confirmation</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 flex flex-col gap-6 overflow-y-auto">
        {/* NutriBytes Banner */}
        <div 
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)' }}
        >
          <NutriBytesAvatar size={48} />
          <div className="flex-1">
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>NutriBytes ordered for you</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>Based on your 3pm energy dip</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="flex flex-col gap-4">
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1C1C1E' }}>sweetgreen</h3>
          
          <div className="flex items-start gap-4 pb-4 border-b border-[#E5E5EA]">
            <div 
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: '#F2F2F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}
            >
              🥗
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 17, fontWeight: 500, color: '#1C1C1E' }}>Harvest Bowl</p>
              <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 2 }}>Chicken, wild rice, roasted sweet potato, kale</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1E', marginTop: 4 }}>$14.95</p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-[#E5E5EA]">
            <div 
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: '#F2F2F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}
            >
              🥤
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 17, fontWeight: 500, color: '#1C1C1E' }}>Coconut Water</p>
              <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 2 }}>Hydration boost — you&apos;re 15% below target</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1E', marginTop: 4 }}>$4.50</p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div 
          className="p-4 rounded-2xl"
          style={{ background: '#F2F2F7' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 14, color: '#8E8E93' }}>Arriving at</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1E' }}>NBC Studios</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 14, color: '#8E8E93' }}>ETA</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#30D158' }}>2:45 PM (20 min)</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 pt-4 border-t border-[#E5E5EA]">
        <div className="flex gap-3">
          <button 
            className="flex-1 py-4 rounded-2xl"
            style={{ background: '#F2F2F7', fontSize: 17, fontWeight: 600, color: '#FF3B30' }}
          >
            Cancel Order
          </button>
          <button 
            className="flex-1 py-4 rounded-2xl"
            style={{ background: '#1C1C1E', fontSize: 17, fontWeight: 600, color: '#FFFFFF' }}
          >
            Track Order
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 3. Text Assistant Screen (iMessage style)
function TextAssistantScreen() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: '#E5E5EA' }}
      >
        <button className="text-[#007AFF] flex items-center gap-1">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10L10 18" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 17 }}>Messages</span>
        </button>
        <div className="flex flex-col items-center">
          <div 
            className="flex items-center justify-center mb-1"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: '#FF9500',
            }}
          >
            <span style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 600 }}>SP</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1C1C1E' }}>Sarah (Producer)</span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto" style={{ background: '#FFFFFF' }}>
        {/* NutriBytes indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div 
            className="flex items-center justify-center"
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, color: '#8E8E93' }}>Sent by NutriBytes on your behalf</span>
        </div>

        {/* Outgoing message (blue) */}
        <div className="flex justify-end">
          <div 
            className="px-4 py-3 rounded-2xl max-w-[280px]"
            style={{ 
              background: '#007AFF', 
              borderBottomRightRadius: 4,
            }}
          >
            <p style={{ fontSize: 16, color: '#FFFFFF', lineHeight: 1.4 }}>
              Hey Sarah - quick heads up: I need 10 min before the 4pm segment to grab something to eat. Energy&apos;s crashing. Can we push the pre-call to 3:55?
            </p>
          </div>
        </div>
        <p className="text-right pr-2" style={{ fontSize: 11, color: '#8E8E93' }}>Delivered 2:32 PM</p>

        {/* Incoming message (gray) */}
        <div className="flex justify-start">
          <div 
            className="px-4 py-3 rounded-2xl max-w-[280px]"
            style={{ 
              background: '#E5E5EA', 
              borderBottomLeftRadius: 4,
            }}
          >
            <p style={{ fontSize: 16, color: '#1C1C1E', lineHeight: 1.4 }}>
              No problem at all! I&apos;ll push the pre-call. Want me to have craft services send something to your dressing room?
            </p>
          </div>
        </div>
        <p className="text-left pl-2" style={{ fontSize: 11, color: '#8E8E93' }}>2:33 PM</p>

        {/* Another outgoing */}
        <div className="flex justify-end">
          <div 
            className="px-4 py-3 rounded-2xl max-w-[280px]"
            style={{ 
              background: '#007AFF', 
              borderBottomRightRadius: 4,
            }}
          >
            <p style={{ fontSize: 16, color: '#FFFFFF', lineHeight: 1.4 }}>
              Already ordered - sweetgreen arriving at 2:45. You&apos;re the best
            </p>
          </div>
        </div>
        <p className="text-right pr-2" style={{ fontSize: 11, color: '#8E8E93' }}>Read 2:34 PM</p>
      </div>

      {/* Confirmation Banner */}
      <div 
        className="mx-4 mb-4 p-4 rounded-2xl flex items-center gap-3"
        style={{ background: 'rgba(10, 143, 127, 0.1)' }}
      >
        <NutriBytesAvatar size={40} />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0A8F7F' }}>Message sent successfully</p>
          <p style={{ fontSize: 12, color: '#8E8E93' }}>Sarah confirmed the schedule change</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#30D158"/>
          <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 4. Calendar Block Screen
function CalendarBlockScreen() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E5EA]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#FF3B30',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#FFFFFF" strokeWidth="2"/>
                <path d="M16 2V6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 2V6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 10H21" stroke="#FFFFFF" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>GOOGLE CALENDAR</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E' }}>Schedule Updated</p>
            </div>
          </div>
          <span style={{ fontSize: 14, color: '#8E8E93' }}>Just now</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 flex flex-col gap-5 overflow-y-auto">
        {/* NutriBytes Banner */}
        <div 
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)' }}
        >
          <NutriBytesAvatar size={48} />
          <div className="flex-1">
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>NutriBytes adjusted your schedule</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>Protected recovery window</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-4">
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5 }}>Today&apos;s Changes</h3>
          
          {/* Blocked event */}
          <div 
            className="p-4 rounded-2xl border-l-4"
            style={{ background: '#FFF5F5', borderColor: '#FF3B30' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E' }}>Team Sync</p>
                <p style={{ fontSize: 14, color: '#8E8E93' }}>Originally 5:00 - 5:30 PM</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full"
                style={{ background: '#FF3B30', fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}
              >
                MOVED
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#30D158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#30D158' }}>Rescheduled to Tomorrow 10:00 AM</p>
            </div>
          </div>

          {/* New blocked time */}
          <div 
            className="p-4 rounded-2xl border-l-4"
            style={{ background: '#F0FDF4', borderColor: '#30D158' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E' }}>Recovery Time</p>
                <p style={{ fontSize: 14, color: '#8E8E93' }}>5:00 - 6:00 PM</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full"
                style={{ background: '#30D158', fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}
              >
                NEW
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>
              HRV dropped 18% since morning. Blocking focus time to prevent evening crash.
            </p>
          </div>

          {/* Reason Card */}
          <div 
            className="p-4 rounded-2xl"
            style={{ background: '#F2F2F7' }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Why this action</p>
            <p style={{ fontSize: 15, color: '#1C1C1E', lineHeight: 1.5 }}>
              Your HRV trend shows you&apos;re entering a low-energy window. Without recovery time, there&apos;s a 73% chance of a significant energy crash during your 7pm dinner meeting.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 pt-4 border-t border-[#E5E5EA]">
        <div className="flex gap-3">
          <button 
            className="flex-1 py-4 rounded-2xl"
            style={{ background: '#F2F2F7', fontSize: 17, fontWeight: 600, color: '#FF3B30' }}
          >
            Undo Changes
          </button>
          <button 
            className="flex-1 py-4 rounded-2xl"
            style={{ background: '#1C1C1E', fontSize: 17, fontWeight: 600, color: '#FFFFFF' }}
          >
            Looks Good
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

// 5. Watch Sleep Mode Screen
function WatchSleepScreen() {
  return (
    <div 
      className="flex-1 flex flex-col"
      style={{ background: '#000000' }}
    >
      <StatusBar dark />
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Watch Visualization */}
        <div 
          className="relative flex items-center justify-center mb-8"
          style={{ width: 200, height: 200 }}
        >
          {/* Watch body */}
          <div 
            className="absolute"
            style={{
              width: 160,
              height: 190,
              background: '#2C2C2E',
              borderRadius: 40,
              border: '4px solid #3A3A3C',
            }}
          />
          {/* Watch screen */}
          <div 
            className="relative flex flex-col items-center justify-center"
            style={{
              width: 140,
              height: 160,
              background: '#000000',
              borderRadius: 32,
              zIndex: 1,
            }}
          >
            {/* Moon icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#9D8AE6" stroke="#9D8AE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>Sleep Mode</p>
            <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>Until 6:30 AM</p>
          </div>
          {/* Watch band top */}
          <div 
            className="absolute"
            style={{
              width: 60,
              height: 80,
              background: '#1C1C1E',
              borderRadius: 8,
              top: -70,
            }}
          />
          {/* Watch band bottom */}
          <div 
            className="absolute"
            style={{
              width: 60,
              height: 80,
              background: '#1C1C1E',
              borderRadius: 8,
              bottom: -70,
            }}
          />
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>
            Apple Watch Updated
          </h2>
          <p style={{ fontSize: 16, color: '#8E8E93', lineHeight: 1.5 }}>
            Sleep mode activated based on your sleep debt and tomorrow&apos;s schedule
          </p>
        </div>

        {/* Settings Applied */}
        <div 
          className="w-full rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: '#1C1C1E' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 18, background: '#9D8AE6' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="white"/>
                </svg>
              </div>
              <span style={{ fontSize: 16, color: '#FFFFFF' }}>Sleep Focus</span>
            </div>
            <span style={{ fontSize: 14, color: '#30D158', fontWeight: 600 }}>ON</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 18, background: '#FF9F0A' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 16, color: '#FFFFFF' }}>Wake Alarm</span>
            </div>
            <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 600 }}>6:30 AM</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 18, background: '#30D158' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="5" fill="white"/>
                </svg>
              </div>
              <span style={{ fontSize: 16, color: '#FFFFFF' }}>Smart Wake</span>
            </div>
            <span style={{ fontSize: 14, color: '#30D158', fontWeight: 600 }}>ON</span>
          </div>
        </div>

        {/* NutriBytes reason */}
        <div 
          className="w-full mt-4 p-4 rounded-2xl flex items-center gap-3"
          style={{ background: 'rgba(10, 143, 127, 0.2)' }}
        >
          <NutriBytesAvatar size={36} />
          <p style={{ fontSize: 14, color: '#FFFFFF', flex: 1, lineHeight: 1.4 }}>
            You have 1.5hr sleep debt. Early alarm will help reset your cycle before the 8am call.
          </p>
        </div>
      </div>

      <HomeIndicator dark />
    </div>
  );
}

// 6. Slack DM Screen
function SlackDMScreen() {
  return (
    <div className="flex-1 flex flex-col" style={{ background: '#1A1D21' }}>
      <StatusBar dark />
      
      {/* Slack Header */}
      <div 
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: '#2C2F33' }}
      >
        <button className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#E01E5A',
            }}
          >
            <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 700 }}>JM</span>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>Jake Martinez</p>
            <p style={{ fontSize: 12, color: '#8E8E93' }}>Active</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4 overflow-y-auto">
        {/* NutriBytes indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div 
            className="flex items-center justify-center"
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, color: '#8E8E93' }}>Sent by NutriBytes to help you decompress</span>
        </div>

        {/* Outgoing message */}
        <div className="flex items-start gap-3">
          <div 
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0A8F7F 0%, #06B6A4 100%)',
            }}
          >
            <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 700 }}>Y</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>You</span>
              <span style={{ fontSize: 12, color: '#8E8E93' }}>5:32 PM</span>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ background: '#2C2F33' }}
            >
              <p style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.5 }}>
                Hey Jake! That live segment was intense. Thanks for handling the tech hiccup so smoothly — you saved my ass out there. Drinks on me next week?
              </p>
            </div>
          </div>
        </div>

        {/* Incoming message */}
        <div className="flex items-start gap-3">
          <div 
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#E01E5A',
            }}
          >
            <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 700 }}>JM</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Jake Martinez</span>
              <span style={{ fontSize: 12, color: '#8E8E93' }}>5:34 PM</span>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ background: '#2C2F33' }}
            >
              <p style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.5 }}>
                Ha! All part of the job. You killed it despite the chaos. Drinks sound great — I know a spot near the office. You earned a real break after today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Banner */}
      <div 
        className="mx-4 mb-4 p-4 rounded-xl flex items-center gap-3"
        style={{ background: 'rgba(10, 143, 127, 0.2)' }}
      >
        <NutriBytesAvatar size={40} />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0A8F7F' }}>Post-event decompression</p>
          <p style={{ fontSize: 12, color: '#8E8E93' }}>Social connection helps HRV recovery</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#30D158"/>
          <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Input */}
      <div 
        className="mx-4 mb-8 p-3 rounded-xl flex items-center gap-3"
        style={{ background: '#2C2F33' }}
      >
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <input 
          type="text" 
          placeholder="Message Jake Martinez"
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 15, color: '#FFFFFF' }}
        />
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#8E8E93" strokeWidth="2"/>
            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="10" r="1" fill="#8E8E93"/>
            <circle cx="15" cy="10" r="1" fill="#8E8E93"/>
          </svg>
        </button>
      </div>

      <HomeIndicator dark />
    </div>
  );
}
