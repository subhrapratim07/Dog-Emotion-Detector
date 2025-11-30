🐶 PetVibe AI: Dog Emotion Detection Web App (Frontend)

🚀 Project Overview

PetVibe AI is a real-time web application designed to help dog owners and enthusiasts understand their pet's emotional state by classifying their feelings (Happy, Angry, Sad, Neutral) from an image or video input.

This single-page application (SPA), built with React, provides an intuitive interface for users to upload an image or capture a live frame, which is then sent to a high-performance, containerized TensorFlow/Keras deep learning model for immediate emotion prediction.

✨ Features

Real-time Interaction: Users can easily upload images for instant emotion classification.

Intuitive UI: A clean, responsive interface built with React and modern styling (e.g., Tailwind CSS or custom CSS).

High-Fidelity AI Integration: Seamless communication with the powerful, 256MB TensorFlow/Keras model hosted on a dedicated API backend.

Prediction Display: Clear presentation of the predicted emotion and confidence scores.

🛠️ Technology Stack

This project is built using modern web development technologies to ensure a fast and responsive user experience while interacting with the machine learning backend.

Frontend

Technology

Role

React (JavaScript/JSX)

Core library for building the user interface and managing component state.

Vite / Next.js

(Placeholder: Depending on your setup) Module bundler and build tool.

Axios / Fetch API

Handling asynchronous HTTP POST requests to the AI prediction API.

Backend API (Reference)

The frontend communicates exclusively with the dedicated Dog Emotion API, which is:

Deployed using the Docker SDK on Hugging Face Spaces.

Runs a large, custom-trained TensorFlow/Keras CNN (approx. 256 MB).

Uses a Python/Flask server to expose the /predict endpoint.

⚙️ Setup and Installation

Follow these steps to get a copy of the project up and running on your local machine.

Prerequisites

Node.js (LTS version)

npm or yarn

1. Clone the repository

git clone [https://github.com/your-username/petvibe-ai-frontend.git](https://github.com/your-username/petvibe-ai-frontend.git)
cd petvibe-ai-frontend


2. Install dependencies

npm install
# or
yarn install


3. Configure API Endpoint

The application needs to know where your Dockerized AI model is running.

Create a .env file in the root directory and add your API URL:

# Example: Replace with your actual Hugging Face Space URL or local endpoint
VITE_API_URL="https://Subhrapratim07/Dog-Emotion-API-Docker.hf.space" 


4. Run the application

npm run dev
# or
yarn dev


The application should now be running locally, typically at http://localhost:5173.

📡 API Interaction Logic

The core functionality of this frontend is the API call made when a user submits an image.

The application handles the file upload by:

Capturing the image file from the input field.

Creating a FormData object.

Appending the file to the FormData object with the key file.

Sending a POST request to the backend /predict endpoint:

Detail

Value

Method

POST

Endpoint

${VITE_API_URL}/predict

Body Type

multipart/form-data

File Key

file

The backend responds with a JSON object containing the predicted emotion and confidence score, which is then rendered dynamically in the UI.

📝 Future Scope

Add support for live camera input via the user's webcam.

Implement user authentication and save a history of previous predictions.

Create a dedicated "Understanding Dog Emotions" resource page.
