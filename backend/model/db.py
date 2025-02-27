from flask_sqlalchemy import SQLAlchemy
import os

# Initialize the database connection
db = SQLAlchemy()

def init_db(app):
    """
    Initialize the database connection with the Flask app.
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)