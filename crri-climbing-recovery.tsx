import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0D0F14", surface: "#141720", card: "#1C2030", border: "#252A3A",
  lime: "#C5F135", limeD: "#9DC22A", white: "#E8EAF0", muted: "#6B7280",
  green: "#22C55E", yellow: "#EAB308", orange: "#F97316", red: "#EF4444",
};

const s = {
  app: { minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Space Grotesk', system-ui, sans-serif", paddingBottom: 80 },
  header: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 50 },
  logo: { fontFamily: "'Space Mono', monospace", fontSize: 13, color: C.lime, letterSpacing: "0.12em", fontWeight: 700 },
  tabBar: { display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 53, zIndex: 40 },
  tab: (active) => ({ flex: 1, padding: "12px 0", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", background: "transparent", color: active ? C.lime : C.muted, borderBottom: `2px solid ${active ? C.lime : "transparent"}`, transition: "all 0.2s" }),
  container: { maxWidth: 560, margin: "0 auto", padding: "0 16px" },
  progressBar: { display: "flex", gap: 6, padding: "20px 0 8px" },
  progressDot: (active, done) => ({ flex: 1, height: 3, borderRadius: 2, background: done ? C.lime : active ? C.limeD : C.border, transition: "background 0.3s" }),
  sectionLabel: { fontSize: 10, letterSpacing: "0.18em", color: C.lime, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, marginTop: 28 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 4 },
  sectionNote: { fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.5 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10 },
  label: { fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 10, display: "block" },
  hint: { fontSize: 11, color: C.muted, marginTop: -6, marginBottom: 10 },
  sliderRow: { display: "flex", alignItems: "center", gap: 12 },
  sliderVal: { fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: C.lime, minWidth: 28, textAlign: "right" },
  slider: { flex: 1, accentColor: C.lime, cursor: "pointer", background: "transparent" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: (sel) => ({ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${sel ? C.lime : C.border}`, background: sel ? `${C.lime}18` : "transparent", color: sel ? C.lime : C.muted, transition: "all 0.15s" }),
  toggleRow: { display: "flex", gap: 8 },
  toggle: (sel, col) => ({ flex: 1, padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${sel ? col : C.border}`, background: sel ? `${col}22` : "transparent", color: sel ? col : C.muted, textAlign: "center", transition: "all 0.15s" }),
  btnPrimary: { width: "100%", padding: "16px", borderRadius: 10, background: C.lime, color: "#0D0F14", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", marginTop: 20, letterSpacing: "0.02em" },
  btnSecondary: { width: "100%", padding: "14px", borderRadius: 10, background: "transparent", color: C.muted, fontSize: 14, fontWeight: 600, border: `1px solid ${C.border}`, cursor: "pointer", marginTop: 8 },
};

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setVal(Math.round(p * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function Slider({ label, hint, min = 0, max = 10, value, onChange, leftLabel, rightLabel }) {
  return (
    <div style={s.card}>
      <span style={s.label}>{label}</span>
      {hint && <p style={s.hint}>{hint}</p>}
      <div style={s.sliderRow}>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} style={s.slider} />
        <span style={s.sliderVal}>{value}</span>
      </div>
      {(leftLabel || rightLabel) && <div style={s.sliderLabels}><span>{leftLabel}</span><span>{rightLabel}</span></div>}
    </div>
  );
}

function Chips({ label, hint, options, value, onChange }) {
  return (
    <div style={s.card}>
      <span style={s.label}>{label}</span>
      {hint && <p style={s.hint}>{hint}</p>}
      <div style={s.chipRow}>{options.map(o => <button key={o} style={s.chip(value === o)} onClick={() => onChange(o)}>{o}</button>)}</div>
    </div>
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <div style={{ ...s.card, marginBottom: 8 }}>
      <span style={{ ...s.label, marginBottom: 12 }}>{label}</span>
      <div style={s.toggleRow}>
        <button style={s.toggle(value === true, C.green)} onClick={() => onChange(true)}>✓ Yes</button>
        <button style={s.toggle(value === false, C.red)} onClick={() => onChange(false)}>✗ No</button>
      </div>
    </div>
  );
}

function statusColor(score) { return score >= 80 ? C.green : score >= 60 ? C.yellow : score >= 40 ? C.orange : C.red; }
function statusLabel(score) { return score >= 80 ? "READY" : score >= 60 ? "CAUTION" : score >= 40 ? "FATIGUED" : "HIGH RISK"; }
function sessionRec(score, fingerR) {
  if (score >= 80) return fingerR >= 70 ? "Limit bouldering · Moonboard · Fingerboard" : "Power & strength — avoid max finger loading";
  if (score >= 60) return "Volume climbing · Technique — no limit bouldering";
  if (score >= 40) return "Aerobic climbing · Mobility · Conditioning";
  return "Active recovery only — REST today";
}

// ── Mini sparkline graph ─────────────────────────────────────────────────────
function Sparkline({ data, width = 320, height = 80 }) {
  if (!data || data.length < 2) return null;
  const pad = 8;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const minV = 0, maxV = 100;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((d.score - minV) / (maxV - minV)) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${path} L${pts[pts.length-1][0]},${pad+h} L${pts[0][0]},${pad+h} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.lime} stopOpacity="0.25" />
          <stop offset="100%" stopColor={C.lime} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Zone lines */}
      {[80, 60, 40].map(v => {
        const y = pad + h - ((v - minV) / (maxV - minV)) * h;
        return <line key={v} x1={pad} y1={y} x2={pad+w} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />;
      })}
      <path d={areaPath} fill="url(#sg)" />
      <path d={path} fill="none" stroke={C.lime} strokeWidth="2" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={statusColor(data[i].score)} stroke={C.bg} strokeWidth="2" />
      ))}
    </svg>
  );
}

// ── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({ history, onClear }) {
  if (history.length === 0) return (
    <div style={s.container}>
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 8 }}>No sessions logged yet</div>
        <div style={{ fontSize: 13, color: C.muted }}>Complete your first session check-in and your score history will appear here.</div>
      </div>
    </div>
  );

  const last7 = history.slice(-7);
  const avg = Math.round(history.reduce((a, b) => a + b.score, 0) / history.length);
  const best = Math.max(...history.map(h => h.score));
  const trend = history.length >= 3
    ? history.slice(-3).reduce((a, b) => a + b.score, 0) / 3 > history.slice(-6, -3).reduce((a, b) => a + b.score, 0) / 3
      ? "↑ Improving" : "↓ Declining"
    : "—";

  return (
    <div style={s.container}>
      <div style={{ paddingTop: 24 }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[["Sessions", history.length], ["Avg Score", avg], ["Best", best]].map(([l, v]) => (
            <div key={l} style={{ ...s.card, textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: C.lime }}>{v}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: "0.1em" }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>3-SESSION TREND</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: trend.includes("↑") ? C.green : trend.includes("↓") ? C.red : C.muted }}>{trend}</span>
        </div>

        {/* Graph */}
        <div style={s.card}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 4 }}>LAST {last7.length} SESSIONS</div>
          <div style={{ fontSize: 10, color: C.border, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.green }}>— 80 Ready</span>
            <span style={{ color: C.yellow }}>— 60 Caution</span>
            <span style={{ color: C.red }}>— 40 Fatigued</span>
          </div>
          <Sparkline data={last7} height={100} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {last7.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 9, color: C.muted }}>
                {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
              </div>
            ))}
          </div>
        </div>

        {/* Session list */}
        <div style={{ marginTop: 20, fontSize: 10, letterSpacing: "0.14em", color: C.muted, fontWeight: 700, marginBottom: 12 }}>SESSION LOG</div>
        {[...history].reverse().map((h, i) => (
          <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700,
              color: statusColor(h.score), minWidth: 44, textAlign: "center"
            }}>{h.score}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{h.sessionType} · {h.duration}min</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{new Date(h.date).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: statusColor(h.score), padding: "4px 10px", borderRadius: 12, border: `1px solid ${statusColor(h.score)}44`, background: `${statusColor(h.score)}11` }}>
              {statusLabel(h.score)}
            </div>
          </div>
        ))}

        <button style={{ ...s.btnSecondary, marginTop: 16 }} onClick={onClear}>Clear history</button>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ── Score Page ────────────────────────────────────────────────────────────────
