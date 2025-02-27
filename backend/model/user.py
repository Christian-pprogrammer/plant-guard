from model.db import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    mobile_number = db.Column(db.String(15), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __init__(self, first_name, last_name, email, mobile_number, location, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.mobile_number = mobile_number
        self.location = location
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """
        Verify if the password matches the hashed password in the database.
        """
        return bcrypt.check_password_hash(self.password, password)
