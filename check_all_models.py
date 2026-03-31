import google.generativeai as genai
import time

KEY = "AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw"
genai.configure(api_key=KEY)

test_models = [
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-flash-8b",
    "models/gemini-pro",
    "models/gemini-3-flash-preview"
]

print(f"--- STARTING DIAGNOSTIC FOR KEY {KEY[:10]}... ---")

for m_name in test_models:
    print(f"Checking {m_name}...")
    try:
        model = genai.GenerativeModel(m_name)
        # Try a tiny prompt
        res = model.generate_content("ping", generation_config={"max_output_tokens": 5})
        print(f"  [OK] Response: {res.text.strip()}")
    except Exception as e:
        err = str(e)
        if "429" in err:
            print(f"  [QUOTA] 429 Error - Model is blocked by rate limit.")
        elif "404" in err:
            print(f"  [MISSING] 404 Error - Model name not recognized.")
        else:
            print(f"  [ERROR] {err[:100]}")
    time.sleep(0.5)

print("--- DIAGNOSTIC COMPLETE ---")
