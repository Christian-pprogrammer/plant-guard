import os
import cloudinary
import cloudinary.uploader
from flask import request, jsonify
from werkzeug.utils import secure_filename
from model.utils import predict_plant_and_disease
from model.db import db
from model.uploadHistory import UploadHistory
from flask_jwt_extended import get_jwt_identity, jwt_required

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET')
)


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
        prediction = predict_plant_and_disease(image_url)
        disease_name = prediction['disease']['type']

        # Check if the user is logged in (JWT token exists)
        user_id = get_jwt_identity() if get_jwt_identity() else None

        # Save upload history only for logged-in users
        if user_id:
            new_upload = UploadHistory(disease_name=disease_name, image_url=image_url, user_id=user_id)
            db.session.add(new_upload)
            db.session.commit()

        # append image url to prediction result
        prediction['image_url'] = image_url

        return jsonify({"message": "Prediction successful", "result": prediction})

    return jsonify({"error": "Disease prediction failed"}), 500


def get_upload_history():
    """
    Fetch upload history with disease_name and image_url for the authenticated user.
    """
    user_id = get_jwt_identity()
    uploads = UploadHistory.query.filter_by(user_id=user_id).with_entities(UploadHistory.disease_name,
                                                                           UploadHistory.image_url).all()

    # loop in uploads
    for u in uploads:
        print(u.disease_name, u.image_url)

    history = [{"disease_name": u.disease_name, "image_url": u.image_url} for u in uploads]
    return jsonify(history)
