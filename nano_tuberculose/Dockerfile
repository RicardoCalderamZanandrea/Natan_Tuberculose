FROM python:3.12-slim

WORKDIR /app

# System dependencies for scikit-learn / TensorFlow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py model_service.py ./

# Model files will be mounted or copied at build/deploy time.
# The service looks for:
#   baseline_pipeline_neural_v3.pkl  (or modelo_tuberculose_v2.pkl as fallback)
#   modelo_redeneural_tuberculose_v1.keras

EXPOSE 5000

# Run with gunicorn in production (installed below), or plain Flask in dev
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]
