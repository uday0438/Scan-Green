import os
import json
import re
import base64
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io

app = FastAPI(title="ScanGreen API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API Key
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw")
genai.configure(api_key=API_KEY)

# --- MODELS ---
class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str

# --- HELPER FUNCTIONS ---
def clean_json_string(text: str) -> str:
    clean = text.strip()
    if clean.startswith("```json"):
        clean = clean.replace("```json", "", 1).replace("```", "", 1)
    elif clean.startswith("```"):
        clean = clean.replace("```", "", 1).replace("```", "", 1)
    return clean.strip()

def extract_json(text: str):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        clean_text = clean_json_string(text)
        return json.loads(clean_text)
    except Exception as e:
        print(f"JSON extraction failed: {e}")
        return None

async def get_gemini_response(prompt: str, image: Optional[Image.Image] = None):
    models_to_try = [
        "models/gemini-2.0-flash",
        "models/gemini-1.5-flash",
        "models/gemini-pro"
    ]
    
    last_error = "Unknown error"
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            if image:
                response = model.generate_content([prompt, image])
            else:
                response = model.generate_content(prompt)
            
            if response and response.text:
                return response.text
        except Exception as e:
            last_error = str(e)
            print(f"DEBUG: {model_name} failed: {last_error[:50]}")
            
    raise Exception(f"API Error: {last_error[:30]}")

# --- ENDPOINTS ---

@app.get("/health")
async def health():
    return {"status": "online", "message": "ScanGreen API is running locally via Vercel Serverless"}

@app.post("/analyze-product")
async def analyze_product(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    prompt = """
    You are ScanGreen AI. Analyze this product image for environmental impact.
    Return ONLY a JSON object with these keys: 
    eco_score (0-100), verdict, reasoning, concerns (array), and technical_details (array of {label, value}).
    """
    
    try:
        response_text = await get_gemini_response(prompt, image)
        data = extract_json(response_text)
        if not data: raise Exception("Parsing failed")
        return data
    except Exception as e:
        return {"error": str(e), "fallback": True}

@app.post("/analyze-room")
async def analyze_room(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    prompt = """
    You are an Environmental Audit AI. Analyze this specific room image.
    Return ONLY a JSON object with keys: 
    plastic_load, ghost_carbon, ocean_impact, decomposition_time, decomposition_item, toxin_risk, and detected_items.
    """
    
    try:
        response_text = await get_gemini_response(prompt, image)
        data = extract_json(response_text)
        return data if data else {"error": "Parsing failed"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat")
async def chat(request: ChatRequest):
    history_str = "\n".join([f"{m.role}: {m.text}" for m in request.history])
    prompt = f"System: You are Greeny, a sustainability expert.\nHistory:\n{history_str}\nUser: {request.message}\nAnswer:"
    
    try:
        response_text = await get_gemini_response(prompt)
        return {"text": response_text}
    except Exception as e:
        return {"text": "I'm offline for green maintenance. Try again soon! 🌱"}

@app.get("/news")
async def get_news():
    prompt = "Return 3 trending sustainability news articles as a JSON array."
    try:
        response_text = await get_gemini_response(prompt)
        return extract_json(response_text)
    except Exception:
        return []
