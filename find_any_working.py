import google.generativeai as genai
genai.configure(api_key='AIzaSyBX_Eu_GWb0SKRD3zTl_VDThpPvfI0nw4U')

models = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-1.5-flash",
    "models/gemini-flash-latest",
    "models/gemini-pro-latest"
]

for m in models:
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("hi")
        print(f"SUCCESS: {m}")
        break 
    except Exception as e:
        print(f"FAILED: {m} -> {str(e)[:100]}")
