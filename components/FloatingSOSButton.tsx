import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FloatingSOSButtonProps {
  onClick: () => void;
  visible: boolean;
}

const FloatingSOSButton: React.FC<FloatingSOSButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 z-50 w-16 h-16 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center text-white transition-transform active:scale-90 animate-bounce"
      aria-label="SOS Emergency"
    >
      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
      <AlertTriangle size={28} className="relative z-10" />
      <span className="absolute -bottom-6 text-xs font-bold text-red-600 bg-white/90 px-2 py-0.5 rounded shadow-sm">SOS</span>
    </button>
  );
};

export default FloatingSOSButton;