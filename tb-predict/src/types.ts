// Payload sent to POST /predict.
// Every field is a string code EXCEPT idade_anos, which is a number.
export interface PatientPayload {
  idade_anos: number;
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

export interface ModelResult {
  model: string;
  prediction: number;
  prediction_label: string;
  probability_abandono: number;
  probability_cura: number;
  recommendation: string;
}

export interface PredictResponse {
  logistic_regression: ModelResult;
  neural_network: ModelResult;
}
