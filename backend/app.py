from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from model.db import init_db, db
from flask_migrate import Migrate
from api.auth import auth
from api.uploadFile import upload_image, get_upload_history
from api.displayFile import display_image
import os

# Import all models here so Alembic can detect them
from model.user import User
from model.uploadHistory import UploadHistory
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

jwt = JWTManager(app)

# Initialize database
init_db(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

@app.route('/')
def welcome():
    return jsonify({"message": "Welcome to the Flask API!"})

# Register auth blueprint for authentication routes
app.register_blueprint(auth, url_prefix='/auth')

@app.route('/upload', methods=['POST'])
def upload():
    return upload_image()

@app.route('/searchHistory', methods=['GET'])
def upload_history():
    return get_upload_history()

@app.route('/display/<filename>', methods=['GET'])
def display(filename):
    return display_image(filename)

# Swagger UI configuration
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.yaml"

swagger_ui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={"app_name": "Flask API"})
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
