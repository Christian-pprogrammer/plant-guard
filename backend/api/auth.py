from flask import Blueprint, request, jsonify
from model.db import db
from model.user import User
from werkzeug.exceptions import BadRequest

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register_user():
    """
    User registration endpoint.
    """
    data = request.get_json()
    
    try:
        first_name = data['firstName']
        last_name = data['lastName']
        email = data['email']
        mobile_number = data['mobileNumber']
        location = data['location']
        password = data['password']
        confirm_password = data['confirmPassword']
        
        # Check if the passwords match
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Check if user already exists
        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            return jsonify({"error": "User already exists"}), 400

        # Create new user
        new_user = User(first_name, last_name, email, mobile_number, location, password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

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
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 400
