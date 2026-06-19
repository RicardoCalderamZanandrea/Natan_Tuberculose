# TB Predict

Web app de página única (frontend) para **apoio à decisão clínica**: predição de
risco de **abandono** do tratamento de tuberculose. Coleta os dados do paciente,
envia para a API de Machine Learning e compara dois modelos — **Regressão
Logística** e **Rede Neural**.

> Ferramenta acadêmica de apoio à decisão. Não substitui avaliação clínica.

## Stack

- React + Vite + TypeScript
- TailwindCSS (v4, via `@tailwindcss/vite`)
- `fetch` nativo para a chamada de API

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

A aplicação chama `POST http://localhost:5001/predict` por padrão. A porta 5001
é usada porque, no macOS, a porta 5000 é ocupada pelo **AirPlay Receiver**.
Para apontar para outra URL, crie um `.env`:

```bash
VITE_API_URL=http://localhost:5001/predict
```

Suba a API antes de analisar (o backend Flask está em `../nano_tuberculose`).
Via Docker (recomendado — expõe a API em `5001`):

```bash
cd ../nano_tuberculose
docker compose up --build
```

## Estrutura

```
src/
  api.ts            # cliente fetch do endpoint /predict (+ tratamento de erro)
  types.ts          # tipos do payload e da resposta
  formConfig.ts     # seções, campos e mapeamento rótulo → código string
  risk.ts           # faixas de risco (<40 baixo · 40–70 moderado · >70 alto)
  components/
    Form.tsx        # formulário em seções com <select> mapeando para os códigos
    ResultCard.tsx  # card por modelo (badge, gauge, recomendação)
    GaugeBar.tsx    # barra horizontal abandono vs cura
  App.tsx           # layout, estado, loading/erro e resumo comparativo
```

## Contrato da API

Todos os campos são enviados como **string**, exceto `idade_anos` (número).
Os valores enviados são exatamente os códigos definidos em `src/formConfig.ts`.
