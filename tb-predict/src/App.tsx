import { useState } from "react";
import type { PatientPayload, ModelResult } from "./types";
import { EMPTY_PATIENT } from "./formConfig";
import { predict } from "./api";
import { verdictFor } from "./risk";
import Form from "./components/Form";
import ClinicalVerdict from "./components/ClinicalVerdict";

export default function App() {
  const [values, setValues] = useState<PatientPayload>({ ...EMPTY_PATIENT });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ModelResult | null>(null);

  const handleChange = (name: keyof PatientPayload, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setValues({ ...EMPTY_PATIENT });
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // idade_anos must travel as a number; everything else as its string code.
      const payload: PatientPayload = {
        ...values,
        idade_anos: Number(values.idade_anos) || 0,
      };
      const data = await predict(payload);
      setResult(data);
      // Bring the results into view on smaller screens.
      requestAnimationFrame(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mint-bg">
      {/* Header */}
      <header className="border-b border-mint-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-6 sm:px-8">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 12h4l3 8 4-16 3 8h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
              TB Predict
            </h1>
            <p className="text-sm text-slate-500">
              Apoio à decisão clínica para risco de abandono do tratamento de
              tuberculose. Não constitui diagnóstico.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-500">
          Preencha os dados do paciente e clique em{" "}
          <span className="font-semibold text-brand-dark">Analisar risco</span>{" "}
          para estimar a chance de abandono do tratamento e receber uma sugestão
          de conduta.
        </p>

        <Form
          values={values}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-8 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5"
          >
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <div>
              <p className="font-semibold text-rose-800">
                Não foi possível concluir a análise
              </p>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <section id="results" className="mt-10 scroll-mt-6 space-y-6">
            <ClinicalVerdict data={verdictFor(result)} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-mint-100 bg-white/60">
        <div className="mx-auto max-w-5xl px-5 py-6 text-center text-xs text-slate-400 sm:px-8">
          Ferramenta acadêmica de apoio à decisão. Não substitui avaliação
          clínica.
        </div>
      </footer>
    </div>
  );
}
