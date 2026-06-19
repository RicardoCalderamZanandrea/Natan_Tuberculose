"""
Flask API – Tuberculosis Treatment Abandonment Prediction
=========================================================

Endpoints
---------
POST /predict              Both models (Logistic + Neural Network)
POST /predict/logistic     Logistic Regression only
POST /predict/neural       Keras Neural Network only
GET  /health               Health check + model status

Predictor fields (all required, all may be sent as strings):
    idade_anos, CS_SEXO, CS_GESTANT, CS_RACA, CS_ESCOL_N,
    SG_UF, TRATAMENTO, POP_LIBER, POP_RUA, POP_SAUDE, POP_IMIG,
    FORMA, AGRAVALCOO, AGRAVDIABE, AGRAVDOENC, AGRAVOUTRA,
    HIV, SG_UF_2, TRATSUP_AT, TRANSF
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from model_service import (
    PREDICTOR_COLUMNS,
    cast_to_str,
    predict_both,
    predict_logistic,
    predict_neural,
    validate_predictors,
)

app = Flask(__name__)
# Libera chamadas do frontend (Vite em http://localhost:5173) para as rotas da API.
CORS(app, resources={r"/*": {"origins": "*"}})


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _extract_payload():
    """Extract and normalise the JSON payload.

    Returns (data, error_msg): either data is a dict and error is None,
    or data is None and error is a string.
    """
    if not request.is_json:
        return None, "Content-Type must be application/json"

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return None, "JSON body must be an object (key-value pairs)"

    return data, None


def _validate_and_respond(data):
    """Validate the predictor payload.

    Returns a (flask_response, status_code) tuple on failure,
    or None when the payload is valid.
    """
    missing = validate_predictors(data)
    if missing:
        return (
            jsonify(
                {
                    "error": "Campos obrigatórios ausentes.",
                    "missing_fields": missing,
                    "expected_fields": PREDICTOR_COLUMNS,
                }
            ),
            400,
        )
    return None, None  # signals success


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    """Return API health and model-load status."""
    status = {"status": "ok", "models": {}}

    # Logistic regression
    try:
        from model_service import load_logistic_pipeline

        load_logistic_pipeline()
        status["models"]["logistic_regression"] = "loaded"
    except FileNotFoundError as exc:
        status["models"]["logistic_regression"] = f"missing: {exc}"
    except Exception as exc:
        status["models"]["logistic_regression"] = f"error: {exc}"

    # Neural network
    try:
        from model_service import load_neural_model

        load_neural_model()
        status["models"]["neural_network"] = "loaded"
    except FileNotFoundError as exc:
        status["models"]["neural_network"] = f"missing: {exc}"
    except Exception as exc:
        status["models"]["neural_network"] = f"error: {exc}"

    return jsonify(status)


@app.route("/predict", methods=["POST"])
def predict():
    """Run both models and return combined predictions."""
    data, err = _extract_payload()
    if err:
        return jsonify({"error": err}), 400

    resp, status = _validate_and_respond(data)
    if resp:
        return resp, status

    try:
        result = predict_both(data)
        # Add a risk recommendation
        for key, pred in result.items():
            prob = pred["probability_abandono"]
            if prob > 70:
                pred["recommendation"] = (
                    "Alerta de alto risco! Iniciar busca ativa ou suporte psicossocial."
                )
            elif prob > 40:
                pred["recommendation"] = (
                    "Risco moderado. Monitoramento mais frequente recomendado."
                )
            else:
                pred["recommendation"] = "Risco baixo. Seguir fluxo normal."
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/predict/logistic", methods=["POST"])
def predict_logistic_endpoint():
    """Logistic regression prediction only."""
    data, err = _extract_payload()
    if err:
        return jsonify({"error": err}), 400

    resp, status = _validate_and_respond(data)
    if resp:
        return resp, status

    try:
        result = predict_logistic(data)
        prob = result["probability_abandono"]
        if prob > 70:
            result["recommendation"] = (
                "Alerta de alto risco! Iniciar busca ativa ou suporte psicossocial."
            )
        elif prob > 40:
            result["recommendation"] = (
                "Risco moderado. Monitoramento mais frequente recomendado."
            )
        else:
            result["recommendation"] = "Risco baixo. Seguir fluxo normal."
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/predict/neural", methods=["POST"])
def predict_neural_endpoint():
    """Neural network prediction only."""
    data, err = _extract_payload()
    if err:
        return jsonify({"error": err}), 400

    resp, status = _validate_and_respond(data)
    if resp:
        return resp, status

    try:
        result = predict_neural(data)
        prob = result["probability_abandono"]
        if prob > 70:
            result["recommendation"] = (
                "Alerta de alto risco! Iniciar busca ativa ou suporte psicossocial."
            )
        elif prob > 40:
            result["recommendation"] = (
                "Risco moderado. Monitoramento mais frequente recomendado."
            )
        else:
            result["recommendation"] = "Risco baixo. Seguir fluxo normal."
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import os

    # Porta 5001 por padrão (a 5000 do host é usada pelo AirPlay Receiver no
    # macOS). Pode ser sobrescrita com a variável de ambiente PORT.
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
