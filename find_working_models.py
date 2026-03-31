import google.generativeai as genai
genai.configure(api_key='AIzaSyBX_Eu_GWb0SKRD3zTl_VDThpPvfI0nw4U')
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"FOUND: {m.name}")
