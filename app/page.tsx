"use client";

import { useEffect, useRef, useState } from "react";

type HistoryEntry = { yearMonth: string; savedAmount: number };
type MonthlyPlanEntry = { yearMonth: string; amount: number };

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  emoji: string;
  color: string;
  monthlyContribution: number;
  monthlyPlan: MonthlyPlanEntry[];
  startDate: string;
  targetDate: string;
  history: HistoryEntry[];
  createdAt: string;
};

type Activity = {
  id: string;
  label: string;
  sub: string;
  amount: number;
  icon: "transfer" | "chart";
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function TransferIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

type Coin = { left: number; bottom: number; size: number; rot: number; anim: 0 | 1 | 2 };

function generateCoins(pct: number): Coin[] {
  const num = Math.max(0, Math.floor((pct / 100) * 80));
  const coins: Coin[] = [];
  for (let i = 0; i < num; i++) {
    coins.push({
      left: 20 + ((i * 61.8) % 60),
      bottom: 5 + ((i * 38.2) % (pct * 0.8 + 1)),
      size: 22 + ((i * 14.1) % 22),
      rot: (i * 113.5) % 360,
      anim: (i % 3) as 0 | 1 | 2,
    });
  }
  return coins;
}

function Gullak({ pct, coinAction }: { pct: number; coinAction: "insert" | "remove" | null }) {
  const coins = generateCoins(pct);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 400, height: 460 }}>
      {/* Full-color layer (bottom — shows through for filled portion) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gullak.png"
        alt=""
        aria-hidden
        className="absolute inset-0 z-10 w-full h-full object-contain pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Grayscale layer clipped to the unfilled (top) portion */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gullak.png"
        alt="Gullak"
        className="absolute inset-0 z-20 w-full h-full object-contain pointer-events-none transition-all duration-700"
        style={{
          mixBlendMode: "multiply",
          filter: "grayscale(1) brightness(1.05)",
          clipPath: `inset(0 0 ${pct}% 0)`,
        }}
      />

      {/* Animated 3D coin: drops in on insert, pops out on remove */}
      {coinAction && (
        <div
          key={coinAction}
          className={`absolute z-30 ${coinAction === "insert" ? "animate-coin-insert" : "animate-coin-remove"}`}
          style={{ top: "14%", left: "50%", width: 34, height: 34, perspective: 400 }}
        >
          {/* Coin face */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b 50%, #b45309)",
            boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: "bold",
            color: "#78350f",
            userSelect: "none",
          }}>
            ₹
          </div>
        </div>
      )}
    </div>
  );
}

