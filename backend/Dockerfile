FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install base requirements
COPY requirements-base.txt .
RUN pip install --no-cache-dir --user -r requirements-base.txt && \
    rm -rf /root/.cache/pip

# Install ML requirements
COPY requirements-ml.txt .
RUN pip install --no-cache-dir --user -r requirements-ml.txt && \
    rm -rf /root/.cache/pip

# Install API requirements
COPY requirements-apis.txt .
RUN pip install --no-cache-dir --user -r requirements-apis.txt && \
    rm -rf /root/.cache/pip

# Install torch in separate layers
COPY requirements-torch.txt .
RUN pip install --no-cache-dir --user -r requirements-torch.txt && \
    rm -rf /root/.cache/pip

COPY requirements-torch-audio-vision.txt .
RUN pip install --no-cache-dir --user -r requirements-torch-audio-vision.txt && \
    rm -rf /root/.cache/pip

COPY requirements-transformers.txt .
RUN pip install --no-cache-dir --user -r requirements-transformers.txt && \
    rm -rf /root/.cache/pip

COPY requirements-torch-extras.txt .
RUN pip install --no-cache-dir --user -r requirements-torch-extras.txt && \
    rm -rf /root/.cache/pip

# Install UI requirements
COPY requirements-ui.txt .
RUN pip install --no-cache-dir --user -r requirements-ui.txt && \
    rm -rf /root/.cache/pip

# Second stage - copy only what's needed
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Install AWS CLI
RUN apt-get update && apt-get install -y awscli && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Download model
RUN aws s3 cp s3://plant-guard-bucket/disease_classifier_model.h5 ./models/disease_classifier_model.h5

EXPOSE 5000

CMD ["python", "app.py"]