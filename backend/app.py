import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io
from flask_cors import CORS
import os
# The 'requests' library is no longer needed in this file

# --- Configuration ---
# MODEL_PATH is now relative to the root/backend folder
MODEL_PATH = 'backend/dog_emotion_model.keras' 
IMG_HEIGHT = 160
IMG_WIDTH = 160
CLASS_NAMES = ['angry', 'happy', 'neutral', 'sad']

app = Flask(__name__)
CORS(app)

loaded_model = None

# --- MODEL LOADING LOGIC ---

# This logic assumes the file was downloaded by the Pre-Deploy command.
if os.path.exists(MODEL_PATH):
    print("🔥 Loading model from disk...")
    try:
        # Load the model only if the file exists
        loaded_model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
else:
    # If the model is not found, print a message and leave loaded_model as None.
    print(f"❌ Model file not found at {MODEL_PATH}. Check Pre-Deploy logs.") 

# --- Prediction Endpoint ---

@app.route('/predict', methods=['POST'])
def predict():
    if loaded_model is None:
        return jsonify({"error": "Model not loaded. Server is unavailable."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0) 

        predictions = loaded_model.predict(img_array, verbose=0)
        
        pred_index = int(np.argmax(predictions[0]))
        pred_label = CLASS_NAMES[pred_index]
        confidence = float(predictions[0][pred_index] * 100)

        probs = {
            CLASS_NAMES[i]: float(predictions[0][i] * 100)
            for i in range(len(CLASS_NAMES))
        }

        return jsonify({
            "predicted_emotion": pred_label,
            "confidence": confidence,
            "full_probabilities": probs
        })

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": f"Prediction failed due to internal error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)