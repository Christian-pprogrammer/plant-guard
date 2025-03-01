from model.db import db

class UploadHistory(db.Model):
    __tablename__ = 'upload_histories'

    id = db.Column(db.Integer, primary_key=True)
    disease_name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.Text, nullable=False)  # Changed from String(255) to Text
    user_id = db.Column(db.Integer, nullable=False)

    def __init__(self, disease_name, image_url, user_id):
        self.disease_name = disease_name
        self.image_url = image_url
        self.user_id = user_id
