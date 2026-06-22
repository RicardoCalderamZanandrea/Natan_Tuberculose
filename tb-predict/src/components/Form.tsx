import type { PatientPayload } from "../types";
import { SECTIONS, type Field } from "../formConfig";

interface FormProps {
  values: PatientPayload;
  loading: boolean;
  onChange: (name: keyof PatientPayload, value: string | number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const inputClasses =
  "w-full rounded-xl border border-mint-100 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm transition outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60";

function FieldControl({
  field,
  value,
  loading,
  onChange,
}: {
  field: Field;
  value: string | number;
  loading: boolean;
  onChange: FormProps["onChange"];
}) {
  if (field.type === "number") {
    return (
      <input
        id={field.name}
        type="number"
        min={field.min}
        max={field.max}
        value={value}
        disabled={loading}
        onChange={(e) =>
          onChange(field.name, e.target.value === "" ? "" : Number(e.target.value))
        }
        className={inputClasses}
      />
    );
  }

  return (
    <select
      id={field.name}
      value={String(value)}
      disabled={loading}
      onChange={(e) => onChange(field.name, e.target.value)}
      className={`${inputClasses} cursor-pointer pr-9`}
    >
      {field.options!.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function Form({
  values,
  loading,
  onChange,
  onSubmit,
  onReset,
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {SECTIONS.map((section) => (
        <fieldset
          key={section.title}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-mint-100 sm:p-7"
        >
          <legend className="px-1 text-base font-bold text-brand-dark">
            {section.title}
          </legend>
          {section.description && (
            <p className="mb-4 text-sm text-slate-400">{section.description}</p>
          )}

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-600"
                >
                  {field.label}
                </label>
                <FieldControl
                  field={field}
                  value={values[field.name]}
                  loading={loading}
                  onChange={onChange}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="rounded-xl px-5 py-3 text-sm font-semibold text-brand-dark transition hover:bg-mint-50 disabled:opacity-60"
        >
          Limpar formulário
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
                />
              </svg>
              Analisando…
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
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
              Analisar risco
            </>
          )}
        </button>
      </div>
    </form>
  );
}
