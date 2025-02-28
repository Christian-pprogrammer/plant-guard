from flask import Blueprint, request, jsonify
from model.db import db
from model.user import User
from werkzeug.exceptions import BadRequest
import jwt as pyjwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

auth = Blueprint('auth', __name__)

# Secret key for JWT
SECRET_KEY = os.getenv("SECRET_KEY")


@auth.route('/register', methods=['POST'])
def register_user():
    """
    User registration endpoint.
    """
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'email', 'mobileNumber', 'location', 'password', 'confirmPassword']
    
    # Check if all required fields are provided
    missing_fields = [field for field in required_fields if field not in data or not data[field].strip()]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        first_name = data['firstName'].strip()
        last_name = data['lastName'].strip()
        email = data['email'].strip()
        mobile_number = data['mobileNumber'].strip()
        location = data['location'].strip()
        password = data['password'].strip()
        confirm_password = data['confirmPassword'].strip()
        
        # Check if the passwords match
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Check if user already exists
        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            return jsonify({"error": f"User with this email {email} already exists"}), 400

        # Create new user
        new_user = User(first_name, last_name, email, mobile_number, location, password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": f"User with this email {email} registered successfully"}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except BadRequest:
        return jsonify({"error": "Bad request"}), 400


@auth.route('/login', methods=['POST'])
def login_user():
    """
    User login endpoint.
    """
    data = request.get_json()
    
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        # Generate JWT token
        token_payload = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
        }
        token = pyjwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 400
    