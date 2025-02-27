from flask import Flask, jsonify
from model.db import init_db
from api.auth import auth

app = Flask(__name__)

# Initialize database with the app
init_db(app)

# Register auth blueprint for login and registration routes
app.register_blueprint(auth)

@app.route('/')
def welcome():
    return jsonify({"message": "Welcome to the Flask API!"})

if __name__ == '__main__':
    app.run(debug=True)
