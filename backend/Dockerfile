FROM python:3.12-slim

WORKDIR /app

# Copy split requirements files
COPY requirements-base.txt requirements-ml.txt requirements-torch.txt requirements-apis.txt requirements-ui.txt ./

# Install each requirement file separately to avoid "no space left on device" error
RUN pip install --no-cache-dir -r requirements-base.txt && \
    rm -rf /root/.cache/pip

RUN pip install --no-cache-dir -r requirements-ml.txt && \
    rm -rf /root/.cache/pip

RUN pip install --no-cache-dir -r requirements-apis.txt && \
    rm -rf /root/.cache/pip

RUN pip install --no-cache-dir -r requirements-torch.txt && \
    rm -rf /root/.cache/pip

RUN pip install --no-cache-dir -r requirements-ui.txt && \
    rm -rf /root/.cache/pip

# Copy application code
COPY . .

# Install AWS CLI and download model
RUN apt-get update && apt-get install -y awscli

RUN aws s3 cp s3://plant-guard-bucket/disease_classifier_model.h5 ./models/disease_classifier_model.h5

EXPOSE 5000

CMD ["python", "app.py"]