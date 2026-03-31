import google.generativeai as genai
genai.configure(api_key='AIzaSyBX_Eu_GWb0SKRD3zTl_VDThpPvfI0nw4U')
models = ['gemini-1.5-flash', 'models/gemini-1.5-flash', 'gemini-1.5-flash-latest', 'models/gemini-1.5-flash-latest']

for m_name in models:
    try:
        model = genai.GenerativeModel(m_name)
        response = model.generate_content('Hello')
        print(f"SUCCESS with {m_name}: {response.text[:10]}...")
        break
    except Exception as e:
        print(f"FAILED with {m_name}: {e}")
