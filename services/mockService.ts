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

// Helper: Calculate Haversine Distance in KM
const calculateDistance = (start: Coordinates, end: Coordinates): number => {
  const R = 6371; // Radius of earth in km
  const dLat = (end.lat - start.lat) * (Math.PI / 180);
  const dLon = (end.lng - start.lng) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(start.lat * (Math.PI/180)) * Math.cos(end.lat * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Helper: Generate a smooth Bezier curved path
const generateSmoothPath = (start: Coordinates, end: Coordinates, numPoints: number = 200): Coordinates[] => {
  const path: Coordinates[] = [];
  
  // Midpoint
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  
  // Add a control point offset for the curve (Quadratic Bezier)
  // Offset depends on direction to ensure it doesn't just look like a straight line
  const dist = Math.sqrt(Math.pow(end.lat - start.lat, 2) + Math.pow(end.lng - start.lng, 2));
  
  // Create a perpendicular-ish offset
  const offset = dist * 0.2; // 20% curve
  const controlLat = midLat + offset * (Math.random() > 0.5 ? 1 : -1);
  const controlLng = midLng + offset * (Math.random() > 0.5 ? 1 : -1);

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Quadratic Bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const lat = Math.pow(1-t, 2) * start.lat + 2 * (1-t) * t * controlLat + Math.pow(t, 2) * end.lat;
    const lng = Math.pow(1-t, 2) * start.lng + 2 * (1-t) * t * controlLng + Math.pow(t, 2) * end.lng;
    
    path.push({ lat, lng });
  }
  return path;
};

// Generate Mock Routes based on REAL coordinates
export const getMockRoutes = (start: Coordinates, end: Coordinates): RouteOption[] => {
  // Calculate real distance
  const realDistanceKm = calculateDistance(start, end);
  
  // Add road factor (roads are rarely straight lines) - approx 1.3x multiplier
  const routeBaseDistance = Math.max(0.5, realDistanceKm * 1.3);

  // Define route variations
  const routes = [
    {
      type: 'fastest',
      distMult: 1.0, // Base
      speed: 35, // km/h
      score: 6.5,
      quality: 'Good' as const
    },
    {
      type: 'safest',
      distMult: 1.15, // Slightly longer
      speed: 30, // Slower due to safer roads
      score: 9.2,
      quality: 'Good' as const
    },
    {
      type: 'smoothest',
      distMult: 1.1,
      speed: 32,
      score: 7.8,
      quality: 'Average' as const
    }
  ];

  return routes.map((r, index) => {
    const dist = routeBaseDistance * r.distMult;
    const timeMins = (dist / r.speed) * 60;
    
    return {
      id: `r${index + 1}`,
      type: r.type as any,
      distance: `${dist.toFixed(1)} km`,
      duration: `${Math.ceil(timeMins)} min`,
      safetyScore: r.score,
      roadQuality: r.quality,
      path: generateSmoothPath(start, end, 200) // Re-generate for slight variation if we added randomness
    };
  });
};