import type { PatientPayload, PredictResponse } from "./types";

// Porta 5001 por padrão (a 5000 é usada pelo AirPlay Receiver no macOS).
// Pode ser sobrescrita com VITE_API_URL no arquivo .env.
const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5001/predict";

/**
 * Sends the patient payload to the prediction API.
 * Values go on the wire exactly as the codes the form holds:
 * idade_anos as a number, every other field as a string code.
 */
export async function predict(
  payload: PatientPayload,
): Promise<PredictResponse> {
  let response: Response;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network / CORS / server-down: fetch rejects before we get a response.
    throw new Error(
      "Não foi possível conectar à API de predição. Verifique se o serviço está ativo em http://localhost:5001.",
    );
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body?.error ?? "";
    } catch {
      /* response had no JSON body */
    }
    throw new Error(
      detail || `A API respondeu com erro ${response.status}. Tente novamente.`,
    );
  }

  return (await response.json()) as PredictResponse;
}
