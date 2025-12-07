import { RouteOption, SafetyIncident, TrustedContact, UserProfile, Coordinates, SafePlace } from '../types';

// Mock User Profile
export const MOCK_USER: UserProfile = {
  name: "Priya Sharma",
  email: "priya.s@example.com",
  phone: "+91 98765 43210",
  avatar: "PS",
  preferences: {
    darkMode: false,
    locationSharing: true,
    autoSOS: false
  }
};

// Mock Contacts
export const MOCK_CONTACTS: TrustedContact[] = [
  { id: '1', name: "Amma", phone: "+91 98765 00001", avatar: "A" },
  { id: '2', name: "Rahul (Brother)", phone: "+91 98765 00002", avatar: "R" },
  { id: '3', name: "Sneha", phone: "+91 98765 00003", avatar: "S" }
];

// Bengaluru, India (MG Road area)
export const MOCK_CURRENT_LOCATION: Coordinates = { lat: 12.9716, lng: 77.5946 }; 

// Mock Incidents for Heatmap (Bengaluru)
export const MOCK_INCIDENTS: SafetyIncident[] = [
  {
    id: '1',
    type: 'lighting',
    location: { lat: 12.9750, lng: 77.6000 }, // Near MG Road
    description: "Street lights out on corner",
    timestamp: new Date(),
    severity: 'medium'
  },
  {
    id: '2',
    type: 'harassment',
    location: { lat: 12.9650, lng: 77.5900 }, // Near Lalbagh area
    description: "Verbal harassment reported",
    timestamp: new Date(),
    severity: 'high'
  },
  {
    id: '3',
    type: 'suspicious',
    location: { lat: 12.9800, lng: 77.5950 }, // Near Cubbon Park edge
    description: "Suspicious group gathering",
    timestamp: new Date(),
    severity: 'low'
  }
];

// Mock Safe Places (Bengaluru)
export const MOCK_SAFE_PLACES: SafePlace[] = [
  {
    id: 'sp1',
    type: 'police',
    name: "Cubbon Park Police Station",
    location: { lat: 12.9780, lng: 77.5920 },
    isOpen: true
  },
  {
    id: 'sp2',
    type: 'hospital',
    name: "St. Martha's Hospital",
    location: { lat: 12.9700, lng: 77.5850 },
    isOpen: true
  },
  {
    id: 'sp3',
    type: 'police',
    name: "Ashok Nagar Police Station",
    location: { lat: 12.9730, lng: 77.6050 },
    isOpen: true
  },
  {
    id: 'sp4',
    type: 'hospital',
    name: "Mallya Hospital",
    location: { lat: 12.9680, lng: 77.5960 },
    isOpen: true
  }
];

// Helper to generate a smooth path between points
const generateSmoothPath = (start: Coordinates, end: Coordinates, numPoints: number = 50): Coordinates[] => {
  const path: Coordinates[] = [];
  // Midpoint with some curve
  const midLat = (start.lat + end.lat) / 2 + (Math.random() - 0.5) * 0.005;
  const midLng = (start.lng + end.lng) / 2 + (Math.random() - 0.5) * 0.005;

  // First leg
  for (let i = 0; i <= numPoints / 2; i++) {
    const t = i / (numPoints / 2);
    path.push({
      lat: start.lat + (midLat - start.lat) * t,
      lng: start.lng + (midLng - start.lng) * t
    });
  }
  // Second leg
  for (let i = 0; i <= numPoints / 2; i++) {
    const t = i / (numPoints / 2);
    path.push({
      lat: midLat + (end.lat - midLat) * t,
      lng: midLng + (end.lng - midLng) * t
    });
  }
  return path;
};

// Generate Mock Routes based on a start/end (Visual simulation only)
export const getMockRoutes = (start: Coordinates, end: Coordinates): RouteOption[] => {
  return [
    {
      id: 'r1',
      type: 'fastest',
      distance: "4.2 km",
      duration: "12 min",
      safetyScore: 6.5,
      roadQuality: 'Good',
      path: generateSmoothPath(start, end, 60)
    },
    {
      id: 'r2',
      type: 'safest',
      distance: "5.1 km",
      duration: "18 min",
      safetyScore: 9.2,
      roadQuality: 'Good',
      path: generateSmoothPath(start, end, 80) // Longer path
    },
    {
      id: 'r3',
      type: 'smoothest',
      distance: "4.8 km",
      duration: "15 min",
      safetyScore: 7.8,
      roadQuality: 'Average',
      path: generateSmoothPath(start, end, 70)
    }
  ];
};