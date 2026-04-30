# ScanGreen 🌱

> **Material Intelligence for a Plastic-Free Future.**

ScanGreen is an AI-powered environmental auditing platform designed to help individuals and enterprises reduce their plastic footprint. By leveraging advanced vision models, ScanGreen analyzes real-world environments and products to instantly detect synthetic materials, assess hidden health risks (like VOCs and microplastics), and provide actionable, sustainable alternatives.

---

## 🚀 Key Features

*   **7-Point Environment Audit**: Snap a photo of any room to receive a comprehensive analysis, including a Polymer Heatmap, Ghost Carbon estimation, Decomposition timelines, and Circular Economy status.
*   **Intelligent Product Scanning**: Instantly verify if a product is truly eco-friendly or "greenwashed." If an item contains high plastic levels, the AI automatically recommends a sustainable alternative.
*   **"Greeny" Voice AI Assistant**: A built-in, real-time voice assistant powered by native Speech Recognition. Ask Greeny anything about material science or sustainability, and it will respond with spoken audio.
*   **Enterprise Gamification**: Users earn "Eco Warrior" XP for every successful scan and audit. The platform automatically aggregates room data to generate an official **Corporate Sustainability Grade (A+ to F)**, making it perfect for B2B premises auditing.
*   **Live Global News**: A dynamic, auto-updating carousel fetching the latest headlines in climate science, renewable energy, and ocean conservation.
*   **Progressive Web App (PWA)**: Fully installable on mobile devices with native camera integration for on-the-go scanning.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
*   **Backend**: Python, FastAPI, Vercel Serverless Functions
*   **AI Engine**: Google Gemini (Vision & Generative Models)
*   **APIs**: Web Speech API (Speech-to-Text / Text-to-Speech)
*   **Deployment**: Vercel

---

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uday0438/Scan-Green.git
   cd Scan-Green
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   Make sure you have Python 3 installed, then run:
   ```bash
   pip install fastapi uvicorn google-generativeai pillow python-dotenv
   ```

4. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Start the Development Servers:**
   *Terminal 1 (Backend):*
   ```bash
   python api/index.py
   ```
   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser.

---

## 🌍 Mission
Built for the 1M1B (1 Million for 1 Billion) initiative, ScanGreen aims to democratize material science, empowering consumers and corporations alike to make transparent, plastic-free decisions.
