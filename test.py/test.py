import streamlit as st
import google.generativeai as genai
from PIL import Image
import json
import re
import pandas as pd
import warnings

# --- 1. CONFIGURATION ---
warnings.filterwarnings("ignore")

st.set_page_config(
    page_title="EcoLens 2.0",
    page_icon="🌿",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# ⚠️ PASTE YOUR API KEY HERE
API_KEY = "AIzaSyBX_Eu_GWb0SKRD3zTl_VDThpPvfI0nw4U"
try:
    genai.configure(api_key=API_KEY)
except:
    st.error("API Key Missing. Please paste your key in the code.")

# Custom CSS
st.markdown("""
    <style>
    .stButton>button {
        width: 100%; border-radius: 20px; font-weight: bold; height: 50px;
        background-color: #4CAF50; color: white;
    }
    .metric-card {
        background-color: #f0f2f6; border-radius: 10px; padding: 15px; text-align: center;
    }
    </style>
""", unsafe_allow_html=True)

# --- 2. HELPER FUNCTIONS (VISUALS) ---

def render_colored_bar(value, label, min_val=0, max_val=100, reverse=False):
    """
    Renders a colored progress bar.
    reverse=False: Low is Green, High is Red (e.g. Plastic Load)
    reverse=True: Low is Red, High is Green (e.g. Recyclability)
    """
    # Normalize value to 0-100
    pct = (value / max_val) * 100
    pct = min(100, max(0, pct))
    
    if reverse:
        if pct < 30: color = "#F44336" # Red
        elif pct < 70: color = "#FF9800" # Orange
        else: color = "#4CAF50" # Green
    else:
        if pct < 30: color = "#4CAF50" # Green
        elif pct < 70: color = "#FF9800" # Orange
        else: color = "#F44336" # Red
        
    st.markdown(f"""
        <p style="margin-bottom: 5px; font-weight: bold;">{label}: {value}%</p>
        <div style="background-color: #e0e0e0; border-radius: 10px; height: 20px; width: 100%;">
            <div style="background-color: {color}; width: {pct}%; height: 100%; border-radius: 10px;"></div>
        </div>
        <br>
    """, unsafe_allow_html=True)

def render_risk_badge(level):
    level = level.lower()
    if "high" in level:
        color = "#ffebee" # Light Red
        text_color = "#c62828"
        icon = "🚨"
    elif "med" in level:
        color = "#fff3e0" # Light Orange
        text_color = "#ef6c00"
        icon = "⚠️"
    else:
        color = "#e8f5e9" # Light Green
        text_color = "#2e7d32"
        icon = "✅"
    st.markdown(f"""
        <div style="background-color: {color}; padding: 10px; border-radius: 5px; border-left: 5px solid {text_color};">
            <strong style="color: {text_color};">{icon} Risk Level: {level.upper()}</strong>
        </div>
    """, unsafe_allow_html=True)

def extract_json(text):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match: return json.loads(match.group(0))
        clean_text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except:
        return None

# --- 3. BACKEND LOGIC ---
def get_gemini_response(image, prompt):
    models_to_try = ["models/gemini-1.5-flash", "models/gemini-2.0-flash", "models/gemini-flash-latest"]
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content([prompt, image])
            return response.text
        except:
            continue
    return json.dumps({"error": "Connection Failed."})

# --- PROMPTS ---
product_prompt = """
Analyze this image (Product Label or Physical Object).
Return valid JSON:
{
    "product_name": "Name",
    "eco_score": (0-10 integer),
    "verdict": "Greenwashed / Sustainable / High Plastic",
    "bad_ingredients": ["List 1", "List 2"],
    "reasoning": "Explain why.",
    "sustainability_detail": "Technical details."
}
"""

room_prompt = """
Analyze this room image for environmental impact. 
IMPORTANT: Calculate specific values based on the ACTUAL items in the photo. Do NOT use default numbers.

Return valid JSON with these exact keys:
{
    "polymer_heatmap": {
        "plastic_load_percent": (Integer 0-100, estimate based on surface area), 
        "red_zones": ["List Synthetic Items"], 
        "green_zones": ["List Natural Items"]
    },
    "material_breakdown": {
        "Plastic": (Integer %),
        "Wood": (Integer %),
        "Metal": (Integer %),
        "Glass": (Integer %),
        "Fabric": (Integer %)
    },
    "ghost_carbon": {
        "total_embedded_co2": "X.X tons", 
        "explanation": "Explain based on specific furniture weight"
    },
    "decomposition_timeline": {
        "worst_item": "Name of Item", 
        "years_to_decompose": "X years", 
        "comparison": "vs Wood"
    },
    "toxin_detective": {
        "risk_level": "Low/Medium/High", 
        "potential_offgassing": "Source Name"
    },
    "faux_natural_buster": {
        "fake_materials": ["Item Name"]
    },
    "circular_economy": {
        "landfill_waste_percent": (Integer 0-100, estimate non-recyclable portion), 
        "recyclable_value_usd": "$X"
    },
    "ocean_impact": {
        "straw_equivalent": "X", 
        "visual_text": "Visual description"
    }
}
"""

# --- 4. THE UI ---
def load_image_with_fallback():
    tab1, tab2 = st.tabs(["📷 Live Camera", "📂 Upload Photo"])
    with tab1: cam_img = st.camera_input("Snap Photo")
    with tab2: up_img = st.file_uploader("Upload Image", type=["jpg", "png", "jpeg"])
    return cam_img if cam_img else up_img

st.image("https://cdn-icons-png.flaticon.com/512/3135/3135715.png", width=60)
st.write("## EcoLens 2.0")
st.caption("The 7-Point Sustainability Auditor")

mode = st.selectbox("Select Tool:", ["🔍 Product Inspector", "🏠 Room Auditor (7-Point)"])
st.divider()

if mode == "🔍 Product Inspector":
    st.info("Detects toxins in labels OR analyzes materials in objects.")
    img_buffer = load_image_with_fallback()
    
    if img_buffer:
        st.image(img_buffer, caption="Product Loaded", width=300)
        if st.button("🔍 Analyze Product"):
            with st.spinner("Analyzing..."):
                image_pil = Image.open(img_buffer)
                res = get_gemini_response(image_pil, product_prompt)
                data = extract_json(res)
                
                if data and "error" not in data:
                    score = data.get('eco_score', 0)
                    render_colored_bar(score*10, "Eco Score", reverse=True) # Score is 0-10, convert to %
                    
                    st.write(f"**Verdict:** {data.get('verdict')}")
                    st.write(f"**Reasoning:** {data.get('reasoning')}")
                    
                    bad = data.get('bad_ingredients', [])
                    if bad: st.error(f"❌ **Concerns:** {', '.join(bad)}")
                    
                    with st.expander("ℹ️ Technical Details"):
                        st.write(data.get('sustainability_detail', 'N/A'))
                else:
                    st.error("Error analyzing product.")

elif mode == "🏠 Room Auditor (7-Point)":
    st.warning("Full 7-Point Environmental Audit.")
    img_buffer = load_image_with_fallback()
    
    if img_buffer:
        st.image(img_buffer, caption="Room Loaded")
        
        if st.button("🚀 Run Full Audit"):
            with st.spinner("Calculating 7-Point Audit..."):
                image_pil = Image.open(img_buffer)
                res = get_gemini_response(image_pil, room_prompt)
                data = extract_json(res)
                
                if data and "error" not in data:
                    # 1. HEATMAP & GRAPH
                    st.header("1. 🌡️ Polymer Heatmap")
                    h = data.get("polymer_heatmap", {})
                    # Render Colored Bar
                    render_colored_bar(h.get('plastic_load_percent', 0), "Synthetic Plastic Load")
                    
                    # RENDER THE IMPACT GRAPH
                    st.subheader("📊 Material Breakdown")
                    breakdown = data.get("material_breakdown", {"Plastic": 50, "Wood": 50})
                    # Create a simple dataframe for the bar chart
                    df = pd.DataFrame(list(breakdown.items()), columns=["Material", "Percentage"])
                    st.bar_chart(df.set_index("Material"))

                    st.write("**🔴 Synthetic Hotspots:**")
                    for item in h.get('red_zones', []): st.markdown(f"- {item}")
                    st.divider()

                    # 2. GHOST CARBON
                    st.header("2. 👻 Ghost Carbon")
                    c = data.get("ghost_carbon", {})
                    st.metric("Embedded CO2", c.get("total_embedded_co2", "N/A"))
                    st.info(f"💡 {c.get('explanation', '')}")
                    st.divider()

                    # 3. DECOMPOSITION
                    st.header("3. ⏳ Decomposition")
                    t = data.get("decomposition_timeline", {})
                    col1, col2 = st.columns(2)
                    col1.warning(f"**Worst Item:**\n\n{t.get('worst_item', 'N/A')}")
                    col2.metric("Years", t.get("years_to_decompose", "N/A"))
                    st.divider()

                    # 4. TOXINS
                    st.header("4. ☠️ Toxin Detective")
                    tox = data.get("toxin_detective", {})
                    render_risk_badge(tox.get('risk_level', 'Low'))
                    st.write(f"**Source:** {tox.get('potential_offgassing', 'None')}")
                    st.divider()
                    
                    # 5, 6, 7
                    c3, c4 = st.columns(2)
                    c3.subheader("5. 🎭 Fakes")
                    fakes = data.get('faux_natural_buster', {}).get('fake_materials', [])
                    if fakes and fakes != ["None"]:
                        for f in fakes: c3.markdown(f"- {f}")
                    else: c3.success("No fakes.")
                    
                    c4.subheader("6. 💰 Economy")
                    econ = data.get("circular_economy", {})
                    # Render Colored Bar for Landfill
                    render_colored_bar(econ.get('landfill_waste_percent', 0), "Landfill Waste")
                    
                    st.divider()
                    st.header("7. 🌊 Ocean Impact")
                    o = data.get("ocean_impact", {})
                    st.metric("Straw Equivalent", o.get("straw_equivalent", "N/A"))
                    st.caption(f"🌊 {o.get('visual_text', '')}")

                else:
                     st.error("Error analyzing room.")
                     with st.expander("Debug"): st.code(res)