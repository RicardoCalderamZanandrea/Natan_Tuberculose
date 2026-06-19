export type RiskLevel = "baixo" | "moderado" | "alto";

export interface RiskTheme {
  level: RiskLevel;
  label: string;
  // Tailwind utility fragments tuned to the green-forward palette.
  barFrom: string;
  barTo: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
}

// Faixas: <40% baixo (verde) · 40–70% moderado (âmbar) · >70% alto (vermelho suave)
export function riskFromProbability(probAbandono: number): RiskTheme {
  if (probAbandono > 70) {
    return {
      level: "alto",
      label: "Risco alto",
      barFrom: "from-rose-400",
      barTo: "to-red-500",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
      ring: "ring-rose-200",
    };
  }
  if (probAbandono >= 40) {
    return {
      level: "moderado",
      label: "Risco moderado",
      barFrom: "from-amber-300",
      barTo: "to-amber-500",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      ring: "ring-amber-200",
    };
  }
  return {
    level: "baixo",
    label: "Risco baixo",
    barFrom: "from-brand-light",
    barTo: "to-brand-dark",
    badgeBg: "bg-mint-50",
    badgeText: "text-brand-dark",
    ring: "ring-mint-100",
  };
}
