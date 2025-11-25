import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io
from flask_cors import CORS

MODEL_PATH = 'dog_emotion_model.keras'
IMG_HEIGHT = 160
IMG_WIDTH = 160
CLASS_NAMES = ['angry', 'happy', 'neutral', 'sad']

app = Flask(__name__)
CORS(app)

print("🔥 Loading model...")
try:
    loaded_model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Error loading model:", e)
    loaded_model = None


@app.route('/predict', methods=['POST'])
def predict():
    if loaded_model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = loaded_model.predict(img_array, verbose=0)

        print("🧪 Raw Model Output:", predictions)

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
        print("❌ Prediction error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Server running on http://127.0.0.1:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
