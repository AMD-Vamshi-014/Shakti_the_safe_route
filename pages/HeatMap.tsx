import React, { useState } from 'react';
import { Filter, Calendar, Info, ChevronUp } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { MOCK_CURRENT_LOCATION, MOCK_INCIDENTS } from '../services/mockService';

const HeatMap: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('7d');

  return (
    <div className="h-full w-full flex flex-col relative bg-slate-50">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-white to-transparent">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 drop-shadow-sm">Safety Heat Map</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['24h', '7d', '30d', 'All'].map((t) => (
                <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm border
                        ${timeFilter === t 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white text-slate-600 border-slate-200'}`}
                >
                    {t === '24h' ? 'Last 24h' : t === '7d' ? 'Last Week' : t === '30d' ? 'Last Month' : 'All Time'}
                </button>
            ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
         <LeafletMap center={MOCK_CURRENT_LOCATION} heatmapMode={true} />
      </div>

      {/* Info Sheet */}
      <div className="bg-white border-t border-slate-200 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="p-2 flex justify-center">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
        <div className="px-5 pb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Area Safety Analysis</h3>
                <Info size={16} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                    <div className="text-2xl font-bold text-green-600">8.5</div>
                    <div className="text-[10px] uppercase font-bold text-green-400 mt-1">Lighting</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-center">
                    <div className="text-2xl font-bold text-orange-500">4.2</div>
                    <div className="text-[10px] uppercase font-bold text-orange-400 mt-1">Crowd</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                    <div className="text-2xl font-bold text-blue-600">9.0</div>
                    <div className="text-[10px] uppercase font-bold text-blue-400 mt-1">Patrols</div>
                </div>
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Reports</h4>
            <div className="space-y-3">
                {MOCK_INCIDENTS.map((incident) => (
                    <div key={incident.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-2
                            ${incident.severity === 'high' ? 'bg-red-500' : 
                              incident.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'}`} 
                        />
                        <div>
                            <div className="font-medium text-slate-800 capitalize">{incident.type} Issue</div>
                            <div className="text-sm text-slate-500">{incident.description}</div>
                            <div className="text-xs text-slate-400 mt-1">Reported 2 hours ago</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;