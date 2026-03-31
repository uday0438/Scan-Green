import os
import google.generativeai as genai

KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)

print(f"Testing key: {KEY[:10]}...")
try:
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    print("\nTest Response:")
    print(response.text)
except Exception as e:
    print(f"\nERROR occurred: {e}")
