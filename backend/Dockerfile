FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y awscli

RUN aws s3 cp s3://plant-guard-bucket/disease_classifier_model.h5 ./models/disease_classifier_model.h5

EXPOSE 5000

CMD ["python", "app.py"]

