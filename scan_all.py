import google.generativeai as genai
import time

KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)

def test_model(name):
    try:
        model = genai.GenerativeModel(name)
        response = model.generate_content("hi", generation_config={"max_output_tokens": 10})
        if response.text:
            return True, response.text.strip()
    except Exception as e:
        return False, str(e)
    return False, "No response text"

print("Scanning for working models...")
working = []
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        # Avoid embedding models etc.
        if "embed" in m.name or "aqa" in m.name: continue
        
        ok, res = test_model(m.name)
        if ok:
            print(f"[WORKING] {m.name}: {res}")
            working.append(m.name)
        else:
            if "429" in res:
                print(f"[429] {m.name}")
            elif "404" in res:
                print(f"[404] {m.name}")
            else:
                print(f"[FAIL] {m.name}: {res[:50]}")
        time.sleep(0.1)

print("\nSUMMARY OF WORKING MODELS:")
for w in working:
    print(f"- {w}")

if not working:
    print("NO MODELS ARE WORKING. KEY IS FULLY DEPLETED.")
