import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io
from flask_cors import CORS
import os
import requests # Necessary library to download files over HTTP

# --- Configuration ---
MODEL_PATH = 'dog_emotion_model.keras'
IMG_HEIGHT = 160
IMG_WIDTH = 160
CLASS_NAMES = ['angry', 'happy', 'neutral', 'sad']
# Read the model download URL from the Render Environment Variables
MODEL_URL = os.environ.get('MODEL_URL') 

app = Flask(__name__)
CORS(app)

loaded_model = None

# --- MODEL LOADING AND DOWNLOAD LOGIC ---

# 1. Check if the model file is already present on the server's disk
if MODEL_URL and not os.path.exists(MODEL_PATH):
    print("⬇️ MODEL_URL found. Attempting to download model...")
    try:
        # Use a temporary path to avoid corrupted files if the download is interrupted
        temp_model_path = MODEL_PATH + '.tmp'
        
        # Send a streaming GET request to download the large file
        response = requests.get(MODEL_URL, stream=True)
        response.raise_for_status() # Check for HTTP errors (like 404 or 403 Forbidden)

        # Write the content chunk by chunk
        with open(temp_model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        # If download is complete, rename the temporary file to the final name
        os.rename(temp_model_path, MODEL_PATH)
        print("✅ Model downloaded successfully.")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error during model download: {e}")
        print("    -> Check your MODEL_URL link and Google Drive sharing permissions.")
        
if os.path.exists(MODEL_PATH):
    print("🔥 Loading model from disk...")
    # 2. Load the model using TensorFlow/Keras
    try:
        # The model loading MUST happen only after the download is complete
        loaded_model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
else:
    # This happens if MODEL_URL was missing OR the download failed
    print("❌ Model file not found locally or failed to download. Service cannot run.")

# --- Prediction Endpoint ---

@app.route('/predict', methods=['POST'])
def predict():
    if loaded_model is None:
        # Return 500 if the model failed to load during startup
        return jsonify({"error": "Model not loaded. Server is unavailable for predictions."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        # 1. Image Preprocessing
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension

        # 2. Prediction
        predictions = loaded_model.predict(img_array, verbose=0)

        # 3. Process Results
        pred_index = int(np.argmax(predictions[0]))
        pred_label = CLASS_NAMES[pred_index]
        confidence = float(predictions[0][pred_index] * 100)

        probs = {
            CLASS_NAMES[i]: float(predictions[0][i] * 100)
            for i in range(len(CLASS_NAMES))
        }

        # 4. Return JSON Response
        return jsonify({
            "predicted_emotion": pred_label,
            "confidence": confidence,
            "full_probabilities": probs
        })

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": f"Prediction failed due to internal error: {str(e)}"}), 500


if __name__ == "__main__":
    # Standard Flask run, mainly for local testing. Render uses Gunicorn.
    print("🚀 Server running on http://127.0.0.1:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)