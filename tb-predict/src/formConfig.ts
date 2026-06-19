import type { PatientPayload } from "./types";

export interface Option {
  value: string;
  label: string;
}

export interface Field {
  name: keyof PatientPayload;
  label: string;
  type: "number" | "select";
  options?: Option[];
  min?: number;
  max?: number;
}

export interface Section {
  title: string;
  description?: string;
  fields: Field[];
}

// Reused option sets ------------------------------------------------------
const SIM_NAO_IGNORADO: Option[] = [
  { value: "1", label: "Sim" },
  { value: "2", label: "Não" },
  { value: "9", label: "Ignorado" },
];

// UF — código IBGE
export const UF_OPTIONS: Option[] = [
  { value: "11", label: "RO — Rondônia" },
  { value: "12", label: "AC — Acre" },
  { value: "13", label: "AM — Amazonas" },
  { value: "14", label: "RR — Roraima" },
  { value: "15", label: "PA — Pará" },
  { value: "16", label: "AP — Amapá" },
  { value: "17", label: "TO — Tocantins" },
  { value: "21", label: "MA — Maranhão" },
  { value: "22", label: "PI — Piauí" },
  { value: "23", label: "CE — Ceará" },
  { value: "24", label: "RN — Rio Grande do Norte" },
  { value: "25", label: "PB — Paraíba" },
  { value: "26", label: "PE — Pernambuco" },
  { value: "27", label: "AL — Alagoas" },
  { value: "28", label: "SE — Sergipe" },
  { value: "29", label: "BA — Bahia" },
  { value: "31", label: "MG — Minas Gerais" },
  { value: "32", label: "ES — Espírito Santo" },
  { value: "33", label: "RJ — Rio de Janeiro" },
  { value: "35", label: "SP — São Paulo" },
  { value: "41", label: "PR — Paraná" },
  { value: "42", label: "SC — Santa Catarina" },
  { value: "43", label: "RS — Rio Grande do Sul" },
  { value: "50", label: "MS — Mato Grosso do Sul" },
  { value: "51", label: "MT — Mato Grosso" },
  { value: "52", label: "GO — Goiás" },
  { value: "53", label: "DF — Distrito Federal" },
];

