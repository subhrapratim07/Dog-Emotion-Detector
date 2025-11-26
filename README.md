🐶 Dog Emotion Detector

🌟 Project Overview (Short)

This app classifies a dog's emotion from an uploaded image. It uses a React frontend (Tailwind CSS) to send the image to a local Python/Flask backend where the machine learning model runs. Both the frontend and backend must be running.

🛠️ Technology Stack

Frontend: React, Tailwind CSS

Backend: Python, Flask, ML Libraries

API Endpoint: http://localhost:5000/predict

🚀 Getting Started

You must run the Python backend and the React frontend simultaneously.

1. Backend Setup (Required)

Install: Install Python dependencies (e.g., Flask, Pillow, and your specific ML libraries).

pip install Flask Pillow numpy 
# Add your specific ML model dependencies (e.g., tensorflow, scikit-learn)


Run Server: Start the Flask server on port 5000.

python app.py


2. Frontend Setup (React - using npm)

Dependencies: Install node modules.

npm install


Run Frontend: Start the React development server.

npm run dev


📝 Usage (Short)

Open: Go to the local app URL (e.g., http://localhost:5173).

Upload: Click to select a dog image file.

Predict: Click "Get Emotion."

View: The predicted emotion and confidence from the backend will display on the screen.