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

import type { ModelResult } from "./types";

export interface Verdict {
  probAbandono: number;
  theme: RiskTheme;
  recommendation: string;
}

// Recomendação clínica em linguagem comum, derivada da faixa de risco.
function recommendationFor(level: RiskLevel): string {
  if (level === "alto") {
    return "Risco elevado de abandono. Recomenda-se busca ativa e suporte psicossocial, com acompanhamento próximo.";
  }
  if (level === "moderado") {
    return "Risco intermediário. Recomenda-se monitoramento mais frequente e reforço da adesão ao tratamento.";
  }
  return "Risco baixo. Seguir o fluxo normal de acompanhamento do tratamento.";
}

/**
 * Monta o veredito clínico a partir da análise de risco.
 * O desfecho usa as faixas de risco (<40 baixo · 40–70 moderado · >70 alto).
 */
export function verdictFor(result: ModelResult): Verdict {
  const probAbandono = result.probability_abandono;
  const theme = riskFromProbability(probAbandono);

  return {
    probAbandono,
    theme,
    recommendation: recommendationFor(theme.level),
  };
}
