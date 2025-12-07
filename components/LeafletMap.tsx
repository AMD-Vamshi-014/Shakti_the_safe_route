import React, { useEffect, useRef } from 'react';
import { Coordinates, RouteOption, SafePlace } from '../types';

interface LeafletMapProps {
  center: Coordinates;
  destination?: Coordinates | null;
  selectedRoute?: RouteOption | null;
  heatmapMode?: boolean;
  safePlaces?: SafePlace[];
  zoom?: number;
}

// Global L type assumption since we load via CDN
declare global {
  interface Window {
    L: any;
  }
}

const LeafletMap: React.FC<LeafletMapProps> = ({ center, destination, selectedRoute, heatmapMode, safePlaces, zoom = 14 }) => {
  const mapRef = useRef<any>(null);
  const mapContainerId = 'leaflet-map-container';

  useEffect(() => {
    if (!window.L) return;

    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = window.L.map(mapContainerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([center.lat, center.lng], zoom);

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapRef.current);
    } else {
      // Update view if center changes (important for navigation tracking)
      mapRef.current.setView([center.lat, center.lng], zoom, { animate: true, duration: 1 });
    }
    
    // Cleanup existing markers/layers
    mapRef.current.eachLayer((layer: any) => {
      // Keep tiles, remove everything else
      if (layer instanceof window.L.TileLayer) return;
      mapRef.current.removeLayer(layer);
    });

    // Add User Marker (Blue Pulse)
    const userIcon = window.L.divIcon({
      className: 'bg-blue-600 w-5 h-5 rounded-full border-2 border-white shadow-lg relative',
      html: '<div class="absolute -inset-3 bg-blue-500/30 rounded-full animate-ping"></div>',
      iconSize: [20, 20]
    });
    window.L.marker([center.lat, center.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapRef.current);

    // Add Destination Marker
    if (destination) {
      const destIcon = window.L.divIcon({
        className: 'bg-red-600 w-4 h-4 rounded-full border-2 border-white shadow-lg',
        iconSize: [16, 16]
      });
      window.L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(mapRef.current);

      // Draw Route
      if (selectedRoute) {
        const latlngs = selectedRoute.path.map(p => [p.lat, p.lng]);
        
        let color = '#3b82f6'; // Blue default
        if (selectedRoute.type === 'safest') color = '#10b981'; // Green
        if (selectedRoute.safetyScore < 6) color = '#f59e0b'; // Amber

        // Draw the full route path
        window.L.polyline(latlngs, { color: color, weight: 6, opacity: 0.8, lineCap: 'round' }).addTo(mapRef.current);
        
        // If NOT navigating, fit bounds to show whole route. 
        // If navigating, the view updates via the 'center' prop above.
        if (zoom === 14) {
            const bounds = window.L.latLngBounds(latlngs);
            mapRef.current.fitBounds(bounds, { padding: [50, 150] }); 
        }
      }
    }

    // Heatmap Visualization
    if (heatmapMode) {
        // Safe Zone
        window.L.circle([center.lat + 0.002, center.lng + 0.002], {
            color: 'green',
            fillColor: '#4ade80',
            fillOpacity: 0.3,
            radius: 300,
            stroke: false
        }).addTo(mapRef.current);

        // Danger Zone
        window.L.circle([center.lat - 0.002, center.lng - 0.002], {
            color: 'red',
            fillColor: '#f87171',
            fillOpacity: 0.3,
            radius: 200,
            stroke: false
        }).addTo(mapRef.current);
        
        // Moderate Zone
        window.L.circle([center.lat + 0.001, center.lng - 0.003], {
            color: 'orange',
            fillColor: '#fbbf24',
            fillOpacity: 0.3,
            radius: 250,
            stroke: false
        }).addTo(mapRef.current);
    }

    // Safe Places Markers
    if (safePlaces && safePlaces.length > 0) {
      safePlaces.forEach(place => {
        const isPolice = place.type === 'police';
        const colorClass = isPolice ? 'bg-indigo-600' : 'bg-red-500';
        const iconHtml = isPolice 
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` // Shield
          : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12m6-6H6"/></svg>`; // Plus

        const icon = window.L.divIcon({
          className: `${colorClass} w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white`,
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        window.L.marker([place.location.lat, place.location.lng], { icon: icon })
          .bindPopup(`<b class="text-sm">${place.name}</b><br/><span class="text-xs text-slate-500 capitalize">${place.type} • ${place.isOpen ? 'Open Now' : 'Closed'}</span>`)
          .addTo(mapRef.current);
      });
    }

  }, [center, destination, selectedRoute, heatmapMode, safePlaces, zoom]);

  return <div id={mapContainerId} className="w-full h-full z-0 outline-none" />;
};

export default LeafletMap;