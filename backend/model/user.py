from model.db import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    mobile_number = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __init__(self, mobile_number, password):
        self.mobile_number = mobile_number
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')  # Ensure hashing

    def check_password(self, password):
        """
        Verify if the password matches the hashed password in the database.
        """
        return bcrypt.check_password_hash(self.password, password)
