
export interface Alert {
  id: string;
  timestamp: string; // ISO string for sorting, display formatted
  status: 'critical' | 'warning';
  issueType: string;
  message: string;
  validation: 'confirmed' | 'rejected' | null;
  imagePlaceholder?: string; // Color code for placeholder
}

export enum Tab {
  FEED = 'Feed',
  ALERTS = 'Alerts (Active)',
  LIBRARY = 'Feed Library',
  ANALYTICS = 'Analytics',
  REPORT = 'Report'
}

export interface Plant {
  id: string;
  name: string;
}

export interface Camera {
  id: string;
  name: string;
}

// Added for other views to fix missing export errors
export enum AppTab {
  CHAT = 'Chat',
  IMAGE = 'Imaging',
  VIDEO = 'Studio',
  LIVE = 'Live'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  groundingUrls?: Array<{ uri: string; title: string }>;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