function ScorePage({ result, onReset, onViewHistory }) {
  const animated = useCountUp(result.score);
  const col = statusColor(result.score);
  const fingerScore = result.fingerScore;
  const risk = fingerScore >= 7
    ? { level: "HIGH RISK", color: C.red, note: "Finger overload — no crimping" }
    : fingerScore >= 5 ? { level: "MODERATE", color: C.orange, note: "Monitor closely" }
    : result.score < 40 ? { level: "MODERATE", color: C.orange, note: "General fatigue" }
    : result.score < 60 ? { level: "LOW–MOD", color: C.yellow, note: "" }
    : { level: "LOW", color: C.green, note: "" };

  return (
    <div style={s.container}>
      <div style={{ textAlign: "center", padding: "40px 0 8px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: C.muted, marginBottom: 8 }}>READINESS SCORE</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 96, fontWeight: 700, color: col, lineHeight: 1, letterSpacing: "-0.02em" }}>{animated}</div>
        <div style={{ display: "inline-block", marginTop: 12, padding: "6px 18px", borderRadius: 20, background: `${col}22`, border: `1.5px solid ${col}`, color: col, fontSize: 13, fontWeight: 800, letterSpacing: "0.14em" }}>{statusLabel(result.score)}</div>
      </div>

      <div style={{ background: `${col}11`, border: `1px solid ${col}44`, borderRadius: 12, padding: "18px 20px", marginTop: 24, marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: col, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>TODAY'S SESSION</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.white, lineHeight: 1.4 }}>{sessionRec(result.score, result.fingerReadiness)}</div>
      </div>

      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", color: C.muted, fontWeight: 700, marginBottom: 12 }}>SYSTEM BREAKDOWN</div>
        {result.systems.map(sys => (
          <div key={sys.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.card, border: `1px solid ${sys.isLimiting ? statusColor(sys.pct) + "88" : C.border}`, borderRadius: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18, minWidth: 28 }}>{sys.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 4 }}>
                {sys.name}
                {sys.isLimiting && <span style={{ marginLeft: 8, fontSize: 9, letterSpacing: "0.1em", color: statusColor(sys.pct), fontWeight: 700 }}>LIMITING</span>}
              </div>
              <div style={{ height: 5, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                <div style={{ width: `${sys.pct}%`, height: "100%", background: statusColor(sys.pct), borderRadius: 3, transition: "width 1s ease" }} />
              </div>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: statusColor(sys.pct), minWidth: 38, textAlign: "right" }}>{Math.round(sys.pct)}%</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.14em", marginBottom: 8 }}>RECOVERY BALANCE</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: result.balance >= 0 ? C.green : C.orange }}>{result.balance >= 0 ? "+" : ""}{Math.round(result.balance)}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>pts</div>
        </div>
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.14em", marginBottom: 8 }}>INJURY RISK</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: risk.color }}>{risk.level}</div>
          {risk.note && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{risk.note}</div>}
        </div>
      </div>

      <div style={{ ...s.card, textAlign: "center", marginTop: 10 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.14em", marginBottom: 6 }}>HOURS UNTIL FULL READINESS</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700, color: C.lime }}>
          {result.score >= 80 ? "✓ Now" : result.score >= 60 ? "24 hrs" : result.score >= 40 ? "48 hrs" : "72+ hrs"}
        </div>
      </div>

      <button style={s.btnPrimary} onClick={onViewHistory}>View Score History →</button>
      <button style={s.btnSecondary} onClick={onReset}>Log Another Session</button>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
const STEPS = ["Session", "Recovery", "Fingers", "Body & CNS", "Result"];

export default function App() {
  const [activeTab, setActiveTab] = useState("log");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crri_history") || "[]"); } catch { return []; }
  });

  // Step 0
  const [sessionType, setSessionType] = useState(null);
  const [duration, setDuration] = useState(90);
  const [intensity, setIntensity] = useState(5);
  const [limitAttempts, setLimitAttempts] = useState(0);
  const [fingerType, setFingerType] = useState(null);
  const [age, setAge] = useState(25);
  // Step 1
  const [sleepBefore, setSleepBefore] = useState(7);
  const [postMeal, setPostMeal] = useState(null);
  const [protein, setProtein] = useState(null);
  const [water, setWater] = useState(2);
  const [nap, setNap] = useState(null);
  const [walk, setWalk] = useState(null);
  const [coldShower, setColdShower] = useState(null);
  const [stretch, setStretch] = useState(null);
  // Step 2
  const [fingerStiff, setFingerStiff] = useState(0);
  const [fingerFist, setFingerFist] = useState(0);
  const [fingerCrimp, setFingerCrimp] = useState(0);
  const [fingerHang, setFingerHang] = useState(0);
  // Step 3
  const [forearmSore, setForearmSore] = useState(0);
  const [forearmTight, setForearmTight] = useState(0);
  const [forearmPump, setForearmPump] = useState(0);
  const [skin, setSkin] = useState(0);
  const [motivation, setMotivation] = useState(3);
  const [explosive, setExplosive] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [stress, setStress] = useState(3);

  function calcResult() {
    const typeMap = { Bouldering: 10, Routes: 8, Strength: 10, Conditioning: 5, Competition: 15, Mixed: 9 };
    const typeBase = typeMap[sessionType] || 10;
    const durMult = duration < 60 ? 0.7 : duration < 90 ? 1 : duration < 120 ? 1.3 : duration < 150 ? 1.6 : duration < 180 ? 1.9 : 2.3;
    const intMod = 1 + ((intensity - 5) * 0.08);
    const limitMod = limitAttempts <= 5 ? 1 : limitAttempts <= 10 ? 1.15 : limitAttempts <= 20 ? 1.3 : 1.5;
    const fingerMod = { Jugs: 0.9, Mixed: 1.0, "Small crimps": 1.1, "Max crimps": 1.2 }[fingerType] || 1.0;
    const ageAdj = age >= 45 ? 1.6 : age >= 30 ? 1.5 : 1.0;
    const trainingLoad = typeBase * durMult * intMod * limitMod * fingerMod * ageAdj;
    const credits = (sleepBefore * 3) + (postMeal ? 2 : 0) + (protein ? 3 : 0) + Math.min(water, 4) + (nap ? 5 : 0) + (walk ? 2 : 0) + (coldShower ? 2 : 0) + (stretch ? 1 : 0);
    const balance = credits - trainingLoad;
    const fingerScore = Math.max(fingerStiff, fingerFist, fingerCrimp, fingerHang);
    const forearmScore = (forearmSore + forearmTight + forearmPump) / 3;
    const cnsScore = 10 - (((motivation + explosive + energy + focus) / 4) * 2);
    const genScore = (sleepQuality + (10 - stress)) / 2;
    const fingerR  = Math.max(0, Math.min(100, 100 - fingerScore * 10));
    const forearmR = Math.max(0, Math.min(100, 100 - forearmScore * 10));
    const skinR    = Math.max(0, Math.min(100, 100 - skin * 16.67));
    const cnsR     = Math.max(0, Math.min(100, 100 - cnsScore * 10));
    const genR     = Math.max(0, Math.min(100, genScore * 10));
    const balBonus = Math.max(-20, Math.min(10, balance * 0.5));
    const composite = Math.max(0, Math.min(100, fingerR*0.35 + forearmR*0.15 + skinR*0.10 + cnsR*0.15 + genR*0.15 + balBonus + 10));
    const systems = [
      { name: "Fingers", icon: "🤞", pct: fingerR },
      { name: "Forearms", icon: "💪", pct: forearmR },
      { name: "Skin", icon: "🖐️", pct: skinR },
      { name: "CNS / Power", icon: "⚡", pct: cnsR },
      { name: "General", icon: "😴", pct: genR },
    ];
    const minPct = Math.min(...systems.map(s => s.pct));
    systems.forEach(s => { s.isLimiting = s.pct === minPct; });
    return { score: Math.round(composite), balance, trainingLoad, fingerScore, fingerReadiness: fingerR, systems, sessionType, duration, date: new Date().toISOString() };
  }

  function handleNext() {
    if (step === 3) {
      const r = calcResult();
      setResult(r);
      // Save to history
      const next = [...history, { score: r.score, date: r.date, sessionType: r.sessionType, duration: r.duration }];
      setHistory(next);
      try { localStorage.setItem("crri_history", JSON.stringify(next)); } catch {}
      setStep(4);
    } else {
      setStep(s => s + 1);
    }
  }

  function handleReset() {
    setStep(0); setResult(null);
    setSessionType(null); setDuration(90); setIntensity(5); setLimitAttempts(0); setFingerType(null); setAge(25);
    setPostMeal(null); setProtein(null); setWater(2); setNap(null); setWalk(null); setColdShower(null); setStretch(null); setSleepBefore(7);
    setFingerStiff(0); setFingerFist(0); setFingerCrimp(0); setFingerHang(0);
    setForearmSore(0); setForearmTight(0); setForearmPump(0); setSkin(0);
    setMotivation(3); setExplosive(3); setEnergy(3); setFocus(3); setSleepQuality(7); setStress(3);
  }

  const canContinue = [
    sessionType && fingerType,
    postMeal !== null && protein !== null && nap !== null && walk !== null && coldShower !== null && stretch !== null,
    true, true,
  ][step] ?? true;

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;background:#252A3A;border-radius:3px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#C5F135;cursor:pointer;border:3px solid #0D0F14}
        input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#C5F135;cursor:pointer;border:3px solid #0D0F14}
        *{box-sizing:border-box} button{font-family:'Space Grotesk',system-ui,sans-serif}
      `}</style>

      <div style={s.header}>
        <span style={s.logo}>CRRI</span>
        <span style={{ fontSize: 13, color: C.muted, borderLeft: `1px solid ${C.border}`, paddingLeft: 12 }}>Climbing Recovery Index</span>
      </div>

      <div style={s.tabBar}>
        <button style={s.tab(activeTab === "log")} onClick={() => { setActiveTab("log"); if (step === 4) handleReset(); }}>Check-In</button>
        <button style={s.tab(activeTab === "history")} onClick={() => setActiveTab("history")}>History {history.length > 0 ? `(${history.length})` : ""}</button>
      </div>

      {activeTab === "history" ? (
        <HistoryTab history={history} onClear={() => { setHistory([]); try { localStorage.removeItem("crri_history"); } catch {} }} />
      ) : step === 4 && result ? (
        <ScorePage result={result} onReset={handleReset} onViewHistory={() => setActiveTab("history")} />
      ) : (
        <div style={s.container}>
          <div style={s.progressBar}>
            {[0,1,2,3].map(i => <div key={i} style={s.progressDot(i === step, i < step)} />)}
          </div>

          {step === 0 && <>
            <div style={s.sectionLabel}>Step 1 of 4</div>
            <div style={s.sectionTitle}>Session Details</div>
            <div style={s.sectionNote}>Log what you just did. Be honest — this is for you.</div>
            <Chips label="Session type" value={sessionType} onChange={setSessionType} options={["Bouldering","Routes","Strength","Conditioning","Competition","Mixed"]} />
            <Slider label="Duration" value={duration} min={30} max={240} onChange={setDuration} hint={`${Math.floor(duration/60)}h ${duration%60}m`} leftLabel="30 min" rightLabel="4 hrs" />
            <Slider label="Overall intensity" value={intensity} min={1} max={10} onChange={setIntensity} leftLabel="Easy mileage" rightLabel="Absolute limit" />
            <Slider label="Limit attempts" value={limitAttempts} min={0} max={40} onChange={setLimitAttempts} hint="Moves or problems at 90–100% effort" leftLabel="0" rightLabel="40+" />
            <Chips label="Finger hold type" value={fingerType} onChange={setFingerType} options={["Jugs","Mixed","Small crimps","Max crimps"]} />
            <div style={s.card}>
              <span style={s.label}>Your age</span>
              <p style={s.hint}>Adjusts load scoring — 30+ adds 50%, 45+ adds 60%</p>
              <div style={s.sliderRow}>
                <input type="range" min={14} max={70} value={age} onChange={e => setAge(Number(e.target.value))} style={s.slider} />
                <span style={s.sliderVal}>{age}</span>
              </div>
            </div>
          </>}

          {step === 1 && <>
            <div style={s.sectionLabel}>Step 2 of 4</div>
            <div style={s.sectionTitle}>Recovery Credits</div>
            <div style={s.sectionNote}>Since your last session. Recovery is training — log it accurately.</div>
            <Slider label="Sleep before midnight (hours)" value={sleepBefore} min={0} max={10} onChange={setSleepBefore} hint="3 pts per hour" leftLabel="0 hrs" rightLabel="10 hrs" />
            <Slider label="Water intake (litres)" value={water} min={0} max={6} onChange={setWater} hint="1 pt per litre (max 4 pts)" leftLabel="0 L" rightLabel="6 L" />
            <YesNo label="Post-session meal within 1 hour? (2 pts)" value={postMeal} onChange={setPostMeal} />
            <YesNo label="Hit daily protein goal? (3 pts)" value={protein} onChange={setProtein} />
            <YesNo label="Nap taken? (5 pts)" value={nap} onChange={setNap} />
            <YesNo label="Recovery walk or easy cycle? (2 pts)" value={walk} onChange={setWalk} />
            <YesNo label="Cold shower 5–10 min? (2 pts)" value={coldShower} onChange={setColdShower} />
            <YesNo label="Foam roll or stretching 15 min? (1 pt)" value={stretch} onChange={setStretch} />
          </>}

          {step === 2 && <>
            <div style={s.sectionLabel}>Step 3 of 4</div>
            <div style={s.sectionTitle}>Finger Recovery</div>
            <div style={s.sectionNote}>0 = no symptom · 10 = severe. Worst score governs.</div>
            <Slider label="Morning finger stiffness" value={fingerStiff} onChange={setFingerStiff} leftLabel="None" rightLabel="Severe" />
            <Slider label="Pain when squeezing a fist" value={fingerFist} onChange={setFingerFist} leftLabel="None" rightLabel="Severe" />
            <Slider label="Pain on crimp position" value={fingerCrimp} onChange={setFingerCrimp} leftLabel="None" rightLabel="Severe" />
            <Slider label="Pain on hangboard (or imagined)" value={fingerHang} onChange={setFingerHang} leftLabel="None" rightLabel="Severe" />
            {Math.max(fingerStiff, fingerFist, fingerCrimp, fingerHang) >= 5 && (
              <div style={{ background: `${C.orange}18`, border: `1px solid ${C.orange}55`, borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
                <span style={{ fontSize: 13, color: C.orange, fontWeight: 700 }}>⚠️ Finger score ≥5 — high injury risk flag active</span>
              </div>
            )}
          </>}

          {step === 3 && <>
            <div style={s.sectionLabel}>Step 4 of 4</div>
            <div style={s.sectionTitle}>Body & CNS</div>
            <div style={s.sectionNote}>Forearms, skin, and how your nervous system feels.</div>
            <div style={{ fontSize: 11, color: C.lime, letterSpacing: "0.14em", fontWeight: 700, margin: "20px 0 8px" }}>FOREARMS</div>
            <Slider label="Forearm soreness" value={forearmSore} onChange={setForearmSore} leftLabel="None" rightLabel="Severe" />
            <Slider label="Forearm tightness" value={forearmTight} onChange={setForearmTight} leftLabel="None" rightLabel="Severe" />
            <Slider label="Pump still present" value={forearmPump} onChange={setForearmPump} leftLabel="Gone" rightLabel="Still there" />
            <div style={{ fontSize: 11, color: C.lime, letterSpacing: "0.14em", fontWeight: 700, margin: "20px 0 8px" }}>SKIN</div>
            <div style={s.card}>
              <span style={s.label}>Skin condition</span>
              <p style={s.hint}>0 = Perfect · 2 = Thin · 4 = Split tips · 6 = Flappers</p>
              <div style={s.chipRow}>
                {[["Perfect",0],["Thin",2],["Split tips",4],["Flappers",6]].map(([label,val]) => (
                  <button key={val} style={s.chip(skin === val)} onClick={() => setSkin(val)}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.lime, letterSpacing: "0.14em", fontWeight: 700, margin: "20px 0 8px" }}>CNS / POWER (1–5)</div>
            <Slider label="Motivation to train" value={motivation} min={1} max={5} onChange={setMotivation} leftLabel="None" rightLabel="Fired up" />
            <Slider label="Feeling explosive" value={explosive} min={1} max={5} onChange={setExplosive} leftLabel="Flat" rightLabel="Explosive" />
            <Slider label="General energy" value={energy} min={1} max={5} onChange={setEnergy} leftLabel="Drained" rightLabel="Full energy" />
            <Slider label="Mental focus" value={focus} min={1} max={5} onChange={setFocus} leftLabel="Foggy" rightLabel="Sharp" />
            <div style={{ fontSize: 11, color: C.lime, letterSpacing: "0.14em", fontWeight: 700, margin: "20px 0 8px" }}>GENERAL RECOVERY</div>
            <Slider label="Sleep quality last night" value={sleepQuality} onChange={setSleepQuality} leftLabel="Terrible" rightLabel="Perfect" />
            <Slider label="Stress level" value={stress} onChange={setStress} leftLabel="None" rightLabel="Very high" />
          </>}

          <button style={{ ...s.btnPrimary, opacity: canContinue ? 1 : 0.5 }} onClick={handleNext} disabled={!canContinue}>
            {step === 3 ? "Calculate Readiness →" : "Continue →"}
          </button>
          {step > 0 && <button style={s.btnSecondary} onClick={() => setStep(s => s - 1)}>← Back</button>}
          {!canContinue && <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 8 }}>Complete all fields above to continue</p>}
          <div style={{ height: 40 }} />
        </div>
      )}
    </div>
  );
}
