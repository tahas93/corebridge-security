'use client';

import {
  ChipIcon,
  RadarIcon,
  ShieldIcon,
} from "@/components/icons/CyberIcons";
import { useContent } from "@/lib/content-client";

export default function DashboardIllustration() {
  const content = useContent() as Record<string, any>;
  const dash = content.home.dashboard as {
    windowTitle: string;
    cards: { label: string; value: string; sub?: string }[];
    chart: { heading: string; period: string; bars: number[] };
    feed: { text: string; level: string; time: string }[];
    feedLevels: Record<string, string>;
    floatingCard: { eyebrow: string; value: string; detail: string };
  };
  const cardIcons = [
    <RadarIcon key="radar" className="h-4 w-4" />,
    <ChipIcon key="chip" className="h-4 w-4" />,
    <ShieldIcon key="shield" className="h-4 w-4" />,
  ];
  const cardAccents = [
    "from-rose-500 to-amber-400",
    "from-brand-blue to-brand-cyan",
    "from-brand-purple to-brand-cyan",
  ];

  return (
    <div className="gradient-border-soft relative overflow-hidden rounded-3xl p-1 shadow-glow">
      <div className="relative rounded-[1.4rem] bg-surface-100/90 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 font-mono text-[11px] text-slate-600">
              {dash.windowTitle}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {content.common.status.live}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {dash.cards.map((card: { label: string; value: string; sub?: string }, i: number) => (
            <DashCard
              key={card.label}
              label={card.label}
              value={card.value}
              sub={card.sub ?? ""}
              accent={cardAccents[i]}
              icon={cardIcons[i]}
            />
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-ink-900/10 bg-ink-900/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              {dash.chart.heading}
            </p>
            <span className="font-mono text-[11px] text-slate-500">
              {dash.chart.period}
            </span>
          </div>
          <svg
            viewBox="0 0 320 110"
            className="mt-3 h-28 w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0079B5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0079B5" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0096D6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0096D6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="stroke1" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#004B87" />
                <stop offset="50%" stopColor="#0079B5" />
                <stop offset="100%" stopColor="#0096D6" />
              </linearGradient>
            </defs>
            <g stroke="rgba(0,31,63,0.08)">
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  x2="320"
                  y1={20 + i * 22}
                  y2={20 + i * 22}
                />
              ))}
            </g>
            <path
              d="M0,80 C30,60 50,70 70,55 C95,38 120,72 150,50 C180,30 210,68 240,45 C270,28 300,58 320,40 L320,110 L0,110 Z"
              fill="url(#g1)"
            />
            <path
              d="M0,90 C40,75 60,84 90,72 C120,60 140,86 170,72 C200,58 230,80 260,68 C285,58 310,76 320,68 L320,110 L0,110 Z"
              fill="url(#g2)"
            />
            <path
              d="M0,80 C30,60 50,70 70,55 C95,38 120,72 150,50 C180,30 210,68 240,45 C270,28 300,58 320,40"
              fill="none"
              stroke="url(#stroke1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="240" cy="45" r="3" fill="#0096D6" />
            <circle cx="240" cy="45" r="6" fill="none" stroke="#0096D6" strokeOpacity="0.6">
              <animate
                attributeName="r"
                values="6;12;6"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.6;0;0.6"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <div className="mt-4 space-y-2">
          {dash.feed.map((row: { text: string; level: string; time: string }) => (
            <FeedRow
              key={row.text}
              level={row.level as "critical" | "warning" | "info"}
              time={row.time}
              text={row.text}
              levelLabel={dash.feedLevels[row.level as keyof typeof dash.feedLevels]}
            />
          ))}
        </div>
      </div>

      <div className="absolute -right-6 -top-6 hidden w-56 rotate-3 sm:block">
        <div className="glass-strong animate-float rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
              <ShieldIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                {dash.floatingCard.eyebrow}
              </p>
              <p className="text-sm font-semibold text-ink-900">
                {dash.floatingCard.value}
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.03] p-3">
      <div
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white`}
      >
        {icon}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}

function FeedRow({
  level,
  time,
  text,
  levelLabel,
}: {
  level: "critical" | "warning" | "info";
  time: string;
  text: string;
  levelLabel: string;
}) {
  const colors = {
    critical: "bg-rose-500/15 text-rose-700 border-rose-500/30",
    warning: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    info: "bg-brand-cyan/15 text-brand-blue border-brand-cyan/40",
  } as const;
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-ink-900/[0.02] px-3 py-2 text-xs">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[level]}`}
        >
          {levelLabel}
        </span>
        <span className="truncate text-slate-700">{text}</span>
      </div>
      <span className="ml-3 shrink-0 font-mono text-[10px] text-slate-500">
        {time}
      </span>
    </div>
  );
}
