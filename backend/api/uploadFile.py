import os
from flask import request, jsonify
from werkzeug.utils import secure_filename

from model.utils import predict_plant_and_disease, fetch_disease_by_name

# Use an absolute path to ensure the correct location for the uploads folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')

# Create the uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def upload_image():
    """
    Handles the image file upload.
    - Checks if the file is part of the request.
    - Saves the file to the upload folder.
    - Returns a success message along with the filename.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        prediction = predict_plant_and_disease(filepath)

        disease_info = fetch_disease_by_name(prediction['disease']['type'])

        return jsonify({"message": "Prediction successful", "result": disease_info})
    
    return jsonify({"error": "Disease predition failed"}), 500