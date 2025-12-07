import React, { useState, useEffect } from 'react';
import { Phone, X, ShieldAlert, CheckCircle2, Share2, BellRing } from 'lucide-react';
import { MOCK_CONTACTS } from '../services/mockService';

const SOS: React.FC = () => {
  const [countdown, setCountdown] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [contactsNotified, setContactsNotified] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setContactsNotified(true);
    }
    return () => clearInterval(timer);
  }, [isActive, countdown]);

  const handleCancel = () => {
    setIsActive(false);
    setCountdown(10);
    setContactsNotified(false);
  };

  return (
    <div className="h-full bg-slate-900 text-white p-6 flex flex-col relative overflow-hidden">
      {/* Background Pulse Animation */}
      {isActive && countdown > 0 && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl animate-pulse-fast pointer-events-none" />
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
           <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
           <h1 className="text-3xl font-black uppercase tracking-widest text-red-500">Emergency</h1>
           <p className="text-slate-400 mt-2">Sending alerts to trusted contacts</p>
        </div>

        {isActive && countdown > 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" className="stroke-slate-700 fill-none stroke-[8px]" />
                    <circle 
                        cx="96" cy="96" r="88" 
                        className="stroke-red-500 fill-none stroke-[8px] transition-all duration-1000 linear"
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * countdown) / 10}
                    />
                </svg>
                <span className="text-6xl font-black">{countdown}</span>
            </div>
            <p className="mt-8 text-xl font-medium animate-pulse">Auto-calling services in {countdown}s</p>
          </div>
        ) : (
          <div className="w-full bg-slate-800 rounded-2xl p-6 border border-slate-700">
             <div className="flex items-center gap-3 text-green-400 mb-6">
                <CheckCircle2 size={24} />
                <span className="font-bold text-lg">Alerts Sent Successfully</span>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Share2 size={20} className="text-blue-400" />
                        <span>Live Location Shared</span>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <BellRing size={20} className="text-yellow-400" />
                        <span>Contacts Notified</span>
                    </div>
                    <span className="font-bold">{MOCK_CONTACTS.length}</span>
                </div>
             </div>
          </div>
        )}

        {/* Contact List Status */}
        <div className="w-full mt-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Notifying Contacts</h3>
            <div className="space-y-3">
                {MOCK_CONTACTS.map((contact, idx) => (
                    <div key={contact.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold">
                                {contact.avatar}
                            </div>
                            <div>
                                <div className="font-medium">{contact.name}</div>
                                <div className="text-xs text-slate-400">{contact.phone}</div>
                            </div>
                        </div>
                        {contactsNotified ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                            <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-8 space-y-3">
         <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-colors">
            <Phone size={24} />
            Call 100 Now
         </button>
         
         <button 
            onClick={handleCancel}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
         >
            <X size={24} />
            {isActive && countdown > 0 ? "Cancel SOS" : "I am Safe"}
         </button>
      </div>
    </div>
  );
};

export default SOS;