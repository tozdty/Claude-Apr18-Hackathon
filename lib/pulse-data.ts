// Real data from forecast_12h.json
export const DATA = {
  user: {
    name: "Maya Chen",
    age: 34,
    role: "National Correspondent · CBS News",
    location: "The Maven Hotel, Denver",
    date: "Fri · Apr 18",
  },

  bio: {
    hrv: 19, hrvStatus: "critical" as const,
    hr: 78, hrStatus: "elevated" as const,
    spo2: 94, altitude: true,
    dehydration: -1.4, dehydrationStatus: "critical" as const,
  },

  sleep: {
    totalH: 4.2,
    deepMin: 38,
    remMin: 22,
    debtH: -9.3,
    flight: "Red-eye LAX → DEN, landed 5:38am",
  },

  nutrition: {
    kcal18h: 1040,
    status: "under-fueled",
    dipAt: "10:30am",
  },

  // Curve in minutes-from-midnight for rendering
  curve: [
    { t:  6*60, v: 35, label: "Post–red-eye fog",                       status: "critical" as const },
    { t:  8*60, v: 48, label: "Nap helped",                             status: "low" as const },
    { t: 10*60, v: 44, label: "Fading — needs food",                    status: "low" as const },
    { t: 12*60, v: 38, label: "Circadian trough + calorie deficit",     status: "critical" as const },
    { t: 14*60, v: 55, label: "Pre-broadcast adrenaline (not real)",    status: "medium" as const },
    { t: 16*60, v: 28, label: "Post-broadcast crash — day's lowest",    status: "critical" as const },
    { t: 18*60, v: 33, label: "Partial rebound",                        status: "critical" as const },
  ],
  crashLine: 35,

  flags: [
    { id:1, t: 6*60,       label:"Sleep debt",                    sev:"high" as const,   detail:"9.3h rolling deficit. Cannot recover today — manage around it." },
    { id:2, t: 6*60,       label:"Dehydration + altitude",        sev:"high" as const,   detail:"Denver at 5,280 ft. SpO₂ 94%. 60%+ headache risk without intervention." },
    { id:3, t: 10*60+30,   label:"Blood sugar dip",               sev:"medium" as const, detail:"Only 1,040 kcal in 18h. Cognitive fog layering on sleep debt." },
    { id:4, t: 14*60+30,   label:"Pre-broadcast cortisol spike",  sev:"medium" as const, detail:"Adrenaline masking fatigue. Energy reads 55 but HRV says tank is empty." },
    { id:5, t: 15*60+30,   label:"Adrenaline crash",              sev:"high" as const,   detail:"Post-broadcast drop to 28. Danger zone. Caffeine here would wreck the red-eye." },
    { id:6, t: 18*60,      label:"False second-wind trap",        sev:"medium" as const, detail:"Energy reads 33 but caffeine still metabolically active. More coffee = 2h sleep on red-eye." },
  ],

  plan: [
    { id:1, label:"75-min nap at hotel check-in",                    detail:"One full sleep cycle. +12 energy points projected.",  priority:1 },
    { id:2, label:"40 oz water by noon + electrolytes at 11 & 2",    detail:"60% headache risk reduction.",                        priority:2 },
    { id:3, label:"Timed fuel: 400 kcal by 11, 200 kcal @ 2:15, no caffeine after 2pm", detail:"Holds energy above crash line through broadcast.", priority:3 },
  ],

  // Pulse activity log — with WHY each channel
  log: [
    {
      id:1, t: 6*60+12, channel:"Watch haptic", channelKey:"watch" as const, tone:"amber" as const,
      message:"Slept 4h 12m. Crash risk at 2:30pm. Prehydrating now.",
      why:"She was asleep. A silent haptic is the least invasive way to reach her while she dozes.",
      action:"Electrolyte packets added to grocery order · delivery to The Maven by 9am.",
      meta:"Grocery · $6.40 · reversible",
    },
    {
      id:2, t: 9*60, channel:"Email briefing", channelKey:"mail" as const, tone:"teal" as const,
      message:"Pulse brief: Today's game plan — on-air at 3, red-eye tonight.",
      why:"At her desk with coffee, 40 min of focus time. Email fits the longer-format plan.",
      action:"Full-day brief sent to inbox. No automated action — planning beat.",
      meta:"Email · 1 send",
    },
    {
      id:3, t: 14*60+40, channel:"Phone call via car audio", channelKey:"call" as const, tone:"coral" as const, critical:true,
      message:"HRV's still low, you're running on adrenaline not fuel. Want me to tell Jess to set out bananas and almonds in greenroom B?",
      why:"Driving on I-25. Hands busy, eyes on road, 20 min to live TV. Only voice reaches her.",
      action:"SMS to Jess fired · calendar blocked 3:30–3:50pm for protein + hydration.",
      meta:"Assistant dispatch · auto-confirmed",
    },
    {
      id:4, t: 17*60+15, channel:"Chat DM", channelKey:"chat" as const, tone:"teal" as const,
      message:"Filed. Nice work. Ordered salmon bowl from Modmarket — 14 minutes, meeting you at The Maven.",
      why:"Back at her desk, show wrapped, not urgent. Chat respects her attention.",
      action:"Delivery confirmed · receipt sent to inbox.",
      meta:"Food delivery · $18.40 · cancel 3 min",
    },
    {
      id:5, t: 22*60+45, channel:"Watch haptic", channelKey:"watch" as const, tone:"amber" as const,
      message:"Skip the second coffee. Sleep mode on when you land. Tomorrow's forecast is set.",
      why:"At the gate, boarding. A single tap confirms without pulling her phone.",
      action:"Watch sleep mode armed · alarm 7:30am EST on landing.",
      meta:"Device state · reversible",
    },
  ],

  // 10 senses — generic monograms
  senses: [
    { mono:"HX", name:"Health tracker",  signal:"HRV 19 ms · critical",          tone:"coral" as const },
    { mono:"SL", name:"Sleep",           signal:"4h 12m · debt −9.3h",           tone:"coral" as const },
    { mono:"CL", name:"Calendar",        signal:"Live hit · 3:00 PM",            tone:"amber" as const },
    { mono:"ML", name:"Mail",            signal:"Red-eye DEN→JFK 23:15",         tone:"ink" as const   },
    { mono:"GR", name:"Grocery",         signal:"Electrolytes · ETA 9:00",       tone:"teal" as const  },
    { mono:"FD", name:"Food delivery",   signal:"Last order · yesterday 1:14p",  tone:"ink" as const   },
    { mono:"MS", name:"Chat",            signal:"Post-show DM queued",           tone:"ink" as const   },
    { mono:"CR", name:"Car audio",       signal:"Paired · I-25 · 61 mph",        tone:"teal" as const  },
    { mono:"GL", name:"Location",        signal:"Denver · 5,280 ft",             tone:"amber" as const },
    { mono:"WR", name:"Wrist device",    signal:"BPM 78 · SpO₂ 94%",             tone:"coral" as const },
  ],

  calendar: [
    { t:  8*60+30, ev:"Editorial call" },
    { t: 10*60,    ev:"Script writing" },
    { t: 12*60,    ev:"Hair & makeup" },
    { t: 15*60,    ev:"Live broadcast · Colorado State Capitol", stakes:true },
    { t: 19*60,    ev:"Dinner" },
    { t: 23*60+15, ev:"Red-eye home" },
  ],

  learning: {
    day: 12, totalDays: 30,
    confidence: 84,
    signals: 847,
    interventions: 23,
    trend: "+12% accuracy · 7d",
  },
};

