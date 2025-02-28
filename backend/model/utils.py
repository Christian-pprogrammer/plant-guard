import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

import json

import os


def load_class_names():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    disease_class_names_path = os.path.join(current_dir, 'disease_class_names.json')
    with open(disease_class_names_path, 'r') as f:
        string_keyed_dict = json.load(f)
        # Convert string keys to integers
        return {int(k): v for k, v in string_keyed_dict.items()}


def predict_plant_and_disease(image_path):
    # Load model

    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'disease_classifier_model.h5')

    disease_model = load_model(model_path)

    disease_class_names = load_class_names()

    # Load and preprocess the image
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize

    # Predict disease
    disease_predictions = disease_model.predict(img_array)
    disease_class_idx = np.argmax(disease_predictions[0])

    print(f"Predicted class index: {disease_class_idx}", flush=True)
    # print(f"Predicted class name: {disease_class_names[disease_class_idx]}")

    disease_type = disease_class_names[disease_class_idx]
    disease_confidence = float(disease_predictions[0][disease_class_idx])

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
