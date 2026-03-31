export interface ProductAnalysisResult {
  eco_score: number; // 0-100 (Higher is usually better, or context dependent)
  verdict: string; // e.g., "High Plastic"
  reasoning: string; // Detailed paragraph
  concerns: string[]; // List of specific concerns
  technical_details: {
    label: string;
    value: string;
  }[]; // Key-value pairs for the dropdown
}

export interface DetectedItem {
  name: string;
  material: string;
  status: "Good" | "Bad";
}

export interface RoomAuditResult {
  plastic_load: number;
  ghost_carbon: string;
  ocean_impact: string;
  decomposition_time: string; // "500 years"
  decomposition_item: string; // "Plastic Chair"
  decomposition_comparison: string; // "vs Wood (15 years)"
  toxin_risk: "Low" | "Medium" | "High" | "Severe";
  toxin_warning: string;
  recyclable_value: string;
  circular_economy_status: string; // e.g., "75% Landfill"
  faux_natural_verdict: string; // "Real Wood confirmed" or "Fake Leather detected"
  detected_items: DetectedItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PRODUCT_SCAN = 'PRODUCT_SCAN',
  ROOM_AUDIT = 'ROOM_AUDIT',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  CONTACT = 'CONTACT',
  ABOUT = 'ABOUT'
}