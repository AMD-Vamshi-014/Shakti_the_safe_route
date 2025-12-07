import React, { useState } from 'react';
import { Home as HomeIcon, Map as MapIcon, User, AlertTriangle, ShieldAlert } from 'lucide-react';

// Pages
import Home from './pages/Home';
import HeatMap from './pages/HeatMap';
import Profile from './pages/Profile';
import Report from './pages/Report';
import SOS from './pages/SOS';
import FloatingSOSButton from './components/FloatingSOSButton';

// Navigation Types
type NavScreen = 'home' | 'heatmap' | 'report' | 'profile' | 'sos';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('home');

  // Handle Bottom Navigation
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Home onMenuClick={() => setCurrentScreen('profile')} />;
      case 'heatmap': return <HeatMap />;
      case 'report': return <Report />;
      case 'profile': return <Profile />;
      case 'sos': return <SOS />;
      default: return <Home onMenuClick={() => setCurrentScreen('profile')} />;
    }
  };

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Route' },
    { id: 'heatmap', icon: MapIcon, label: 'Safety' },
    { id: 'sos', icon: ShieldAlert, label: 'SOS', isSpecial: true },
    { id: 'report', icon: AlertTriangle, label: 'Report' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderScreen()}
        
        {/* Global Floating SOS Button (Only visible on non-SOS screens) */}
        <FloatingSOSButton 
          visible={currentScreen !== 'sos'} 
          onClick={() => setCurrentScreen('sos')} 
        />
      </main>

      {/* Bottom Navigation Bar */}
      {currentScreen !== 'sos' && (
        <nav className="h-20 bg-white border-t border-slate-200 px-6 flex items-center justify-between z-40 relative shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id as NavScreen)}
              className={`flex flex-col items-center justify-center gap-1 w-12 transition-colors
                ${item.isSpecial ? '-mt-8' : ''}
                ${currentScreen === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {item.isSpecial ? (
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 border-4 border-slate-50">
                  <item.icon size={24} />
                </div>
              ) : (
                <>
                  <item.icon size={24} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;