import type { ModelResult } from "../types";
import { riskFromProbability } from "../risk";
import GaugeBar from "./GaugeBar";

interface ResultCardProps {
  title: string;
  subtitle: string;
  result: ModelResult;
}

export default function ResultCard({ title, subtitle, result }: ResultCardProps) {
  const theme = riskFromProbability(result.probability_abandono);
  const isAbandono = result.prediction_label.toLowerCase() === "abandono";

  const badgeClasses = isAbandono
    ? "bg-rose-100 text-rose-700"
    : "bg-mint-50 text-brand-dark";

  return (
    <article
      className={`flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ${theme.ring} sm:p-7`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${badgeClasses}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${isAbandono ? "bg-rose-500" : "bg-brand"}`}
            aria-hidden
          />
          {result.prediction_label}
        </span>
      </header>

      <div className="mt-6">
        <GaugeBar
          probAbandono={result.probability_abandono}
          probCura={result.probability_cura}
          theme={theme}
        />
      </div>

      <div className="mt-5">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${theme.badgeBg} ${theme.badgeText}`}
        >
          {theme.label}
        </span>
      </div>

      <div
        className={`mt-4 flex items-start gap-3 rounded-xl p-4 ${theme.badgeBg}`}
      >
        <svg
          className={`mt-0.5 h-5 w-5 flex-shrink-0 ${theme.badgeText}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
        </svg>
        <p className={`text-sm font-medium leading-relaxed ${theme.badgeText}`}>
          {result.recommendation}
        </p>
      </div>
    </article>
  );
}
