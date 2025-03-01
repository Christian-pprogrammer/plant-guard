# Stage 1: Builder stage
FROM python:3.12-slim AS builder

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Final stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Install AWS CLI and curl
RUN apt-get update && \
    apt-get install -y awscli curl && \
    rm -rf /var/lib/apt/lists/*

# Create the models directory
RUN mkdir -p ./models

# Download the model file using curl (if the file is publicly accessible)
RUN curl -o ./models/disease_classifier_model.h5 https://plant-guard-bucket.s3.amazonaws.com/disease_classifier_model.h5

# Alternatively, use aws s3 cp (if the file is not publicly accessible)
# RUN aws s3 cp s3://plant-guard-bucket/disease_classifier_model.h5 ./models/disease_classifier_model.h5 --no-sign-request

# Copy application code
COPY . .

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
