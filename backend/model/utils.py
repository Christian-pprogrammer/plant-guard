import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
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

def predict_plant_and_disease(image_path):
    # Load model
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'disease_classifier_model.h5')
    disease_model = load_model(model_path)
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
    img = img.resize((224, 224))  # Ensure correct size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize

    # Predict disease
    disease_predictions = disease_model.predict(img_array)
    disease_class_idx = np.argmax(disease_predictions[0])

    print(f"Predicted class index: {disease_class_idx}", flush=True)
    disease_type = disease_class_names[disease_class_idx]
    disease_confidence = float(disease_predictions[0][disease_class_idx])

    result = {
        'disease': {
            'type': disease_type,
            'confidence': disease_confidence
        }
    }

    return result
