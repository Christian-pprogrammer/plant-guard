from flask import Blueprint, request, jsonify
from model.db import db
from model.user import User
from flask_bcrypt import Bcrypt
import jwt as pyjwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Secret key for JWT
SECRET_KEY = os.getenv("SECRET_KEY")

@auth.route('/login_or_register', methods=['POST'])
def login_or_register():
    """
    User login or register endpoint.
    """
    data = request.get_json()
    
    mobile_number = data.get('mobileNumber', '').strip()
    password = data.get('password', '').strip()

    if not mobile_number or not password:
        return jsonify({"error": "Mobile number and password are required"}), 400

    # Check if user exists
    user = User.query.filter_by(mobile_number=mobile_number).first()

    if user:
        # Validate password
        if not user.check_password(password):
            return jsonify({"error": "Invalid mobile number or password"}), 400
    else:
        # Register new user (password will be hashed in User model)
        # hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(mobile_number=mobile_number, password=password)
        db.session.add(new_user)
        db.session.commit()
        user = new_user

    # Generate JWT token
    token_payload = {
        "user_id": user.id,
        "mobile_number": user.mobile_number,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1) 
    }
    token = pyjwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

    return jsonify({"message": "Login successful", "token": token}), 200
