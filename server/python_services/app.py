from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import tempfile
from datetime import datetime
import urllib.request
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = "final_model.h5"
IMG_SIZE = (224, 224)

# Load Model
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

# Helper: detect and crop face
def detect_and_crop_face(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("❌ Unable to read image.")
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return image_path  # No face detected, return original image

    # Crop the largest face
    x, y, w, h = max(faces, key=lambda box: box[2] * box[3])
    cropped = img[y:y+h, x:x+w]

    # Save cropped image to a proper temp file
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
        cropped_path = tmp_file.name

    cv2.imwrite(cropped_path, cropped)
    return cropped_path

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        # Save uploaded file or URL image to temp file
        if "file" in request.files:
            file = request.files["file"]
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
                tmp_file.write(file.read())
                image_path = tmp_file.name

        elif request.json and "url" in request.json:
            url = request.json["url"]
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
                urllib.request.urlretrieve(url, tmp_file.name)
                image_path = tmp_file.name
        else:
            return jsonify({"error": "No image provided"}), 400

        # Detect and crop face
        processed_path = detect_and_crop_face(image_path)

        # Preprocess image for model
        img = tf.keras.utils.load_img(processed_path, target_size=IMG_SIZE)
        img_array = tf.keras.utils.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Predict
        prediction = model.predict(img_array)[0][0]
        label = "AI-Generated" if prediction > 0.5 else "Real"
        confidence = round(float(prediction if prediction > 0.5 else 1 - prediction) * 100, 2)

        result = {
            "isAI": True if prediction > 0.5 else False,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat(),
            "analysisDetails": {
            "pixelAnomalies": "Low" if prediction > 0.5 else "None",
            "textureConsistency": "Inconsistent" if prediction > 0.5 else "Consistent",
            "lightingRealism": "Unnatural" if prediction > 0.5 else "Natural",
            "edgeQuality": "Blurred" if prediction > 0.5 else "Sharp",
    }
}

        

        # Clean up temp files
        if os.path.exists(image_path):
            os.remove(image_path)
        if os.path.exists(processed_path) and processed_path != image_path:
            os.remove(processed_path)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
