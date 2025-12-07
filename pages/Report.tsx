import React, { useState } from 'react';
import { Camera, MapPin, Send, AlertTriangle } from 'lucide-react';

const Report: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after delay
    setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        setSelectedType('');
    }, 3000);
  };

  if (submitted) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                  <Send size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted</h2>
              <p className="text-center text-slate-500">Thank you for helping keep the community safe. Your report is being verified.</p>
          </div>
      )
  }

  return (
    <div className="h-full bg-slate-50 p-5 overflow-y-auto pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Report Incident</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 text-slate-600 mb-1">
              <MapPin size={18} className="text-indigo-600" />
              <span className="text-sm font-semibold">Current Location</span>
          </div>
          <p className="text-lg font-medium text-slate-900 ml-7">5th Avenue & 23rd St, NY</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Incident Type</label>
              <div className="grid grid-cols-2 gap-3">
                  {['Lighting', 'Harassment', 'Suspicious', 'Road Issue'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`p-4 rounded-xl border-2 text-left transition-all
                            ${selectedType === type 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-transparent bg-white shadow-sm hover:bg-slate-100'}`}
                      >
                          <div className="font-bold">{type}</div>
                      </button>
                  ))}
              </div>
          </div>

          <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm resize-none"
                placeholder="Describe what you saw..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
          </div>

          <div>
               <label className="block text-sm font-semibold text-slate-700 mb-3">Evidence (Optional)</label>
               <button type="button" className="w-full h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors">
                   <Camera size={20} />
                   <span>Add Photo or Video</span>
               </button>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p>Reports are anonymous by default. Emergency services will not be called automatically.</p>
          </div>

          <button 
            disabled={!selectedType}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
              <Send size={20} />
              Submit Report
          </button>
      </form>
    </div>
  );
};

export default Report;