import { ProductAnalysisResult, RoomAuditResult, ChatMessage } from "../types";

const BACKEND_URL = "http://localhost:8001";

export interface NewsItem {
  headline: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  image_keyword: string;
}

export const getSustainabilityNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/news`);
    if (!response.ok) throw new Error("Backend news fetch failed");
    return await response.json();
  } catch (error) {
    console.error("News fetch failed, using fallback:", error);
    return [
      {
        headline: "Global Plastic Treaty Talks Enter Final Stage",
        summary: "Nations gather to finalize the legally binding international instrument to end plastic pollution.",
        source: "UN Environment",
        date: "Recent",
        url: "https://www.unep.org/news-and-stories/story/inc-5-what-expect-final-round-plastic-treaty-talks",
        image_keyword: "plastic"
      },
      {
        headline: "Record Growth in Renewable Energy Sector",
        summary: "Solar and wind power generation hits new global record high in 2024.",
        source: "Energy News",
        date: "Recent",
        url: "https://www.iea.org/reports/renewables-2024",
        image_keyword: "solar"
      },
      {
        headline: "Microplastics Discovered in Remote Cloud Formations",
        summary: "New study reveals extent of atmospheric microplastic contamination.",
        source: "Science Daily",
        date: "Recent",
        url: "https://www.sciencedaily.com/releases/2023/11/231115113702.htm",
        image_keyword: "clouds"
      }
    ];
  }
};

export const chatWithGreeny = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, message: newMessage }),
    });
    if (!response.ok) throw new Error("Chat request failed");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Greeny chat failed:", error);
    return "Oops! My green sensors are offline momentarily. Please try again later. 🌱";
  }
};

// Helper to resize image before sending
const resizeImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.8); // Use JPEG 0.8 for speed/size balance
    };
  });
};

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysisResult> => {
  try {
    const blob = await resizeImage(base64Image, 800, 800);
    const formData = new FormData();
    formData.append("file", blob, "product.jpg");

    const response = await fetch(`${BACKEND_URL}/analyze-product`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Product analysis failed");
    return await response.json();
  } catch (error) {
    console.error("Product analysis helper failed:", error);
    throw error;
  }
};

export const analyzeRoomImage = async (base64Image: string): Promise<RoomAuditResult> => {
  try {
    const blob = await resizeImage(base64Image, 1024, 1024);
    const formData = new FormData();
    formData.append("file", blob, "room.jpg");

    const response = await fetch(`${BACKEND_URL}/analyze-room`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Room audit failed");
    return await response.json();
  } catch (error) {
    console.error("Room analysis failed:", error);
    throw error;
  }
};