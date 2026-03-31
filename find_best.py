import google.generativeai as genai
KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)
models = ["models/gemini-2.5-flash", "models/gemini-2.0-flash", "models/gemini-3-flash-preview"]
for m in models:
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("hi")
        print(f"WINNER: {m}")
        break
    except Exception as e:
        print(f"FAIL: {m} - {e}")