export const DAY_START = 6*60;
export const DAY_END   = 18*60;   // visible forecast window (6a–6p, per curve)
export const NOW_MIN   = 15*60 + 47;

export function fmt(min: number): string {
  const h24 = Math.floor(min/60), m = Math.floor(min%60);
  const am = h24 < 12;
  const h = ((h24+11)%12)+1;
  return `${h}:${String(m).padStart(2,'0')} ${am?'AM':'PM'}`;
}

export function fmtShort(min: number): string {
  const h24 = Math.floor(min/60), m = Math.floor(min%60);
  const am = h24 < 12;
  const h = ((h24+11)%12)+1;
  return `${h}:${String(m).padStart(2,'0')}${am?'a':'p'}`;
}

// Linear sample
export function sampleCurve(t: number): number {
  const c = DATA.curve;
  if (t <= c[0].t) return c[0].v;
  if (t >= c[c.length-1].t) return c[c.length-1].v;
  for (let i=0;i<c.length-1;i++){
    const a=c[i], b=c[i+1];
    if (t>=a.t && t<=b.t){
      const f=(t-a.t)/(b.t-a.t);
      return a.v + (b.v-a.v)*f;
    }
  }
  return 40;
}

export function clamp(v: number, a: number, b: number): number { 
  return Math.max(a, Math.min(b, v)); 
}
