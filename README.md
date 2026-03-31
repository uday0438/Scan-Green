<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rPxdujvAEzaR3ZPkaqx7leXsu6s2WK8-

## Run Locally

**Prerequisites:** Node.js, Python 3.9+

### 1. Set up Backend (Python)
Navigate to the root directory and run:

```powershell
# Create a virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the backend
python backend/main.py
```
The backend will run on `http://localhost:8000`.

### 2. Set up Frontend (React)
Open a new terminal and run:

```powershell
# Install dependencies
npm install

# Set the GEMINI_API_KEY in .env.local (used by backend)
# GEMINI_API_KEY=your_key_here

# Run the app
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Integration Details
The frontend calls the FastAPI backend located in `/backend`. The backend handles:
- Gemini AI requests (using the API key from environment variables)
- Image processing and analysis logic
- Sustainability news aggregation
- AI Chatbot responses
