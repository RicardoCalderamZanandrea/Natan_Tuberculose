// Payload sent to the prediction API.
// Every field is a string code EXCEPT idade_anos, which is a number.
// Empty string ("") means "Não informado" — the model treats it as an unknown
// category (the encoders use handle_unknown, so it is safe to send).
export interface PatientPayload {
  idade_anos: number | "";
  CS_SEXO: string;
  CS_GESTANT: string;
  CS_RACA: string;
  CS_ESCOL_N: string;
  SG_UF: string;
  TRATAMENTO: string;
  POP_LIBER: string;
  POP_RUA: string;
  POP_SAUDE: string;
  POP_IMIG: string;
  FORMA: string;
  AGRAVALCOO: string;
  AGRAVDIABE: string;
  AGRAVDOENC: string;
  AGRAVOUTRA: string;
  HIV: string;
  SG_UF_2: string;
  TRATSUP_AT: string;
  TRANSF: string;
}

// Resposta da API (rota /predict/neural): uma única análise de risco.
export interface ModelResult {
  model: string;
  prediction: number;
  prediction_label: string;
  probability_abandono: number;
  recommendation: string;
}
