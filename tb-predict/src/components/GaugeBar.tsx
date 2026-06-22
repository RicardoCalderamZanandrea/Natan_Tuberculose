import type { RiskTheme } from "../risk";

interface GaugeBarProps {
  probAbandono: number;
  theme: RiskTheme;
}

/**
 * Horizontal gauge showing the probability of treatment abandonment.
 * The filled portion is the abandonment risk, coloured by risk band.
 */
export default function GaugeBar({ probAbandono, theme }: GaugeBarProps) {
  const width = Math.max(0, Math.min(100, probAbandono));

  return (
    <div>
      <div className="mb-2 flex items-end justify-between text-sm">
        <span className="font-semibold text-rose-600">
          Risco de abandono{" "}
          <span className="tabular-nums">{probAbandono.toFixed(1)}%</span>
        </span>
      </div>

      <div
        className="h-4 w-full overflow-hidden rounded-full bg-mint-50"
        role="meter"
        aria-valuenow={Math.round(probAbandono)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Probabilidade de abandono"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.barFrom} ${theme.barTo} transition-[width] duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
