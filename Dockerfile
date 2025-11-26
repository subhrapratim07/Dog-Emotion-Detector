# 1. Base Image: Start from a clean, lightweight Python environment.
FROM python:3.10-slim

# 2. Port Configuration: Set the default port for the application server (Hugging Face standard is 8080).
ENV PORT 8080

# 3. Working Directory: Set the internal container directory where the app will live.
WORKDIR /app

# 4. Copy Files: Copy the entire 'backend' folder, including app.py and the large Keras model, 
# from your host repository into the container's working directory.
COPY backend /app/backend

# 5. Install Dependencies: Run pip to install all packages listed in backend/requirements.txt.
# We are assuming 'requests' has been removed from this file, as discussed.
RUN pip install --no-cache-dir -r backend/requirements.txt

# 6. Expose Port: Inform the container that the application will listen on this port.
EXPOSE 8080

# 7. Startup Command: Define the entry point, using Gunicorn to run your app.
# It binds Gunicorn to all interfaces on port 8080 and loads the 'app' object
# from the 'backend.app' module.