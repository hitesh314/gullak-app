"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
    <div className="relative flex items-center justify-center w-full" style={{ height: 340 }}>
      {/* Full-color layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gullak.png"
        alt=""
        aria-hidden
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply", objectFit: "fill" }}
      />

      {/* Grayscale layer clipped to unfilled (top) portion */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gullak.png"
        alt="Gullak"
        className="absolute inset-0 z-20 w-full h-full pointer-events-none transition-all duration-700"
        style={{
          mixBlendMode: "multiply",
          filter: "grayscale(1) brightness(1.05)",
          clipPath: `inset(0 0 ${pct}% 0)`,
          objectFit: "fill",
        }}
      />

      {/* Animated 3D coin: drops in on insert, pops out on remove */}
      {coinAction && (
        <div
          key={coinAction}
          className={`absolute z-30 ${coinAction === "insert" ? "animate-coin-insert" : "animate-coin-remove"}`}
          style={{ top: "14%", left: "50%", width: 64, height: 64, perspective: 400 }}
        >
          {/* Coin face */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b 50%, #b45309)",
            boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.5), 0 6px 20px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
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
  scrollToRef,
}: {
  savedAmount: number;
  targetAmount: number;
  onDeposit: (val: number) => Promise<void>;
  scrollToRef?: React.RefObject<HTMLElement | null>;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<"add" | "sub" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function trigger(action: "add" | "sub") {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    // Dismiss keyboard and scroll to gullak before animation plays
    inputRef.current?.blur();
    if (scrollToRef?.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setLoading(true);
    setFlash(action);
    await onDeposit(action === "add" ? val : -val);
    setAmount("");
    setLoading(false);
    setTimeout(() => setFlash(null), 600);
  }

  const canSubmit = !loading && parseFloat(amount) > 0;

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="flex items-center gap-4">

        {/* − button */}
        <button
          type="button"
          onClick={() => trigger("sub")}
          disabled={!canSubmit}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all active:scale-90 shadow-md disabled:opacity-25 disabled:shadow-none ${flash === "sub" ? "bg-red-500 border-red-500 text-white shadow-red-200" : "bg-red-50 border-red-300 text-red-500 hover:bg-red-100 shadow-red-100"
            }`}
        >
          −
        </button>

        {/* Amount input */}
        <div className={`flex items-center gap-1 border-2 rounded-2xl px-5 py-3 transition-all ${flash === "add" ? "border-[#C2955A] bg-[#FDF8F0]" :
            flash === "sub" ? "border-red-300 bg-red-50" :
              "border-slate-200 bg-white"
          }`} style={{ width: 148 }}>
          <span className="text-slate-400 font-semibold text-sm">₹</span>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-center text-2xl font-extrabold text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-200"
          />
        </div>

        {/* + button */}
        <button
          type="button"
          onClick={() => trigger("add")}
          disabled={!canSubmit}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all active:scale-90 shadow-md disabled:opacity-25 disabled:shadow-none ${flash === "add" ? "bg-[#C2955A] border-[#C2955A] text-white shadow-[#E2C48E]" : "bg-[#FDF8F0] border-[#C2955A] text-[#C2955A] hover:bg-[#FAF3E6] shadow-[#EDD9B0]"
            }`}
        >
          +
        </button>
      </div>
    </div>
  );
}

// Irregular polygon shards covering a 400×460 area
const SHARDS: { clip: string; tx: string; ty: string; rot: string }[] = [
  { clip: "polygon(0% 0%, 45% 0%, 30% 35%, 0% 25%)", tx: "-120px", ty: "-100px", rot: "-35deg" },
  { clip: "polygon(45% 0%, 100% 0%, 100% 20%, 60% 30%)", tx: "130px", ty: "-110px", rot: "40deg" },
  { clip: "polygon(30% 35%, 45% 0%, 60% 30%, 50% 55%)", tx: "20px", ty: "-130px", rot: "-15deg" },
  { clip: "polygon(0% 25%, 30% 35%, 50% 55%, 20% 65%)", tx: "-140px", ty: "0px", rot: "-50deg" },
  { clip: "polygon(50% 55%, 60% 30%, 100% 20%, 80% 60%)", tx: "150px", ty: "-20px", rot: "45deg" },
  { clip: "polygon(20% 65%, 50% 55%, 80% 60%, 60% 85%)", tx: "0px", ty: "80px", rot: "20deg" },
  { clip: "polygon(0% 25%, 20% 65%, 5% 100%, 0% 80%)", tx: "-130px", ty: "110px", rot: "-60deg" },
  { clip: "polygon(60% 85%, 80% 60%, 100% 80%, 100% 100%)", tx: "140px", ty: "120px", rot: "55deg" },
  { clip: "polygon(5% 100%, 20% 65%, 60% 85%, 40% 100%)", tx: "-60px", ty: "150px", rot: "-25deg" },
  { clip: "polygon(40% 100%, 60% 85%, 100% 100%)", tx: "60px", ty: "160px", rot: "30deg" },
  { clip: "polygon(100% 20%, 100% 80%, 80% 60%)", tx: "170px", ty: "60px", rot: "65deg" },
  { clip: "polygon(0% 80%, 5% 100%, 0% 100%)", tx: "-160px", ty: "140px", rot: "-70deg" },
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
      <div className="relative w-full" style={{ height: 340 }}>
        {/* Shatter overlay */}
        <GullakShatter active={!!breaking} w={360} h={360} />
        <div
          className={`flip-card cursor-pointer select-none ${breaking ? "opacity-0" : ""}`}
          style={{ width: "100%", height: 340, transition: breaking ? "opacity 0.1s 0.15s" : "none" }}
          onClick={() => { if (!breaking) setFlipped((f) => { onFlip?.(!f); return !f; }); }}
          title={flipped ? "Click to see gullak" : "Click for details"}
        >
          <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="flip-front">
              <Gullak pct={pct} coinAction={coinAction} />
            </div>

            {/* Back: balance summary */}
            <div className="flip-back rounded-3xl border border-slate-100 shadow-xl bg-white flex flex-col items-center justify-center gap-4 p-6 w-full" style={{ height: 340 }}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Balance</p>
              <div className="text-center">
                <p className="text-6xl font-extrabold text-slate-800 tabular-nums">{fillPct}%</p>
                <p className="text-xs text-slate-400 mt-1">of goal filled</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fillPct}%`, background: barColor }} />
              </div>
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-[#FDF8F0] rounded-2xl p-3 text-center">
                  <p className="text-xs font-bold uppercase text-[#D4AA72] mb-1">Saved</p>
                  <p className="text-sm font-extrabold text-[#A67840]">{fmt(savedAmount)}</p>
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
  const selectedYear = value ? parseInt(value.split("-")[0]) : -1;

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
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AA72] ${value ? "border-[#E2C48E] bg-[#FDF8F0] text-[#A67840] font-semibold" : "border-slate-200 bg-white text-slate-400"
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
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${active
                      ? "bg-[#C2955A] text-white shadow-sm"
                      : disabled
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-[#FDF8F0] hover:text-[#A67840]"
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

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex-shrink-0 focus:outline-none"
        aria-label="Account menu"
      >
        {user.user_metadata?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-[#C2955A] hover:opacity-80 transition-opacity object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FDF8F0] border-2 border-[#C2955A] flex items-center justify-center text-[#C2955A] text-xs font-bold hover:bg-[#FAF3E6] transition-colors">
            {(user.email?.[0] ?? "U").toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            {user.user_metadata?.full_name && (
              <p className="text-sm font-semibold text-slate-800 truncate">{user.user_metadata.full_name}</p>
            )}
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [signingIn, setSigningIn] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "", targetAmount: "", targetDate: "",
    monthlyContribution: "", initialSaved: "",
    divideEqually: true,
    monthlyPlan: {} as Record<string, string>,
  });
  const [coinAction, setCoinAction] = useState<"insert" | "remove" | null>(null);
  const [gullakFlipped, setGullakFlipped] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showBreakConfirm, setShowBreakConfirm] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const goal = selectedId ? (goals.find((g) => g.id === selectedId) ?? null) : null;
  const pct = goal ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;

  // ── Auth ──
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    setSigningIn(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function fetchGoals() {
    const res = await fetch("/api/goals");
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setGoals(data.goals ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else if (user === null) {
      setLoading(false);
    }
    setActivities([
      { id: "1", label: "Monthly Contribution", sub: "Automated Transfer", amount: 2500, icon: "transfer" },
      { id: "2", label: "Market Gains", sub: "Portfolio Performance", amount: 1142, icon: "chart" },
    ]);
  }, [user]);

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
    // Add to local state immediately so it's visible before fetchGoals resolves
    setGoals((prev) => [...prev, created]);
    setSelectedId(created.id);
    fetchGoals();
  }

  // ── Auth loading ──
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5EDD8" }}>
        <div className="w-8 h-8 rounded-full border-4 border-[#C2955A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Login screen ──
  if (user === null) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F5EDD8" }}>
        {/* Hero / sign-in card */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                  Gullak<span className="text-[#C2955A]">.Online</span>
                </h1>
                <p className="text-slate-700 text-base font-semibold mt-1">Free Personal Savings Tracker for India</p>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-xs">
                  Set savings goals in ₹, plan monthly contributions, and watch your digital piggy bank fill up — one rupee at a time.
                </p>
              </div>
            </div>

            {/* Gullak image */}
            <div className="relative w-48 h-48 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gullak.png" alt="Digital gullak piggy bank savings tracker" className="w-full h-full object-contain" style={{ mixBlendMode: "multiply" }} />
            </div>

            {/* Sign in */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={signInWithGoogle}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-60"
              >
                {signingIn ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#C2955A] border-t-transparent animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {signingIn ? "Redirecting…" : "Continue with Google"}
              </button>
              <p className="text-center text-xs text-slate-400">
                Free forever · No credit card · Your goals are private
              </p>
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <section className="px-6 pb-10 max-w-lg mx-auto w-full" aria-label="Features">
          <h2 className="text-lg font-extrabold text-slate-800 text-center mb-6">
            Your digital गुल्लक, reinvented
          </h2>
          <ul className="grid grid-cols-2 gap-4" role="list">
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">🎯</span>
              <h3 className="text-sm font-bold text-slate-800">Savings goal tracker</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create unlimited savings goals in ₹ — emergency fund, vacation, gadget, wedding, or anything you dream of.
              </p>
            </li>
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">📅</span>
              <h3 className="text-sm font-bold text-slate-800">Monthly savings planner</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Know exactly how much to save each month. Auto-calculates your monthly contribution so you hit your goal on time.
              </p>
            </li>
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">🐷</span>
              <h3 className="text-sm font-bold text-slate-800">Animated piggy bank</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watch your digital gullak fill up with every rupee you deposit. Visual progress you can feel.
              </p>
            </li>
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">📊</span>
              <h3 className="text-sm font-bold text-slate-800">Contribution history</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                See a month-by-month chart of deposits and withdrawals. Track your saving habits over time.
              </p>
            </li>
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">🔒</span>
              <h3 className="text-sm font-bold text-slate-800">Private & secure</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your savings data is only visible to you — secured with Google Sign-In and end-to-end private storage.
              </p>
            </li>
            <li className="bg-white/60 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-2xl" aria-hidden="true">✨</span>
              <h3 className="text-sm font-bold text-slate-800">Free forever</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No subscription, no ads, no hidden charges. Gullak.Online is 100% free — made with love for India.
              </p>
            </li>
          </ul>

          {/* Trust signals */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span aria-hidden="true" className="text-green-500">✓</span> Made for India</span>
            <span className="flex items-center gap-1"><span aria-hidden="true" className="text-green-500">✓</span> Works on mobile &amp; desktop</span>
            <span className="flex items-center gap-1"><span aria-hidden="true" className="text-green-500">✓</span> Installs as PWA</span>
            <span className="flex items-center gap-1"><span aria-hidden="true" className="text-green-500">✓</span> Free forever</span>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-6 pb-10 max-w-lg mx-auto w-full" aria-label="How it works">
          <h2 className="text-lg font-extrabold text-slate-800 text-center mb-6">
            How Gullak.Online works
          </h2>
          <ol className="flex flex-col gap-5" role="list">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C2955A] text-white text-sm font-bold flex items-center justify-center">1</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Create a savings goal</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Sign in with Google and tap <strong>Add Gullak</strong>. Give your goal a name (e.g. "Trip to Goa"), set a target amount in rupees, and pick a target date.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C2955A] text-white text-sm font-bold flex items-center justify-center">2</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Plan your monthly contributions</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Gullak divides your goal equally across months, or lets you set a custom amount for each month — so your savings plan fits your income.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C2955A] text-white text-sm font-bold flex items-center justify-center">3</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Deposit and watch your gullak fill</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Each time you save money, log a deposit. Your animated piggy bank fills up and your progress updates instantly — until your goal is complete.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 pb-10 max-w-lg mx-auto w-full" aria-label="Frequently asked questions">
          <h2 className="text-lg font-extrabold text-slate-800 text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "What is Gullak.Online?",
                a: "Gullak.Online is a free personal savings tracker made for India. You can create savings goals (called gullaks), set a target amount and date, plan monthly contributions, deposit money, and visualise progress with a beautiful animated piggy bank.",
              },
              {
                q: "Is Gullak.Online free to use?",
                a: "Yes, completely free. No subscriptions, no hidden fees, no premium tiers. Create and track unlimited savings goals at no cost, forever.",
              },
              {
                q: "What is a gullak (गुल्लक)?",
                a: "A gullak is the Hindi word for piggy bank — a container used to save coins. Gullak.Online digitises this concept: each savings goal is a digital gullak that fills up as you deposit money toward your target.",
              },
              {
                q: "Is my savings data private?",
                a: "Absolutely. Your goals and data are private and only visible to you. Gullak.Online uses Google Sign-In for secure authentication and stores your data with Supabase. Nobody else can see your savings.",
              },
              {
                q: "Can I track multiple savings goals?",
                a: "Yes! Create as many gullaks as you like — one for an emergency fund, one for a vacation, one for a new gadget. Each goal has its own piggy bank, progress tracker, and monthly contribution plan.",
              },
              {
                q: "Does Gullak.Online work on mobile?",
                a: "Yes. It is a fully responsive web app that works on mobile, tablet, and desktop. You can also install it as a Progressive Web App (PWA) on your phone for a native app-like experience.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white/60 rounded-2xl px-5 py-4 group">
                <summary className="text-sm font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between gap-2">
                  {q}
                  <span className="text-[#C2955A] text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 pb-10 pt-2 max-w-lg mx-auto w-full text-center" aria-label="Footer">
          <p className="text-xs text-slate-400 leading-relaxed">
            Gullak.Online — free personal savings tracker for India. Save money, set goals, and track rupee contributions with your digital गुल्लक (piggy bank). Built for Indians who want a simple, private, and beautiful way to manage their savings goals.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <a href="/blog" className="text-[#C2955A] hover:underline font-medium">Blog</a>
            <span className="text-slate-300">·</span>
            <a href="/blog/how-to-save-money-in-india" className="text-slate-400 hover:text-[#C2955A] transition-colors">How to save money in India</a>
            <span className="text-slate-300">·</span>
            <a href="/blog/what-is-a-gullak" className="text-slate-400 hover:text-[#C2955A] transition-colors">What is a gullak?</a>
          </div>
          <p className="text-xs text-slate-300 mt-3">
            © {new Date().getFullYear()} Gullak.Online · Free savings goal tracker · Made in India 🇮🇳
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 antialiased flex flex-col" style={{ background: "#F5EDD8" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-4 h-14 md:px-8 md:h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-xl font-bold tracking-tight">
              Gullak<span className="text-[#C2955A]">.Online</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#C2955A] text-white text-xs md:text-sm px-3 py-2 md:px-5 md:py-2.5 rounded-full font-semibold hover:bg-[#A67840] active:scale-95 transition-all shadow-sm"
            >
              <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Add Gullak
            </button>
            <UserMenu user={user} />
          </div>
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
                      className="bg-white rounded-3xl shadow-md border border-slate-100 flex flex-col items-center pt-5 pb-4 px-3 gap-2 active:scale-95 transition-all hover:shadow-lg hover:border-[#F3E6CC]"
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
                      <div className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${gpct >= 100 ? "bg-green-100 text-green-700" : gpct >= 50 ? "bg-[#FDF8F0] text-[#A67840]" : "bg-slate-100 text-slate-500"}`}>
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
              <div className="w-full flex items-center gap-4">
                <button
                  onClick={() => { setSelectedId(null); setGullakFlipped(false); }}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#C2955A] transition-colors font-semibold shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  All Gullaks
                </button>
                <div className="w-px h-6 bg-slate-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-extrabold text-slate-800 truncate">{goal.title}</h1>
                  <p className="text-xs text-[#C2955A] font-semibold">{fmt(goal.targetAmount)}</p>
                </div>
              </div>

              {/* Card */}
              <div ref={cardRef} className="bg-white w-full rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center px-4 pt-4 pb-4 gap-3 overflow-hidden">
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
                    scrollToRef={cardRef}
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
                className="bg-[#C2955A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#A67840] active:scale-95 transition-all"
              >
                + Add Gullak
              </button>
            </div>
          )}

          {loading && (
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-52 bg-slate-100 rounded-3xl animate-pulse" />)}
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
              You&apos;ve saved <span className="font-bold text-[#C2955A]">{fmt(goal.savedAmount)}</span> in <span className="font-bold">{goal.title}</span>.<br />
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
                <h2 className="text-lg font-bold text-slate-800">Add a Gullak</h2>
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AA72]"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AA72]"
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
                    className={`flex items-center gap-2.5 w-full border rounded-xl px-4 py-3 text-sm transition-all ${addForm.divideEqually
                        ? "border-[#D4AA72] bg-[#FDF8F0] text-[#A67840]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${addForm.divideEqually ? "border-[#C2955A] bg-[#C2955A]" : "border-slate-300"
                      }`}>
                      {addForm.divideEqually && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                      <span className="text-xs text-[#D4AA72]">over {addFormMonths.length} months</span>
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
                                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AA72] text-right"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AA72]"
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
                    className="flex-1 bg-[#C2955A] hover:bg-[#A67840] text-white rounded-xl py-3 text-sm font-semibold active:scale-95 transition-all disabled:opacity-60"
                  >
                    {saving ? "Creating…" : "Add Gullak"}
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
