import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import json
import os
import requests
from io import BytesIO
from PIL import Image

def load_class_names():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    disease_class_names_path = os.path.join(current_dir, 'disease_class_names.json')
    with open(disease_class_names_path, 'r') as f:
        string_keyed_dict = json.load(f)
        return {int(k): v for k, v in string_keyed_dict.items()}

def download_and_convert_model():
    model_url = "https://plant-guard-bucket.s3.amazonaws.com/disease_classifier_model.h5"
    local_h5_path = "disease_classifier_model.h5"
    local_tflite_path = "disease_classifier_model.tflite"

    # If the TFLite model already exists, return its path
    if os.path.exists(local_tflite_path):
        print("Using existing TensorFlow Lite model.")
        return local_tflite_path

    # If the model doesn't exist, download it
    if not os.path.exists(local_h5_path):
        print("Downloading model from S3...")
        response = requests.get(model_url, stream=True)
        if response.status_code == 200:
            with open(local_h5_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print("Model downloaded successfully.")
        else:
            raise Exception(f"Failed to download model. Status Code: {response.status_code}")

    # Convert H5 model to TensorFlow Lite format
    print("Converting model to TensorFlow Lite format...")
    model = tf.keras.models.load_model(local_h5_path)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    # Save the TFLite model
    with open(local_tflite_path, "wb") as f:
        f.write(tflite_model)

    print("TensorFlow Lite model saved successfully.")
    return local_tflite_path

def predict_plant_and_disease(image_path):
    # Download and convert the model
    tflite_model_path = download_and_convert_model()
    
    # Load the TensorFlow Lite model
    interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
    interpreter.allocate_tensors()

    # Get input and output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Load class names
    disease_class_names = load_class_names()

    # Check if image_path is a URL
    if image_path.startswith("http"):
        response = requests.get(image_path)
        if response.status_code != 200:
            raise Exception(f"Failed to download image. Status Code: {response.status_code}")
        img = Image.open(BytesIO(response.content))
    else:
        img = image.load_img(image_path, target_size=(224, 224))

    # Preprocess image
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize

    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], img_array.astype(np.float32))

    # Run inference
    interpreter.invoke()

    # Get predictions
    disease_predictions = interpreter.get_tensor(output_details[0]['index'])[0]
    disease_class_idx = np.argmax(disease_predictions)

    print(f"Predicted class index: {disease_class_idx}", flush=True)
    disease_type = disease_class_names[disease_class_idx]
    disease_confidence = float(disease_predictions[disease_class_idx])

    result = {
        'disease': {
            'type': disease_type,
            'confidence': disease_confidence
        }
    }

    return result

def fetch_disease_by_name(disease_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    disease_data_path = os.path.join(current_dir, 'plant_diseases.json')
    with open(disease_data_path, 'r') as file:
        data = json.load(file)

    for disease in data['diseases']:
        if disease['name'].lower() == disease_name.lower():
            return disease
    return None
