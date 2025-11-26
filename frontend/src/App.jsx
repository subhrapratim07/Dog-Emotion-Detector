import React, { useState } from 'react';

const App = () => {
    // State for the selected file, prediction result, and loading status
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Flask backend URL (must match the port used in app.py - 5000)
    const API_URL = 'https://dog-emotion-detector-api.onrender.com/predict'; 

    // Handle file selection and preview generation
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file.");
                setSelectedFile(null);
                setPreviewUrl(null);
                setPrediction(null);
                return;
            }
            
            setSelectedFile(file);
            // Create a local URL for image display
            setPreviewUrl(URL.createObjectURL(file)); 
            setPrediction(null);
            setError(null);
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    // Send image to Flask backend for prediction
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError("Please select an image before predicting.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPrediction(null);
        
        // Package file into FormData for upload
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Exponential backoff mechanism for API calls
            const MAX_RETRIES = 3;
            let delay = 1000;
            let response = null;

            for (let i = 0; i < MAX_RETRIES; i++) {
                try {
                    response = await fetch(API_URL, {
                        method: 'POST',
                        body: formData,
                    });
                    if (response.status !== 429) { // 429 is Too Many Requests (rate limiting)
                        break; 
                    }
                } catch (e) {
                    // Log network errors, but allow retry
                    // console.error(`Retry ${i+1}: Network Error - ${e.message}`);
                }

                if (i < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Double the delay
                }
            }

            if (!response || !response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { error: `Server error: ${response ? response.status : 'Network/Connection Failed'} ${response ? response.statusText : ''}` };
                }
                throw new Error(errorData.error || `Server responded with status: ${response ? response.status : 'Connection Error'}`);
            }

            const data = await response.json();
            setPrediction(data);
            
        } catch (err) {
            // console.error("Prediction failed:", err);
            setError(`Connection Error: ${err.message}. Ensure your Python Flask server is running at ${API_URL}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. Outer Container: Ensures full height (min-h-screen) and uses FLEX to center the content both vertically (justify-center) and horizontally (items-center).
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 font-sans">
            
            {/* 2. Main Content Wrapper: Constrains width (max-w-2xl) and removed external vertical margins (mt/mb) for clean centering. */}
            <div className="w-full max-w-2xl bg-gray-800 shadow-2xl shadow-red-900/50 rounded-2xl p-8 sm:p-12">
                
                {/* Content Block */}
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-red-500 mb-4 text-center tracking-tight">
                        🐶 Dog Emotion Detector
                    </h1>
                    <p className="text-center text-gray-400 mb-8 mx-auto">
                        Upload an image of a dog to classify its emotion using a model from your local backend.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            id="file-upload" 
                            className="hidden" 
                        />
                        {/* Custom Styled Label for File Input */}
                        <label htmlFor="file-upload" className={`
                            cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 
                            rounded-xl shadow-lg transition duration-300 w-full text-center text-lg
                            ${selectedFile ? 'bg-green-600 hover:bg-green-700 shadow-green-500/50' : 'shadow-red-500/50'}
                        `}>
                            {selectedFile ? `✅ File Selected: ${selectedFile.name}` : 'Click to Select Dog Image'}
                        </label>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={!selectedFile || isLoading}
                            className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 
                                        rounded-xl shadow-xl transition duration-300 w-full text-lg 
                                        disabled:opacity-50 disabled:cursor-not-allowed 
                                        transform hover:scale-[1.01] active:scale-95 shadow-red-500/50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    {/* Simple Loading Spinner (Tailwind utility classes) */}
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Predicting...
                                </div>
                            ) : 'Get Emotion'}
                        </button>
                    </form>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="mt-10 p-4 bg-gray-900/50 shadow-inner rounded-xl border border-gray-700 flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-4 text-gray-300">Image to Classify:</h2>
                            <img 
                                src={previewUrl} 
                                alt="Preview of uploaded dog" 
                                className="rounded-lg shadow-xl w-64 h-64 object-cover border-4 border-gray-700"
                                width="256" 
                                height="256" 
                            />
                        </div>
                    )}

                    {/* Results/Error Display */}
                    { (error || prediction) && (
                        <div className="w-full mt-8 p-6 bg-gray-800 shadow-2xl rounded-xl border-t-4 border-red-500">
                            {/* Error Message */}
                            {error && (
                                <div className="text-red-400 bg-red-900/30 p-4 rounded-lg font-medium border border-red-500">
                                    <p className="font-bold mb-1">🚨 Connection/Model Error:</p> 
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Prediction Results */}
                            {prediction && (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-200 mb-4">✨ Predicted Emotion:</h2>
                                    <div className="bg-red-900/20 p-4 rounded-lg mb-4 border border-red-700">
                                        <p className="text-4xl font-extrabold text-red-400 text-center">
                                            {prediction.predicted_emotion.toUpperCase()}
                                        </p>
                                        <p className="text-center text-gray-400 mt-2">
                                            Confidence: <span className="font-bold text-red-400">{prediction.confidence}%</span>
                                        </p>
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Full Probabilities:</h3>
                                    <ul className="space-y-2">
                                        {Object.entries(prediction.full_probabilities).map(([emotion, probability]) => (
                                            <li key={emotion} className="flex justify-between items-center p-2 bg-gray-700 rounded-md">
                                                <span className="font-medium text-gray-200">
                                                    {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:
                                                </span>
                                                <span className="font-mono text-sm text-gray-50">
                                                    {probability.toFixed(2)}%
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;