function _OldGullak({ pct }: { pct: number }) {
  const fillColor = pct < 40 ? "#fb923c" : pct < 75 ? "#C2955A" : "#10b981";
  const fillY = 340 - Math.round((pct / 100) * 240);

  return (
    <svg viewBox="0 0 260 360" className="w-56 h-72 md:w-64 md:h-80 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Clip to the matka body shape */}
        <clipPath id="gullak-body-clip">
          {/*
            Traditional matka: widest at ~60% height, tapers toward bottom and top neck.
            Approximate with a path: start at neck base, curve out to widest, taper to base.
          */}
          <path d="
            M 100 82
            C 60 82, 18 130, 18 200
            C 18 275, 60 340, 130 340
            C 200 340, 242 275, 242 200
            C 242 130, 200 82, 160 82
            Z
          " />
        </clipPath>
        <linearGradient id="fill-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.85" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <radialGradient id="body-shine" cx="38%" cy="35%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="neck-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="130" cy="350" rx="78" ry="9" fill="#44403c" opacity="0.18" />

      {/* ── Pot body ── */}
      <path
        d="
          M 100 82
          C 60 82, 18 130, 18 200
          C 18 275, 60 340, 130 340
          C 200 340, 242 275, 242 200
          C 242 130, 200 82, 160 82
          Z
        "
        fill="url(#body-grad)"
      />

      {/* Money fill — clipped to pot body */}
      <g clipPath="url(#gullak-body-clip)">
        <rect
          x="10" y={fillY}
          width="240" height={360}
          fill="url(#fill-grad)"
          style={{ transition: "y 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* wavy surface line */}
        {pct > 3 && (
          <ellipse
            cx="130" cy={fillY}
            rx="112" ry="9"
            fill={fillColor} opacity="0.45"
            style={{ transition: "cy 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
        {pct > 3 && (
          <ellipse
            cx="130" cy={fillY}
            rx="68" ry="4"
            fill="white" opacity="0.18"
            style={{ transition: "cy 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </g>

      {/* Pot body shine overlay */}
      <path
        d="
          M 100 82
          C 60 82, 18 130, 18 200
          C 18 275, 60 340, 130 340
          C 200 340, 242 275, 242 200
          C 242 130, 200 82, 160 82
          Z
        "
        fill="url(#body-shine)"
      />

      {/* Pot body outline */}
      <path
        d="
          M 100 82
          C 60 82, 18 130, 18 200
          C 18 275, 60 340, 130 340
          C 200 340, 242 275, 242 200
          C 242 130, 200 82, 160 82
          Z
        "
        stroke="#9a3412" strokeWidth="2.5"
      />

      {/* Decorative band around the widest part */}
      <path
        d="M 22 210 Q 130 228 238 210"
        stroke="#9a3412" strokeWidth="2" strokeDasharray="6 4" opacity="0.5"
      />
      <path
        d="M 22 225 Q 130 243 238 225"
        stroke="#9a3412" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3"
      />

      {/* ── Neck ── */}
      <path
        d="M 96 82 C 96 64, 164 64, 164 82"
        fill="url(#neck-grad)" stroke="#9a3412" strokeWidth="2"
      />
      <rect x="92" y="78" width="76" height="16" rx="4" fill="url(#neck-grad)" stroke="#9a3412" strokeWidth="2" />

      {/* Neck highlight */}
      <rect x="100" y="80" width="60" height="6" rx="3" fill="white" opacity="0.15" />

      {/* ── Rim / mouth ── */}
      <ellipse cx="130" cy="76" rx="40" ry="11" fill="#7c2d12" />
      <ellipse cx="130" cy="72" rx="40" ry="11" fill="#c2410c" />
      <ellipse cx="130" cy="70" rx="40" ry="10" fill="#ea580c" />
      <ellipse cx="130" cy="68" rx="38" ry="8" fill="#fed7aa" opacity="0.25" />

      {/* ── Coin slot ── */}
      <rect x="117" y="60" width="26" height="8" rx="4" fill="#431407" />
      <rect x="118" y="61" width="24" height="5" rx="2.5" fill="#1c0a03" opacity="0.8" />

      {/* ── Coins on fill surface ── */}
      {pct > 8 && (
        <g style={{ transition: "opacity 0.5s" }}>
          <ellipse cx="100" cy={fillY - 16} rx="13" ry="5.5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="100" cy={fillY - 20} rx="13" ry="5.5" fill="#fef08a" />
          <text x="100" y={fillY - 16} textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold" dy="2">₹</text>
        </g>
      )}
      {pct > 28 && (
        <g style={{ transition: "opacity 0.5s" }}>
          <ellipse cx="158" cy={fillY - 20} rx="13" ry="5.5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="158" cy={fillY - 24} rx="13" ry="5.5" fill="#fef08a" />
          <text x="158" y={fillY - 20} textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold" dy="2">₹</text>
        </g>
      )}
      {pct > 52 && (
        <g style={{ transition: "opacity 0.5s" }}>
          <ellipse cx="128" cy={fillY - 26} rx="13" ry="5.5" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="128" cy={fillY - 30} rx="13" ry="5.5" fill="#fef08a" />
          <text x="128" y={fillY - 26} textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold" dy="2">₹</text>
        </g>
      )}

      {/* Coin entering slot animation hint */}
      <rect x="124" y="40" width="12" height="18" rx="2" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" opacity="0.7" />
      <text x="130" y="52" textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold">₹</text>
    </svg>
  );
}
// ── helpers ──────────────────────────────────────────────────────────────────

function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

function buildExpected(
  startDate: string,
  targetDate: string,
  monthlyContribution: number,
  targetAmount: number,
  monthlyPlan: MonthlyPlanEntry[] = []
): { ym: string; amount: number }[] {
  if (!startDate || !targetDate) return [];
  const total = monthsBetween(startDate, targetDate);
  if (total <= 0) return [];
  const pts: { ym: string; amount: number }[] = [];
  let cumulative = 0;
  for (let i = 0; i <= total; i++) {
    const ym = addMonths(startDate, i);
    if (i > 0) {
      const planEntry = monthlyPlan.find((p) => p.yearMonth === ym);
      cumulative += planEntry ? planEntry.amount : monthlyContribution;
    }
    pts.push({ ym, amount: Math.min(cumulative, targetAmount) });
  }
  return pts;
}

// ── Progress Chart ────────────────────────────────────────────────────────────

function ProgressChart({ goal }: { goal: Goal }) {
  const { startDate, targetDate, monthlyContribution, targetAmount, history } = goal;
  const expected = buildExpected(startDate, targetDate, monthlyContribution, targetAmount, goal.monthlyPlan);
  if (expected.length < 2) {
    return (
      <div className="w-full flex items-center justify-center h-40 text-slate-400 text-xs text-center px-4">
        Set a monthly contribution and target date to see your progress chart.
      </div>
    );
  }

  const W = 320, H = 160, PL = 46, PR = 12, PT = 12, PB = 28;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  // x: month index 0..n, y: amount 0..targetAmount
  const n = expected.length - 1;
  const xScale = (i: number) => PL + (i / n) * chartW;
  const yScale = (v: number) => PT + chartH - (v / targetAmount) * chartH;

  // Expected polyline
  const expPts = expected.map((p, i) => `${xScale(i)},${yScale(p.amount)}`).join(" ");

  // Actual: map history entries to x positions
  const actualPts = history
    .map((h) => {
      const idx = monthsBetween(startDate, h.yearMonth);
      if (idx < 0 || idx > n) return null;
      return `${xScale(idx)},${yScale(h.savedAmount)}`;
    })
    .filter(Boolean)
    .join(" ");

  // x-axis labels: show ~5 evenly spaced months
  const labelStep = Math.max(1, Math.floor(n / 4));
  const xLabels: { label: string; x: number }[] = [];
  for (let i = 0; i <= n; i += labelStep) {
    const ym = expected[i].ym;
    const [, m] = ym.split("-");
    xLabels.push({ label: new Date(2000, Number(m) - 1).toLocaleString("en", { month: "short" }), x: xScale(i) });
  }

  // y-axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: Math.round(targetAmount * f),
    y: yScale(targetAmount * f),
  }));

  // On-track status
  const thisMonth = new Date();
  const ym = `${thisMonth.getFullYear()}-${String(thisMonth.getMonth() + 1).padStart(2, "0")}`;
  const monthsElapsed = Math.max(0, monthsBetween(startDate, ym));
  const expectedNow = Math.min(monthlyContribution * monthsElapsed, targetAmount);
  const onTrack = goal.savedAmount >= expectedNow * 0.9;

  return (
    <div className="w-full">
      {/* Status pill */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress Chart</p>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${onTrack ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {onTrack ? "✓ On Track" : "⚠ Behind"}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        {/* Grid lines */}
        {yLabels.map((l) => (
          <line key={l.value} x1={PL} x2={W - PR} y1={l.y} y2={l.y} stroke="#e2e8f0" strokeWidth="1" />
        ))}

        {/* Expected line (dashed teal) */}
        {expPts && (
          <polyline points={expPts} fill="none" stroke="#C2955A" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Actual line (solid orange→green) */}
        {actualPts && (
          <polyline points={actualPts} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Actual dots */}
        {history.map((h) => {
          const idx = monthsBetween(startDate, h.yearMonth);
          if (idx < 0 || idx > n) return null;
          return (
            <circle key={h.yearMonth} cx={xScale(idx)} cy={yScale(h.savedAmount)} r={3} fill="#f59e0b" stroke="white" strokeWidth="1.5" />
          );
        })}

        {/* Y-axis labels */}
        {yLabels.map((l) => (
          <text key={l.value} x={PL - 4} y={l.y + 3.5} textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="inherit">
            {l.value >= 1000 ? `${Math.round(l.value / 1000)}k` : l.value}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((l) => (
          <text key={l.label + l.x} x={l.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="inherit">
            {l.label}
          </text>
        ))}

        {/* Axes */}
        <line x1={PL} x2={PL} y1={PT} y2={H - PB} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={PL} x2={W - PR} y1={H - PB} y2={H - PB} stroke="#cbd5e1" strokeWidth="1" />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center mt-1">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#C2955A" strokeWidth="2" strokeDasharray="4 2" /></svg>
          <span className="text-xs text-slate-500">Expected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#f59e0b" strokeWidth="2.5" /></svg>
          <span className="text-xs text-slate-500">Actual</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function InlineAmountInput({
  savedAmount,
  targetAmount,
  onDeposit,
}: {
  savedAmount: number;
  targetAmount: number;
  onDeposit: (val: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [delta, setDelta] = useState(0);          // live swipe px offset
  const [fired, setFired] = useState<"add" | "sub" | null>(null); // flash feedback
  const startX = useRef<number | null>(null);
  const THRESHOLD = 72;

  function getX(e: React.TouchEvent | React.MouseEvent) {
    return "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e: React.TouchEvent | React.MouseEvent) {
    startX.current = getX(e);
  }

  function onMove(e: React.TouchEvent | React.MouseEvent) {
    if (startX.current === null) return;
    const raw = getX(e) - startX.current;
    setDelta(Math.max(-THRESHOLD, Math.min(THRESHOLD, raw)));
  }

  async function trigger(action: "add" | "sub") {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    const signed = action === "add" ? val : -val;
    setFired(action);
    setLoading(true);
    await onDeposit(signed);
    setAmount("");
    setLoading(false);
    setTimeout(() => setFired(null), 700);
  }

  async function onEnd() {
    if (startX.current === null) return;
    if (Math.abs(delta) >= THRESHOLD) {
      await trigger(delta < 0 ? "add" : "sub");
    }
    setDelta(0);
    startX.current = null;
  }

  const swipeDir = delta < -20 ? "add" : delta > 20 ? "sub" : null;
  const addReady  = delta <= -(THRESHOLD - 4);
  const subReady  = delta >= (THRESHOLD - 4);

  const addPct  = Math.min(1, Math.max(0, -delta / THRESHOLD));
  const subPct  = Math.min(1, Math.max(0,  delta / THRESHOLD));

  return (
    <div className="w-full mt-2 select-none">
      <div className="relative flex items-center" style={{ height: 72 }}>

        {/* ── Left: + (Add) ── */}
        <button
          type="button"
          onClick={() => trigger("add")}
          className="absolute left-0 flex items-center justify-end overflow-hidden focus:outline-none active:scale-95 transition-transform"
          style={{ width: "17%", height: "100%" }}
        >
          <div
            className="flex items-center justify-center transition-all duration-150 w-full h-full"
            style={{
              clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%)",
              background: addReady ? "#C2955A" : `rgba(194,149,90,${0.12 + addPct * 0.75})`,
            }}
          >
            <span className="font-bold text-2xl pr-4"
              style={{ color: addReady ? "#fff" : `rgba(166,120,64,${0.5 + addPct * 0.5})` }}>
              +
            </span>
          </div>
        </button>

        {/* ── Right: − (Remove) ── */}
        <button
          type="button"
          onClick={() => trigger("sub")}
          className="absolute right-0 flex items-center justify-start overflow-hidden focus:outline-none active:scale-95 transition-transform"
          style={{ width: "17%", height: "100%" }}
        >
          <div
            className="flex items-center justify-center transition-all duration-150 w-full h-full"
            style={{
              clipPath: "polygon(22px 0, 100% 0, 100% 100%, 22px 100%, 0 50%)",
              background: subReady ? "#ef4444" : `rgba(239,68,68,${0.10 + subPct * 0.72})`,
            }}
          >
            <span className="font-bold text-2xl pl-4"
              style={{ color: subReady ? "#fff" : `rgba(185,28,28,${0.5 + subPct * 0.5})` }}>
              −
            </span>
          </div>
        </button>

        {/* ── Centre input pill ── */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            transform: `translateX(calc(-50% + ${delta}px))`,
            transition: delta === 0 ? "transform 0.3s cubic-bezier(.34,1.56,.64,1)" : "none",
            width: 160,
          }}
        >
          <div
            className={`flex flex-col items-center justify-center rounded-3xl shadow-lg border-2 cursor-grab active:cursor-grabbing touch-none py-2 px-3 ${
              fired === "add"  ? "bg-sand-50 border-sand-400 shadow-sand-200" :
              fired === "sub"  ? "bg-red-50 border-red-300 shadow-red-100" :
              addReady         ? "bg-sand-500 border-sand-500 shadow-sand-300" :
              subReady         ? "bg-red-500 border-red-500 shadow-red-200" :
              "bg-white border-slate-200 shadow-slate-100"
            }`}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
            onMouseLeave={onEnd}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
          >
            <span className={`text-xs font-semibold mb-0.5 ${addReady || subReady ? "text-white/80" : "text-slate-400"}`}>₹</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder={loading ? "…" : "0"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`w-full text-center text-2xl font-extrabold bg-transparent focus:outline-none ${
                addReady || subReady ? "text-white placeholder:text-white/50" : "text-slate-700 placeholder:text-slate-200"
              }`}
              style={{ width: 120 }}
            />
          </div>
        </div>
      </div>

      {/* Subtle hint */}
      <p className="text-center text-xs text-slate-300 mt-1 pointer-events-none">drag left to add · drag right to remove</p>
    </div>
  );
}

// Irregular polygon shards covering a 400×460 area
const SHARDS: { clip: string; tx: string; ty: string; rot: string }[] = [
  { clip: "polygon(0% 0%, 45% 0%, 30% 35%, 0% 25%)",          tx: "-120px", ty: "-100px", rot: "-35deg" },
  { clip: "polygon(45% 0%, 100% 0%, 100% 20%, 60% 30%)",       tx: "130px",  ty: "-110px", rot: "40deg"  },
  { clip: "polygon(30% 35%, 45% 0%, 60% 30%, 50% 55%)",        tx: "20px",   ty: "-130px", rot: "-15deg" },
  { clip: "polygon(0% 25%, 30% 35%, 50% 55%, 20% 65%)",        tx: "-140px", ty: "0px",    rot: "-50deg" },
  { clip: "polygon(50% 55%, 60% 30%, 100% 20%, 80% 60%)",      tx: "150px",  ty: "-20px",  rot: "45deg"  },
  { clip: "polygon(20% 65%, 50% 55%, 80% 60%, 60% 85%)",       tx: "0px",    ty: "80px",   rot: "20deg"  },
  { clip: "polygon(0% 25%, 20% 65%, 5% 100%, 0% 80%)",         tx: "-130px", ty: "110px",  rot: "-60deg" },
  { clip: "polygon(60% 85%, 80% 60%, 100% 80%, 100% 100%)",    tx: "140px",  ty: "120px",  rot: "55deg"  },
  { clip: "polygon(5% 100%, 20% 65%, 60% 85%, 40% 100%)",      tx: "-60px",  ty: "150px",  rot: "-25deg" },
  { clip: "polygon(40% 100%, 60% 85%, 100% 100%)",             tx: "60px",   ty: "160px",  rot: "30deg"  },
  { clip: "polygon(100% 20%, 100% 80%, 80% 60%)",              tx: "170px",  ty: "60px",   rot: "65deg"  },
  { clip: "polygon(0% 80%, 5% 100%, 0% 100%)",                 tx: "-160px", ty: "140px",  rot: "-70deg" },
];

function GullakShatter({ active, w, h }: { active: boolean; w: number; h: number }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50" style={{ width: w, height: h }}>
      {SHARDS.map((s, i) => (
        <div
          key={i}
          className="shard-animate absolute inset-0"
          style={{
            clipPath: s.clip,
            "--tx": s.tx,
            "--ty": s.ty,
            "--rot": s.rot,
            animationDelay: `${i * 18}ms`,
          } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gullak.png"
            alt=""
            aria-hidden
            style={{ width: w, height: h, objectFit: "contain", mixBlendMode: "multiply" }}
          />
        </div>
      ))}
    </div>
  );
}

function GullakFlipCard({
  pct,
  coinAction,
  goal,
  onFlip,
  breaking,
}: {
  pct: number;
  coinAction: "insert" | "remove" | null;
  goal: Goal | null;
  onFlip?: (flipped: boolean) => void;
  breaking?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const savedAmount = goal?.savedAmount ?? 0;
  const targetAmount = goal?.targetAmount ?? 1;
  const remaining = Math.max(0, targetAmount - savedAmount);
  const fillPct = Math.min(100, pct);
  const barColor = fillPct < 40 ? "#fb923c" : fillPct < 75 ? "#C2955A" : "#10b981";

  return (
    <>
      {/* ── Flip card (front = gullak, back = balance) ── */}
      <div className="relative" style={{ width: 400, height: 460 }}>
      {/* Shatter overlay */}
      <GullakShatter active={!!breaking} w={400} h={460} />
      <div
        className={`flip-card cursor-pointer select-none ${breaking ? "opacity-0" : ""}`}
        style={{ width: 400, height: 460, transition: breaking ? "opacity 0.1s 0.15s" : "none" }}
        onClick={() => { if (!breaking) setFlipped((f) => { onFlip?.(!f); return !f; }); }}
        title={flipped ? "Click to see gullak" : "Click for details"}
      >
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-front">
            <Gullak pct={pct} coinAction={coinAction} />
          </div>

          {/* Back: balance summary */}
          <div className="flip-back rounded-3xl border border-slate-100 shadow-xl bg-white flex flex-col items-center justify-center gap-4 p-6" style={{ width: 400, height: 460 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Balance</p>
            <div className="text-center">
              <p className="text-6xl font-extrabold text-slate-800 tabular-nums">{fillPct}%</p>
              <p className="text-xs text-slate-400 mt-1">of goal filled</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fillPct}%`, background: barColor }} />
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="bg-sand-50 rounded-2xl p-3 text-center">
                <p className="text-xs font-bold uppercase text-sand-500 mb-1">Saved</p>
                <p className="text-sm font-extrabold text-sand-700">{fmt(savedAmount)}</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-3 text-center">
                <p className="text-xs font-bold uppercase text-red-400 mb-1">Left</p>
                <p className="text-sm font-extrabold text-red-600">{fmt(remaining)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">Tap to flip back</p>
          </div>
        </div>
      </div>
      </div>{/* end relative shatter wrapper */}

    </>
  );
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function MonthYearPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string; // "YYYY-MM" or ""
  onChange: (v: string) => void;
}) {
  const today = new Date();
  const initYear = value ? parseInt(value.split("-")[0]) : today.getFullYear();
  const [pickerYear, setPickerYear] = useState(initYear);
  const [open, setOpen] = useState(false);

  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : -1;
  const selectedYear  = value ? parseInt(value.split("-")[0]) : -1;

  const minYear = today.getFullYear();
  const minMonth = today.getMonth(); // 0-indexed; can't pick past months

  function select(monthIdx: number) {
    const ym = `${pickerYear}-${String(monthIdx + 1).padStart(2, "0")}`;
    onChange(ym);
    setOpen(false);
  }

  function isDisabled(monthIdx: number) {
    return pickerYear < minYear || (pickerYear === minYear && monthIdx < minMonth);
  }

  const displayLabel = value
    ? `${MONTHS[selectedMonth]} ${selectedYear}`
    : "Pick a month";

  return (
    <div className="relative">
      <label className="text-sm font-semibold text-slate-700 block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => { setPickerYear(initYear); setOpen((o) => !o); }}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sand-500 ${
          value ? "border-sand-400 bg-sand-50 text-sand-700 font-semibold" : "border-slate-200 bg-white text-slate-400"
        }`}
      >
        <span>{displayLabel}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-4">
          {/* Year navigator */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setPickerYear((y) => Math.max(minYear, y - 1))}
              disabled={pickerYear <= minYear}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              ‹
            </button>
            <span className="font-bold text-slate-700 text-sm">{pickerYear}</span>
            <button
              type="button"
              onClick={() => setPickerYear((y) => y + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            >
              ›
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((m, i) => {
              const disabled = isDisabled(i);
              const active = pickerYear === selectedYear && i === selectedMonth;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={disabled}
                  onClick={() => select(i)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-sand-600 text-white shadow-sm"
                      : disabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-sand-50 hover:text-sand-700"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "", targetAmount: "", targetDate: "",
    monthlyContribution: "", initialSaved: "",
    divideEqually: true,
    monthlyPlan: {} as Record<string, string>, // yearMonth → amount string
  });
  const [coinAction, setCoinAction] = useState<"insert" | "remove" | null>(null);
  const [gullakFlipped, setGullakFlipped] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showBreakConfirm, setShowBreakConfirm] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const goal = selectedId ? (goals.find((g) => g.id === selectedId) ?? null) : null;
  const pct = goal ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;

  async function fetchGoals() {
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data.goals ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchGoals();
    setActivities([
      { id: "1", label: "Monthly Contribution", sub: "Automated Transfer", amount: 2500, icon: "transfer" },
      { id: "2", label: "Market Gains", sub: "Portfolio Performance", amount: 1142, icon: "chart" },
    ]);
  }, []);

  function triggerCoin(action: "insert" | "remove") {
    setCoinAction(null);
    setTimeout(() => {
      setCoinAction(action);
      setTimeout(() => setCoinAction(null), 800);
    }, 10);
  }

  async function breakGoal() {
    if (!goal) return;
    setShowBreakConfirm(false);
    setBreaking(true);
    // shards: 750ms animation + 12 shards × 18ms stagger = ~966ms total
    // wait a bit longer so the last shard fully fades before removing
    setTimeout(async () => {
      await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
      setSelectedId(null);
      setBreaking(false);
      fetchGoals();
    }, 1100);
  }


  // months from today to targetDate (inclusive) for per-month plan
  const addFormMonths: string[] = (() => {
    if (!addForm.targetDate) return [];
    const now = new Date();
    const months: string[] = [];
    let y = now.getFullYear(), m = now.getMonth() + 1;
    const [ty, tm] = addForm.targetDate.split("-").map(Number);
    while (y < ty || (y === ty && m <= tm)) {
      months.push(`${y}-${String(m).padStart(2, "0")}`);
      m++; if (m > 12) { m = 1; y++; }
    }
    return months;
  })();

  const equalMonthly = (() => {
    const target = Number(addForm.targetAmount) || 0;
    const alreadySaved = Number(addForm.initialSaved) || 0;
    const remaining = Math.max(0, target - alreadySaved);
    return addFormMonths.length > 0 ? Math.ceil(remaining / addFormMonths.length) : 0;
  })();

  async function createGoal(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlyContribution = addForm.divideEqually ? equalMonthly : 0;
    const monthlyPlan: MonthlyPlanEntry[] = addForm.divideEqually
      ? []
      : addFormMonths.map((ym) => ({ yearMonth: ym, amount: Number(addForm.monthlyPlan[ym]) || 0 }));
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: addForm.title,
        targetAmount: Number(addForm.targetAmount),
        targetDate: addForm.targetDate,
        monthlyContribution,
        monthlyPlan,
        initialSaved: Number(addForm.initialSaved) || 0,
        startDate,
        emoji: "🎯",
        color: "blue",
      }),
    });
    const created = await res.json();
    setAddForm({ title: "", targetAmount: "", targetDate: "", monthlyContribution: "", initialSaved: "", divideEqually: true, monthlyPlan: {} });
    setShowAddModal(false);
    setSaving(false);
    setSelectedId(created.id);
    fetchGoals();
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-4 h-14 md:px-8 md:h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-sand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-xl">G</span>
            </div>
            <span className="text-base md:text-xl font-bold tracking-tight">
              Gullak <span className="text-sand-600">Wealth</span>
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-sand-600 text-white text-xs md:text-sm px-3 py-2 md:px-5 md:py-2.5 rounded-full font-semibold hover:bg-sand-700 active:scale-95 transition-all shadow-sm"
          >
            <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            New Goal
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center px-4 pt-8 pb-24 md:px-8 md:pt-12 md:pb-16">
        <div className="w-full max-w-sm md:max-w-md flex flex-col items-center gap-6">

          {/* ── GRID VIEW (no goal selected) ── */}
          {!loading && !goal && goals.length > 0 && (
            <>
              <div className="w-full text-left">
                <h1 className="text-2xl font-extrabold text-slate-800">My Gullaks</h1>
                <p className="text-sm text-slate-400 mt-0.5">{goals.length} saving{goals.length !== 1 ? "s" : ""} goal{goals.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                {goals.map((g) => {
                  const gpct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedId(g.id)}
                      className="bg-white rounded-3xl shadow-md border border-slate-100 flex flex-col items-center pt-5 pb-4 px-3 gap-2 active:scale-95 transition-all hover:shadow-lg hover:border-sand-200"
                    >
                      {/* Mini gullak with color split */}
                      <div className="relative" style={{ width: 100, height: 110 }}>
                        {/* colour layer */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/gullak.png" alt="" aria-hidden
                          className="absolute inset-0 w-full h-full object-contain"
                          style={{ mixBlendMode: "multiply" }} />
                        {/* greyscale top mask */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/gullak.png" alt=""
                          className="absolute inset-0 w-full h-full object-contain transition-all duration-700"
                          style={{ mixBlendMode: "multiply", filter: "grayscale(1) brightness(1.05)", clipPath: `inset(0 0 ${gpct}% 0)` }} />
                      </div>
                      {/* % ring label */}
                      <div className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${gpct >= 100 ? "bg-green-100 text-green-700" : gpct >= 50 ? "bg-sand-50 text-sand-700" : "bg-slate-100 text-slate-500"}`}>
                        {gpct}%
                      </div>
                      <p className="text-xs font-bold text-slate-700 text-center leading-tight line-clamp-2">{g.title}</p>
                      <p className="text-xs text-slate-400">{fmt(g.targetAmount)}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── DETAIL VIEW (goal selected) ── */}
          {!loading && goal && (
            <>
              {/* Back button + title */}
              <div className="w-full flex items-center gap-3">
                <button
                  onClick={() => { setSelectedId(null); setGullakFlipped(false); }}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-sand-600 transition-colors font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  All Gullaks
                </button>
                <div className="flex-1">
                  <h1 className="text-lg font-extrabold text-slate-800 truncate">{goal.title}</h1>
                  <p className="text-xs text-sand-600 font-semibold">{fmt(goal.targetAmount)}</p>
                </div>
              </div>

              {/* Card */}
              <div className="bg-white w-full rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center px-6 pt-8 pb-6 gap-4">
                <GullakFlipCard
                  pct={pct}
                  coinAction={coinAction}
                  goal={goal}
                  onFlip={setGullakFlipped}
                  breaking={breaking}
                />

                {/* Inline +/- input */}
                {pct < 100 ? (
                  <InlineAmountInput
                    savedAmount={goal.savedAmount}
                    targetAmount={goal.targetAmount}
                    onDeposit={async (val) => {
                      const res = await fetch(`/api/goals/${goal.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deposit: val }),
                      });
                      if (res.ok) {
                        triggerCoin(val > 0 ? "insert" : "remove");
                        setActivities((prev) => [
                          { id: Date.now().toString(), label: val > 0 ? "Contribution Added" : "Withdrawal", sub: "Manual", amount: val, icon: "transfer" },
                          ...prev,
                        ]);
                        fetchGoals();
                      }
                    }}
                  />
                ) : (
                  <p className="mt-2 text-green-600 font-bold text-base text-center">🎉 Goal Achieved!</p>
                )}
              </div>

              {/* Break gullak button */}
              <button
                onClick={() => setShowBreakConfirm(true)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors mx-auto py-1"
              >
                <span className="text-base">🔨</span> Break Gullak
              </button>

              {/* Progress chart — shown only when gullak is flipped */}
              {gullakFlipped && (
                <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm px-4 pt-4 pb-3">
                  <ProgressChart goal={goal} />
                </div>
              )}
            </>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && goals.length === 0 && (
            <div className="text-center py-16 w-full">
              <p className="text-5xl mb-4">🪙</p>
              <p className="text-slate-500 mb-5 text-sm">No gullaks yet. Create your first one!</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-sand-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-sand-700 active:scale-95 transition-all"
              >
                + Create Goal
              </button>
            </div>
          )}

          {loading && (
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              {[1,2,3,4].map(i => <div key={i} className="h-52 bg-slate-100 rounded-3xl animate-pulse" />)}
            </div>
          )}
        </div>
      </main>



      {/* ── Break Gullak confirm sheet ── */}
      {showBreakConfirm && goal && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBreakConfirm(false); }}
        >
          <div className="bg-white w-full md:max-w-sm rounded-t-3xl md:rounded-3xl shadow-2xl px-6 pt-6 pb-10 md:py-8 flex flex-col items-center gap-4">
            <div className="text-5xl">🔨</div>
            <h2 className="text-xl font-extrabold text-slate-800 text-center">Break the Gullak?</h2>
            <p className="text-sm text-slate-500 text-center leading-relaxed">
              You&apos;ve saved <span className="font-bold text-sand-600">{fmt(goal.savedAmount)}</span> in <span className="font-bold">{goal.title}</span>.<br/>
              Breaking it will remove this goal permanently.
            </p>
            <div className="w-full flex gap-3 mt-2">
              <button
                onClick={() => setShowBreakConfirm(false)}
                className="flex-1 border border-slate-200 rounded-2xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
              >
                Keep it
              </button>
              <button
                onClick={breakGoal}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 text-sm font-bold active:scale-95 transition-all"
              >
                🔨 Break it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Goal — bottom sheet ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            <div className="px-5 pt-4 pb-10 md:px-8 md:py-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">New Savings Goal</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none p-1 -mr-1">×</button>
              </div>
              <form onSubmit={createGoal} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">What are you saving for?</label>
                  <input
                    required
                    value={addForm.title}
                    onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Emergency Fund"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sand-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Target Amount (₹)</label>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={addForm.targetAmount}
                    onChange={(e) => setAddForm((f) => ({ ...f, targetAmount: e.target.value }))}
                    placeholder="500000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sand-500"
                  />
                </div>
                <MonthYearPicker
                  label="By when?"
                  value={addForm.targetDate}
                  onChange={(v) => setAddForm((f) => ({ ...f, targetDate: v }))}
                />
                {/* ── Monthly Contribution ── */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 block">Monthly Savings Plan</label>

                  {/* Divide equally toggle */}
                  <button
                    type="button"
                    onClick={() => setAddForm((f) => ({ ...f, divideEqually: !f.divideEqually }))}
                    className={`flex items-center gap-2.5 w-full border rounded-xl px-4 py-3 text-sm transition-all ${
                      addForm.divideEqually
                        ? "border-sand-500 bg-sand-50 text-sand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      addForm.divideEqually ? "border-sand-600 bg-sand-600" : "border-slate-300"
                    }`}>
                      {addForm.divideEqually && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 text-left">
                      Divide equally
                      {addForm.divideEqually && addFormMonths.length > 0 && (
                        <span className="ml-1 font-bold">
                          — ₹{equalMonthly.toLocaleString("en-IN")} / month
                        </span>
                      )}
                    </span>
                    {addForm.divideEqually && addFormMonths.length > 0 && (
                      <span className="text-xs text-sand-500">over {addFormMonths.length} months</span>
                    )}
                  </button>

                  {/* Per-month plan (when not dividing equally) */}
                  {!addForm.divideEqually && addFormMonths.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Month</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (₹)</span>
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                        {addFormMonths.map((ym) => {
                          const [yr, mo] = ym.split("-");
                          const label = new Date(Number(yr), Number(mo) - 1).toLocaleString("default", { month: "short", year: "2-digit" });
                          return (
                            <div key={ym} className="flex items-center px-4 py-2.5 gap-3">
                              <span className="text-sm text-slate-700 w-14 flex-shrink-0 font-medium">{label}</span>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                value={addForm.monthlyPlan[ym] ?? ""}
                                onChange={(e) =>
                                  setAddForm((f) => ({
                                    ...f,
                                    monthlyPlan: { ...f.monthlyPlan, [ym]: e.target.value },
                                  }))
                                }
                                placeholder="0"
                                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sand-500 text-right"
                              />
                            </div>
                          );
                        })}
                      </div>
                      {/* Running total */}
                      {(() => {
                        const total = addFormMonths.reduce((s, ym) => s + (Number(addForm.monthlyPlan[ym]) || 0), 0);
                        const target = Number(addForm.targetAmount) || 0;
                        const alreadySaved = Number(addForm.initialSaved) || 0;
                        const diff = total + alreadySaved - target;
                        return (
                          <div className={`px-4 py-2.5 border-t text-xs flex justify-between ${diff >= 0 ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                            <span>Planned total</span>
                            <span className="font-bold">
                              ₹{total.toLocaleString("en-IN")} {diff >= 0 ? `✓ on track` : `(₹${Math.abs(diff).toLocaleString("en-IN")} short)`}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {!addForm.divideEqually && addFormMonths.length === 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">Set a target date first to plan monthly contributions.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Already Saved (₹) <span className="font-normal text-slate-400">— optional</span></label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={addForm.initialSaved}
                    onChange={(e) => setAddForm((f) => ({ ...f, initialSaved: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sand-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Any money already set aside for this goal?</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-sand-600 hover:bg-sand-700 text-white rounded-xl py-3 text-sm font-semibold active:scale-95 transition-all disabled:opacity-60"
                  >
                    {saving ? "Creating…" : "Create Goal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
