# 🐶 PetVibe AI: Dog Emotion Detection Web App

**PetVibe AI** is a real-time web application designed to help dog owners and enthusiasts understand their pet's emotional state. By leveraging a high-performance deep learning model, the app classifies canine emotions—such as **Happy, Angry, Sad, or Neutral**—from uploaded images.

## 🚀 Project Overview
This single-page application (SPA) offers an intuitive interface where users can upload an image for immediate analysis. The frontend communicates with a containerized TensorFlow/Keras deep learning model to provide instant results.

### ✨ Key Features
* **Real-time Interaction:** Instant emotion classification.
* **Modern UI:** Clean, dark-mode responsive interface built with React.
* **AI Integration:** Seamless connection to a **256MB TensorFlow/Keras CNN** model.
* **Confidence Scoring:** Displays the AI's certainty for each prediction.

## 📸 Demo
![PetVibe AI Dashboard](image_c46fd1.jpg)
*The PetVibe AI interface featuring the "Understand Your Dog Better" dashboard.*

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Library** | React.js |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS / Custom CSS |
| **API Client** | Axios / Fetch API |
| **Model Backend** | Python, Flask, Docker, Hugging Face Spaces |

---

## ⚙️ Setup and Installation

Follow these steps to get your local development environment running.

### 1. Prerequisites
* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js)

### 2. Clone the Repository
```bash
git clone [https://github.com/subhrapratim/petvibe-ai-frontend.git](https://github.com/subhrapratim/petvibe-ai-frontend.git)
cd petvibe-ai-frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
The application needs to know where your Dockerized AI model is running. Create a `.env` file in the root directory and add your backend API endpoint:
```env
VITE_API_URL="https://Subhrapratim07/Dog-Emotion-API-Docker.hf.space"
```

### 5. Run the Application
Start the development server locally:
```bash
npm run dev
```
The application should now be running locally, typically at [http://localhost:5173](http://localhost:5173).

---

## 📡 API Interaction Logic
The core functionality of this frontend is the API call made when a user submits an image. The application handles the file upload by:

1. **Capturing** the image file from the input field.
2. **Creating** a `FormData` object.
3. **Appending** the file to the `FormData` object with the key `file`.
4. **Sending** a `POST` request to the backend `/predict` endpoint.

| Detail | Value |
| :--- | :--- |
| **Method** | POST |
| **Endpoint** | `${VITE_API_URL}/predict` |
| **Body Type** | multipart/form-data |
| **File Key** | `file` |

The backend responds with a JSON object containing the predicted emotion and confidence score, which is then rendered dynamically in the UI.

---

## 📝 Future Scope
* **Live Camera Feed:** Support for real-time webcam captures and processing.
* **History Tracking:** Implement user authentication and save a history of previous predictions.
* **Educational Resources:** Create a dedicated "Understanding Dog Emotions" resource page for users.
