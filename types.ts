export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation extends Coordinates {
  address?: string;
  accuracy?: number;
}

export interface RouteOption {
  id: string;
  type: 'fastest' | 'safest' | 'smoothest';
  distance: string; // e.g., "5.2 km"
  duration: string; // e.g., "15 min"
  safetyScore: number; // 0-10
  roadQuality: 'Good' | 'Average' | 'Poor';
  path: Coordinates[]; // Mock path for visualization
}

export interface SafetyIncident {
  id: string;
  type: 'lighting' | 'suspicious' | 'harassment' | 'road';
  location: Coordinates;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface SafePlace {
  id: string;
  type: 'police' | 'hospital' | 'pharmacy';
  name: string;
  location: Coordinates;
  isOpen: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferences: {
    darkMode: boolean;
    locationSharing: boolean;
    autoSOS: boolean;
  };
}