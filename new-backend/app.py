from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chat.db"  # Using SQLite
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Define Message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(50), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables
with app.app_context():
    db.create_all()

# Route to get all messages
@app.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.order_by(Message.timestamp).all()
    return jsonify([{"sender": msg.sender, "text": msg.text, "timestamp": msg.timestamp} for msg in messages])

# Route to add a new message
@app.route("/messages", methods=["POST"])
def add_message():
    data = request.json
    new_msg = Message(sender=data["sender"], text=data["text"])
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"message": "Message added!"}), 201

if __name__ == "__main__":
    app.run(debug=True)