export const SECTIONS: Section[] = [
  {
    title: "Dados demográficos",
    fields: [
      { name: "idade_anos", label: "Idade (anos)", type: "number", min: 0, max: 120 },
      {
        name: "CS_SEXO",
        label: "Sexo",
        type: "select",
        options: [
          { value: "M", label: "Masculino" },
          { value: "F", label: "Feminino" },
        ],
      },
      {
        name: "CS_GESTANT",
        label: "Gestante",
        type: "select",
        options: [
          { value: "1", label: "1º trimestre" },
          { value: "2", label: "2º trimestre" },
          { value: "3", label: "3º trimestre" },
          { value: "4", label: "Idade gestacional ignorada" },
          { value: "5", label: "Não" },
          { value: "6", label: "Não se aplica" },
          { value: "9", label: "Ignorado" },
        ],
      },
      {
        name: "CS_RACA",
        label: "Raça / Cor",
        type: "select",
        options: [
          { value: "1", label: "Branca" },
          { value: "2", label: "Preta" },
          { value: "3", label: "Amarela" },
          { value: "4", label: "Parda" },
          { value: "5", label: "Indígena" },
          { value: "9", label: "Ignorado" },
        ],
      },
      {
        name: "CS_ESCOL_N",
        label: "Escolaridade",
        type: "select",
        options: [
          { value: "0", label: "Analfabeto" },
          { value: "1", label: "1ª a 4ª série incompleta" },
          { value: "2", label: "4ª série completa" },
          { value: "3", label: "5ª a 8ª série incompleta" },
          { value: "4", label: "Fundamental completo" },
          { value: "5", label: "Médio incompleto" },
          { value: "6", label: "Médio completo" },
          { value: "7", label: "Superior incompleto" },
          { value: "8", label: "Superior completo" },
          { value: "9", label: "Ignorado" },
          { value: "10", label: "Não se aplica" },
        ],
      },
    ],
  },
  {
    title: "Localização",
    description: "Unidade federativa (código IBGE).",
    fields: [
      { name: "SG_UF", label: "UF de notificação", type: "select", options: UF_OPTIONS },
      { name: "SG_UF_2", label: "UF de residência", type: "select", options: UF_OPTIONS },
    ],
  },
  {
    title: "Características clínicas",
    fields: [
      {
        name: "TRATAMENTO",
        label: "Tipo de entrada",
        type: "select",
        options: [
          { value: "1", label: "Caso novo" },
          { value: "2", label: "Recidiva" },
          { value: "3", label: "Reingresso após abandono" },
          { value: "4", label: "Não sabe" },
          { value: "5", label: "Transferência" },
          { value: "6", label: "Pós-óbito" },
        ],
      },
      {
        name: "FORMA",
        label: "Forma clínica",
        type: "select",
        options: [
          { value: "1", label: "Pulmonar" },
          { value: "2", label: "Extrapulmonar" },
          { value: "3", label: "Pulmonar + Extrapulmonar" },
        ],
      },
      {
        name: "HIV",
        label: "Resultado HIV",
        type: "select",
        options: [
          { value: "1", label: "Positivo" },
          { value: "2", label: "Negativo" },
          { value: "3", label: "Em andamento" },
          { value: "4", label: "Não realizado" },
        ],
      },
    ],
  },
  {
    title: "Populações especiais",
    description: "1 = Sim · 2 = Não · 9 = Ignorado",
    fields: [
      { name: "POP_LIBER", label: "Privada de liberdade", type: "select", options: SIM_NAO_IGNORADO },
      { name: "POP_RUA", label: "Situação de rua", type: "select", options: SIM_NAO_IGNORADO },
      { name: "POP_SAUDE", label: "Profissional de saúde", type: "select", options: SIM_NAO_IGNORADO },
      { name: "POP_IMIG", label: "Imigrante", type: "select", options: SIM_NAO_IGNORADO },
    ],
  },
  {
    title: "Agravos e comorbidades",
    description: "1 = Sim · 2 = Não · 9 = Ignorado",
    fields: [
      { name: "AGRAVALCOO", label: "Alcoolismo", type: "select", options: SIM_NAO_IGNORADO },
      { name: "AGRAVDIABE", label: "Diabetes", type: "select", options: SIM_NAO_IGNORADO },
      { name: "AGRAVDOENC", label: "Doença mental", type: "select", options: SIM_NAO_IGNORADO },
      { name: "AGRAVOUTRA", label: "Outro agravo", type: "select", options: SIM_NAO_IGNORADO },
    ],
  },
  {
    title: "Acompanhamento",
    fields: [
      {
        name: "TRATSUP_AT",
        label: "Tratamento Diretamente Observado (TDO)",
        type: "select",
        options: [
          { value: "1", label: "Sim" },
          { value: "2", label: "Não" },
        ],
      },
      {
        name: "TRANSF",
        label: "Caso de transferência",
        type: "select",
        options: [
          { value: "1", label: "Sim" },
          { value: "2", label: "Não" },
        ],
      },
    ],
  },
];

// Sensible starting values (mirror the example payload from the API contract).
export const DEFAULT_PATIENT: PatientPayload = {
  idade_anos: 35,
  CS_SEXO: "M",
  CS_GESTANT: "6",
  CS_RACA: "1",
  CS_ESCOL_N: "3",
  SG_UF: "35",
  TRATAMENTO: "1",
  POP_LIBER: "2",
  POP_RUA: "2",
  POP_SAUDE: "2",
  POP_IMIG: "2",
  FORMA: "1",
  AGRAVALCOO: "2",
  AGRAVDIABE: "2",
  AGRAVDOENC: "2",
  AGRAVOUTRA: "2",
  HIV: "2",
  SG_UF_2: "35",
  TRATSUP_AT: "1",
  TRANSF: "2",
};
