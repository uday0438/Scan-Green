import google.generativeai as genai
KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)
# Try some different types of models
models = [
    "models/gemini-1.0-pro",
    "models/gemini-pro",
    "models/gemini-pro-vision"
]
for m in models:
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("hi")
        print(f"WINNER: {m}")
        break
    except Exception as e:
        print(f"FAIL: {m} - {e}")
