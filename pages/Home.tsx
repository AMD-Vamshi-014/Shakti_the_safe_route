import React, { useState, useEffect } from 'react';
import { Navigation, Shield, Zap, Menu, Gauge, Building2, ArrowRightLeft, X, CornerUpRight, AlertCircle } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { Coordinates, RouteOption } from '../types';
import { getMockRoutes, MOCK_CURRENT_LOCATION, MOCK_SAFE_PLACES } from '../services/mockService';

interface HomeProps {
  onMenuClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onMenuClick }) => {
  // Navigation State
  const [pickup, setPickup] = useState('Current Location');
  const [drop, setDrop] = useState('');
  
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  
  // Location State
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(MOCK_CURRENT_LOCATION);
  const [destCoords, setDestCoords] = useState<Coordinates | null>(null);
  
  // App State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSafePlaces, setShowSafePlaces] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Simulation State
  const [navProgress, setNavProgress] = useState(0);

  // Geocoding Helper
  const fetchLocation = async (query: string): Promise<{ lat: string, lon: string } | null> => {
    try {
        // Bias search towards Bengaluru (approx bounding box) but allow results from India
        const viewbox = '&viewbox=77.3,12.8,77.9,13.2';
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in${viewbox}`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (e) {
        console.error("Geocoding error", e);
        return null;
    }
  };

  // Search Logic
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drop) return;
    
    setLoading(true);
    setError('');
    setRoutes([]);
    setSelectedRoute(null);

    try {
        // 1. Resolve Pickup Location
        let startCoords = MOCK_CURRENT_LOCATION;
        
        // If user changed pickup from default, geocode it
        if (pickup.trim() !== '' && pickup !== 'Current Location') {
            const pickupResult = await fetchLocation(pickup);
            if (!pickupResult) {
                setError(`Pickup location not found: "${pickup}"`);
                setLoading(false);
                return;
            }
            startCoords = { lat: parseFloat(pickupResult.lat), lng: parseFloat(pickupResult.lon) };
            setCurrentLocation(startCoords); // Move map view to custom pickup
        } else {
            // Reset to default mock location if they typed "Current Location" or left it default
            setCurrentLocation(MOCK_CURRENT_LOCATION);
            startCoords = MOCK_CURRENT_LOCATION;
        }

        // 2. Resolve Drop Location
        const dropResult = await fetchLocation(drop);
        if (!dropResult) {
            setError(`Destination not found: "${drop}"`);
            setLoading(false);
            return;
        }

        const endCoords = { lat: parseFloat(dropResult.lat), lng: parseFloat(dropResult.lon) };
        setDestCoords(endCoords);
        
        // 3. Generate Mock Routes between REAL coordinates
        const calculatedRoutes = getMockRoutes(startCoords, endCoords);
        setRoutes(calculatedRoutes);
        setSelectedRoute(calculatedRoutes[1]); // Default to safest
        
    } catch (err) {
        setError('Unable to connect to map services. Please check your internet.');
    } finally {
        setLoading(false);
    }
  };

  // Start Navigation Logic
  const startNavigation = () => {
    if (!selectedRoute) return;
    setIsNavigating(true);
    setNavProgress(0);
    setCurrentLocation(selectedRoute.path[0]); // Jump to start
  };

  const endNavigation = () => {
    setIsNavigating(false);
    setNavProgress(0);
    // Reset map view to the start of the simulation or original location
    if (selectedRoute) setCurrentLocation(selectedRoute.path[0]);
  };

  // Manual Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      setNavProgress(val);
      if (selectedRoute) {
          setCurrentLocation(selectedRoute.path[val]);
      }
  };

  // Calculate Real-time Stats
  const getRemainingStats = () => {
    if (!selectedRoute) return { time: 0, dist: "0.0" };
    
    const totalDist = parseFloat(selectedRoute.distance.split(' ')[0]);
    const totalTime = parseFloat(selectedRoute.duration.split(' ')[0]);
    
    // Avoid division by zero
    const totalPoints = selectedRoute.path.length;
    if (totalPoints <= 1) return { time: totalTime, dist: totalDist.toFixed(1) };

    const progressFraction = navProgress / (totalPoints - 1);
    const remainingFraction = Math.max(0, 1 - progressFraction);
    
    return {
        dist: (totalDist * remainingFraction).toFixed(1),
        time: Math.ceil(totalTime * remainingFraction)
    };
  };

  const { dist: remainingDist, time: remainingTime } = getRemainingStats();

  // Render
  return (
    <div className="relative h-full w-full flex flex-col bg-white">
      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <LeafletMap 
          center={currentLocation} 
          destination={destCoords} 
          selectedRoute={selectedRoute} 
          safePlaces={showSafePlaces ? MOCK_SAFE_PLACES : []}
          zoom={isNavigating ? 18 : 14}
        />
      </div>

      {/* --- NORMAL MODE UI --- */}
      {!isNavigating && (
        <>
          {/* Top Floating Header with Trip Planner */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
            {/* Menu & Header */}
            <div className="flex justify-between items-center mb-4 pointer-events-auto">
                <button onClick={onMenuClick} className="p-3 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-50">
                    <Menu size={24} />
                </button>
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-600 border border-white/50">
                   Bengaluru, IN
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Trip Planner Card */}
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-100 pointer-events-auto transition-all duration-300">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="flex flex-col items-center pt-2.5">
                        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ring-2 ring-slate-200" />
                        <div className="w-0.5 h-10 bg-gradient-to-b from-slate-300 to-slate-200 my-1.5" />
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-sm ring-2 ring-red-100" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className="w-full bg-slate-50 p-2.5 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                            <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wide">Pickup</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={drop}
                                onChange={(e) => setDrop(e.target.value)}
                                placeholder="Search places in Bengaluru..." 
                                className="w-full bg-slate-50 p-2.5 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:font-normal"
                            />
                            {drop && (
                                <button type="button" onClick={() => setDrop('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <ArrowRightLeft size={18} className="rotate-90" />
                        </button>
                    </div>
                </form>
                
                {/* Error Message */}
                {error && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-2 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={14} className="shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Search Button (only visible if input has value and no routes yet) */}
                {drop && routes.length === 0 && !error && (
                    <button 
                        onClick={handleSearch}
                        className="w-full mt-3 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? 'Finding Location...' : 'Find Routes'}
                    </button>
                )}
            </div>
            
            {/* Quick Toggles */}
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pointer-events-auto pl-1">
               <button 
                 onClick={() => setShowSafePlaces(!showSafePlaces)}
                 className={`px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-2
                   ${showSafePlaces ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}
               >
                 <Building2 size={14} />
                 Safe Places
               </button>
            </div>
          </div>

          {/* Route Selection Panel */}
          {routes.length > 0 && (
            <div className="absolute bottom-20 left-0 right-0 z-20 px-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 max-h-[50vh] overflow-y-auto pointer-events-auto safe-bottom-padding animate-in slide-in-from-bottom-10">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Select Route</h3>
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div 
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between
                        ${selectedRoute?.id === route.id 
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {/* Badge */}
                      {route.type === 'safest' && (
                        <span className="absolute -top-2.5 right-4 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          RECOMMENDED
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full 
                            ${route.type === 'safest' ? 'bg-green-100 text-green-600' : 
                              route.type === 'fastest' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                            {route.type === 'safest' ? <Shield size={20} /> : 
                             route.type === 'fastest' ? <Zap size={20} /> : <Gauge size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                            {route.type}
                          </h4>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span>{route.duration}</span>
                            <span>•</span>
                            <span>{route.distance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Score</div>
                        <div className={`text-xl font-black 
                            ${route.safetyScore >= 8 ? 'text-green-600' : 
                              route.safetyScore >= 5 ? 'text-amber-500' : 'text-red-500'}`}>
                          {route.safetyScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                   <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <span>🚗</span> Book Cab
                   </button>
                   <button 
                      onClick={startNavigation}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-indigo-200 shadow-lg"
                   >
                      <Navigation size={18} />
                      Start
                   </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- NAVIGATION MODE UI --- */}
      {isNavigating && selectedRoute && (
        <>
            {/* Top Navigation Banner */}
            <div className="absolute top-0 left-0 right-0 bg-slate-900 text-white p-6 pb-8 z-30 rounded-b-3xl shadow-2xl animate-in slide-in-from-top-full duration-500">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-start">
                        <CornerUpRight size={48} className="text-white mt-1" />
                        <div>
                            <div className="text-3xl font-bold">Turn right</div>
                            <div className="text-slate-400 text-lg">toward destination in 200m</div>
                        </div>
                    </div>
                    <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-300 uppercase tracking-wide border border-slate-700">
                        Demo Mode
                    </div>
                </div>
            </div>

            {/* Bottom Controls & Stats Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-5 pb-8 z-30 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
                
                {/* Manual Simulation Controls */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase">Manual Simulation Control</span>
                         <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Drag Slider to Move</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={selectedRoute.path.length - 1} 
                        value={navProgress} 
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-3xl font-black text-slate-800">
                            {remainingTime}
                            <span className="text-base text-slate-500 font-medium ml-1">min</span>
                        </div>
                        <div className="text-green-600 font-bold text-sm">On time</div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-slate-800">
                            {remainingDist}
                            <span className="text-base text-slate-500 font-medium ml-1">km</span>
                        </div>
                        <div className="text-slate-400 font-bold text-sm">Remaining</div>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={endNavigation}
                        className="flex-1 bg-red-100 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <X size={20} /> End Trip
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                        <Shield size={20} /> Report
                    </button>
                </div>
            </div>
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                <p className="font-medium text-slate-600">Finding safest routes...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;