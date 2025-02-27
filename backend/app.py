from flask import Flask, jsonify
from api.uploadFile import upload_image  
from api.displayFile import display_image  

app = Flask(__name__)

@app.route('/')
def welcome():
    """
    A simple welcome route to check the API status.
    """
    return jsonify({"message": "Welcome to the Flask API!"})

@app.route('/upload', methods=['POST'])
def upload():
    """
    Route to upload an image by calling the upload_image function from upload.py.
    """
    return upload_image()

@app.route('/display/<filename>', methods=['GET'])
def display(filename):
    """
    Route to display an image by calling the display_image function from display.py.
    """
    return display_image(filename)

if __name__ == '__main__':
    app.run(debug=True)
