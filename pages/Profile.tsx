import React, { useState } from 'react';
import { User, Bell, MapPin, Moon, Shield, LogOut, ChevronRight, Phone } from 'lucide-react';
import { MOCK_USER, MOCK_CONTACTS } from '../services/mockService';

const Profile: React.FC = () => {
  const [locationSharing, setLocationSharing] = useState(MOCK_USER.preferences.locationSharing);
  const [autoSOS, setAutoSOS] = useState(MOCK_USER.preferences.autoSOS);

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 pb-12 pt-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 flex items-center gap-5">
            <div className="w-20 h-20 bg-indigo-500 rounded-full border-4 border-slate-800 flex items-center justify-center text-2xl font-bold shadow-lg">
                {MOCK_USER.avatar}
            </div>
            <div>
                <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
                <p className="text-slate-400">{MOCK_USER.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md border border-green-500/30">
                    <Shield size={12} className="mr-1" /> Verified User
                </div>
            </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20 space-y-6">
        
        {/* Trusted Contacts Preview */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Trusted Contacts</h3>
                <button className="text-indigo-600 text-sm font-medium">Manage</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {MOCK_CONTACTS.map(c => (
                    <div key={c.id} className="flex flex-col items-center min-w-[60px]">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold mb-2">
                            {c.avatar}
                        </div>
                        <span className="text-xs text-slate-500 text-center truncate w-full">{c.name}</span>
                    </div>
                ))}
                <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-slate-400 mb-2">
                        +
                    </div>
                    <span className="text-xs text-slate-400">Add</span>
                </div>
            </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Preferences</h3>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-slate-800">Live Location Sharing</div>
                            <div className="text-xs text-slate-500">Share with trusted contacts</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setLocationSharing(!locationSharing)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${locationSharing ? 'bg-green-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${locationSharing ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <Phone size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-slate-800">Auto SOS</div>
                            <div className="text-xs text-slate-500">Trigger on shake/impact</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setAutoSOS(!autoSOS)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${autoSOS ? 'bg-green-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoSOS ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Moon size={20} />
                        </div>
                        <div className="font-medium text-slate-800">Dark Mode</div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                </div>
            </div>
        </div>

        <button className="w-full bg-slate-200 text-slate-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <LogOut size={18} />
            Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;