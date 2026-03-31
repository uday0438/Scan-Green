import google.generativeai as genai

KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)

models_to_test = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash",
    "models/gemini-3-flash-preview",
    "models/gemini-1.5-flash",
]

for model_name in models_to_test:
    print(f"Testing {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'success'")
        print(f"  SUCCESS: {response.text.strip()}")
        break # Stop if we find a working one
    except Exception as e:
        print(f"  FAILED: {e}")
