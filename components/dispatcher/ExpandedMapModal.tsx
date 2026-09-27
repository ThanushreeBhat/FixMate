'use client';

import React from 'react';
import type { DispatchItem, LiveTechnician } from './useDispatcherState';

interface ExpandedMapModalProps {
  isMapExpanded: boolean;
  setIsMapExpanded: (val: boolean) => void;
  dispatches: DispatchItem[];
  handleOpenAssign: (disp: DispatchItem) => void;
  showToast: (msg: string) => void;
  liveTechnicians: LiveTechnician[];
}

export default function ExpandedMapModal({
  isMapExpanded,
  setIsMapExpanded,
  dispatches,
  handleOpenAssign,
  showToast,
  liveTechnicians
}: ExpandedMapModalProps) {
  if (!isMapExpanded) return null;

  return (
    <div className="modal-overlay z-[2100]">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Regional Dispatch Live Grid Tracker</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">City Division: Mangaluru Sector</p>
          </div>
          <button 
            onClick={() => setIsMapExpanded(false)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 bg-sky-50 relative flex items-center justify-center overflow-hidden">
          {/* Mangaluru Google Maps Background */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62200.77196024976!2d74.8118128362678!3d12.870585149306894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf4889%3A0x8b11737d446ec01e!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1722330000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'contrast(1.05) saturate(0.95)' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 z-0"
          ></iframe>

          {/* Interactive SVG Layer (Only used for drawing the visual connections) */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 200 L500 200 L500 500 L800 500" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,8" />
          </svg>

          {/* Interactive Overlay Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Active Technicians Pins */}
            {liveTechnicians && liveTechnicians.map((tech) => {
              const isOnSite = ['Reached Location', 'Service Started', 'Service Completed'].includes(tech.status);
              const fillColor = isOnSite ? 'bg-emerald-500' : 'bg-blue-500';
              const locationLabel = tech.currentLocation.split(',')[0];
              return (
                <div 
                  key={tech.id}
                  style={{ left: `${tech.cx}px`, top: `${tech.cy}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto flex items-center gap-2 group z-20"
                  onClick={() => showToast(`${tech.name} (${tech.role}): ${tech.status} at ${tech.currentLocation}`)}
                >
                  <div className={`w-7 h-7 rounded-full ${fillColor} border-2 border-white shadow-md transition-transform group-hover:scale-110 flex items-center justify-center text-xs text-white font-bold`}>
                    {isOnSite ? '🏠' : '🚗'}
                  </div>
                  <div className="bg-white/95 px-2 py-0.5 rounded shadow-md border border-slate-200 text-[#0A2540] font-extrabold text-[10px] whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                    {tech.name} ({locationLabel})
                  </div>
                </div>
              );
            })}

            {/* Incident Markers */}
            {dispatches.map((disp) => {
              const hashValue = (str: string) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                  hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return Math.abs(hash);
              };
              const hashVal = hashValue(disp.id);
              const cx = 150 + (hashVal % 500);
              const cy = 150 + ((hashVal >> 2) % 350);

              return (
                <div 
                  key={disp.id}
                  style={{ left: `${cx}px`, top: `${cy}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group z-20"
                  onClick={() => {
                    handleOpenAssign(disp);
                    setIsMapExpanded(false);
                  }}
                >
                  <div className="absolute inset-0 w-16 h-16 -m-4 rounded-full border-2 border-red-500 animate-pulse opacity-70"></div>
                  <div className="bg-white/95 px-2 py-1 rounded border border-red-200 shadow-md flex items-center gap-1.5 whitespace-nowrap text-[#EF4444] font-black text-[10px] transition-transform group-hover:scale-105">
                    <span>🚨</span>
                    <span>URGENT: {disp.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Map instructions banner */}
          <div className="absolute top-5 left-5 bg-white/95 backdrop-blur border border-slate-200 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-slate-800 z-20">
            💡 Click on red emergency beacons to assign technicians directly from the Mangaluru grid view.
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span><span>Active (Mangaluru Sector)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span><span>Transit</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span><span>Urgent Incident</span></div>
          </div>
          <button 
            onClick={() => setIsMapExpanded(false)}
            className="px-5 py-2 bg-[#0A2540] hover:bg-[#13395F] text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            Close Map view
          </button>
        </div>
      </div>
    </div>
  );
}
