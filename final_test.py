import google.generativeai as genai
genai.configure(api_key='AIzaSyBX_Eu_GWb0SKRD3zTl_VDThpPvfI0nw4U')
try:
    model = genai.GenerativeModel('models/gemini-flash-latest')
    response = model.generate_content('Hi')
    print("SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
