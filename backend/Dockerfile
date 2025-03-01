FROM python:3.12-slim AS builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --user -r requirements.txt

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