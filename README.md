title: Dog Emotion API (Docker Backend)
emoji: 🐶
colorFrom: red
colorTo: purple
sdk: docker
app_port: 8080
---

# 🐶 Dog Emotion Classification API

This API is designed to classify dog emotions (e.g., Happy, Angry, Sad, Neutral) using a large TensorFlow/Keras model (approx. 256 MB).

The deployment uses the **Docker SDK on Hugging Face Spaces** to guarantee sufficient **RAM (16 GB Free Tier)**, which is necessary for loading the large TensorFlow runtime and avoiding the memory crashes encountered on other platforms.

### ⚙️ Deployment Details

Your container is built using the `Dockerfile` in the root, copying the following files into the container's working directory (`/app`):

| File | Location | Purpose |
| :--- | :--- | :--- |
| **`Dockerfile`** | Root | Builds the environment and starts the Gunicorn server. |
| **`backend/app.py`** | Subdirectory | Contains the Flask prediction logic. |
| **`backend/requirements.txt`** | Subdirectory | Lists dependencies. |
| **`backend/dog_emotion_model.keras`** | Subdirectory | The 256 MB model file. |

### 🔗 Connecting to the API Endpoint

To use the service, your frontend must send an image file via a POST request to your Space's URL:

| Field | Value |
| :--- | :--- |
| **Method** | `POST` |
| **Endpoint** | `[Your Space URL]/predict` |
| **Data** | `multipart/form-data` with the file key **`file`** |
