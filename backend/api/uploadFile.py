import os
import cloudinary
import cloudinary.uploader
from flask import request, jsonify
from werkzeug.utils import secure_filename
from model.utils import predict_plant_and_disease, fetch_disease_by_name
from model.db import db
from model.uploadHistory import UploadHistory
from flask_jwt_extended import get_jwt_identity, jwt_required

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET')
)


@jwt_required()
def upload_image():
    """
    Handles the image file upload to Cloudinary and stores upload history if the user is logged in.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        filename = secure_filename(file.filename)

        # Upload file to Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        image_url = upload_result.get("secure_url")

        # Predict disease
        prediction = None
        try:
            prediction = predict_plant_and_disease(image_url)
            print(prediction)
        except Exception as e:
            return jsonify({"message": "Disease prediction failed", "result": {
                "disease": None,
                "plant": None,
                "image_url": image_url,
                "isHealthy": False,
                "isPlant": False,
                "name": None,
                "plant": None,
                "prevention_measures": [],
                "treatment": []
            }}), 200

        if (prediction['disease']['confidence'] < 0.7):
            return jsonify({"message": "Disease prediction failed", "result": {
                "disease": None,
                "plant": None,
                "image_url": image_url,
                "isHealthy": False,
                "isPlant": False,
                "name": None,
                "plant": None,
                "prevention_measures": [],
                "treatment": []
            }}), 200

        disease_name = prediction['disease']['type']

        result = fetch_disease_by_name(disease_name)

        # Get user_id from JWT token
        user_id = get_jwt_identity()

        # Save upload history
        new_upload = UploadHistory(disease_name=disease_name, image_url=image_url, user_id=user_id)
        db.session.add(new_upload)
        db.session.commit()

        result['image_url'] = image_url

        return jsonify({"message": "Prediction successful", "result": result})

    return jsonify({"error": "Disease prediction failed"}), 500


@jwt_required()  # Ensures the user is authenticated for this endpoint
def get_upload_history():
    """
    Fetch upload history with disease_name and image_url for the authenticated user.
    """
    # Fetch the user ID from the JWT token (ensured to be valid by @jwt_required())
    user_id = get_jwt_identity()

    # Query the database for uploads by the authenticated user
    uploads = UploadHistory.query.filter_by(user_id=user_id).with_entities(UploadHistory.disease_name,
                                                                           UploadHistory.image_url).all()

    # Process the uploads
    results = []
    for u in uploads:
        result = fetch_disease_by_name(u.disease_name)
        result['image_url'] = u.image_url
        results.append(result)

    return jsonify(results)
