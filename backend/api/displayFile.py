from flask import send_file, jsonify
import os

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')

def display_image(filename):
    """
    Handles the logic for displaying an image.
    - Verifies if the requested file exists in the upload folder.
    - Returns the image if it exists, otherwise returns an error.
    """
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        return send_file(filepath, mimetype='image/jpeg')
    else:
        return jsonify({"error": "File not found"}), 404
