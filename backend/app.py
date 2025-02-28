from flask import Flask, jsonify
from model.db import init_db, db
from flask_migrate import Migrate
from api.auth import auth

app = Flask(__name__)

# Initialize database with the app
init_db(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

@app.route('/')
def welcome():
    return jsonify({"message": "Welcome to the Flask API!"})

# Register auth blueprint for login and registration routes
app.register_blueprint(auth, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
