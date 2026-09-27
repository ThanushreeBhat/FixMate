'use client';

import React from 'react';
import { MapPin, Navigation, Clock, Activity, CheckCircle2, User, PhoneCall } from 'lucide-react';
import type { DispatchItem, LiveTechnician } from './useDispatcherState';

interface LiveMapTabProps {
  dispatches: DispatchItem[];
  liveTechnicians: LiveTechnician[];
  selectedTechForStatus: string | null;
  setSelectedTechForStatus: (id: string | null) => void;
  handleOpenAssign: (disp: DispatchItem) => void;
  handleTechStatusChange?: (id: string, status: string) => void;
}

export default function LiveMapTab({
  dispatches,
  liveTechnicians,
  selectedTechForStatus,
  setSelectedTechForStatus,
  handleOpenAssign
}: LiveMapTabProps) {
  const activeTech = liveTechnicians.find(t => t.id === selectedTechForStatus);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[700px] animate-in fade-in duration-300">
      
      {/* Map Container (75%) */}
      <div className="lg:w-3/4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-sky-50 flex items-center justify-center min-h-[600px]">
        {/* Mangaluru Google Maps Embed */}
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

        {/* Floating Map Controls overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-30 flex-wrap">
          <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-[#0A2540]">
              Mangaluru Fleet ({liveTechnicians.filter(t => ['Reached Location', 'Service Started', 'Service Completed', 'In Progress'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).length} On-Site)
            </span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold text-[#0A2540]">
              In-Transit ({liveTechnicians.filter(t => ['Assigned', 'Accepted', 'On the Way', 'Enroute', 'In Transit'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).length})
            </span>
          </div>
        </div>

        {/* Interactive Overlay Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {dispatches.map((disp) => {
            const hashStr = (str: string) => {
              let hash = 0;
              for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
              }
              return Math.abs(hash);
            };
            const hashVal = hashStr(disp.id);
            const cx = 150 + (hashVal % 500);
            const cy = 150 + ((hashVal >> 2) % 350);

            return (
              <div 
                key={disp.id}
                style={{ left: `${cx}px`, top: `${cy}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group z-20"
                onClick={(e) => { e.stopPropagation(); handleOpenAssign(disp); }}
              >
                <div className="absolute inset-0 w-12 h-12 -m-2 rounded-full border-2 border-red-500 animate-pulse opacity-70"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-black text-white transition-transform group-hover:scale-110">
                  !
                </div>
              </div>
            );
          })}

          {liveTechnicians.map((tech) => {
            const isOnSite = ['Reached Location', 'Service Started', 'Service Completed'].includes(tech.status);
            const fillColor = isOnSite ? '#10B981' : '#3B82F6';
            return (
              <div 
                key={tech.id}
                style={{ left: `${tech.cx}px`, top: `${tech.cy}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group z-20"
                onClick={(e) => { e.stopPropagation(); setSelectedTechForStatus(tech.id); }}
              >
                <div 
                  style={{ backgroundColor: fillColor }}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-white transition-transform group-hover:scale-110"
                >
                  {tech.initials}
                </div>
              </div>
            );
          })}
        </div>

        {/* Read-Only Live Activity Card (Displays current technician location/progress matching Live Activity styling) */}
        {activeTech && (
          <div 
            className="absolute bg-white/95 backdrop-blur border border-slate-200/90 rounded-2xl shadow-2xl p-6 w-[480px] z-30 animate-in zoom-in-95 duration-150 pointer-events-auto"
            style={{
              left: `${Math.min(activeTech.cx + 25, 450)}px`,
              top: `${Math.max(activeTech.cy - 120, 20)}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <h4 className="text-xs font-black uppercase text-[#0A2540] tracking-wider">Live Tracking Feed • {activeTech.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedTechForStatus(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg leading-none font-bold p-1 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Technician Profile Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-sm text-blue-700 shadow-xs shrink-0">
                  {activeTech.initials}
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-slate-800 leading-snug">{activeTech.name}</h5>
                  <p className="text-[11px] font-semibold text-slate-500">{activeTech.role}</p>
                  {activeTech.activeJobTitle && (
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mt-1 inline-block">
                      Job: {activeTech.activeJobTitle}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Phone Icon Button */}
              <a 
                href={`tel:${activeTech.phone || '+919876543210'}`}
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center text-slate-500"
                title={`Call ${activeTech.name}`}
              >
                <PhoneCall size={13} />
              </a>
            </div>

            {/* Stepper Progress Section */}
            {(() => {
              const stepperSteps = [
                { label: 'Assigned', title: 'Technician Assigned', desc: 'Technician has been allocated to the service request.' },
                { label: 'Accepted', title: 'Job Accepted', desc: 'Technician has accepted the service request.' },
                { label: 'On The Way', title: 'On the Way', desc: 'Technician is traveling to your location.' },
                { label: 'Reached Location', title: 'Reached Location', desc: 'Technician has arrived at the service address.' },
                { label: 'Service Started', title: 'Service In-Progress', desc: 'Technician is actively working on resolving the issue.' },
                { label: 'Completed', title: 'Service Completed', desc: 'The job has been finished and verified by the customer.' }
              ];

              const getStepIndex = (status?: string) => {
                const s = (status || '').toLowerCase().trim();
                if (s.startsWith('6') || s === 'completed' || s.includes('complete') || s.includes('done')) return 5;
                if (s.startsWith('5') || s.includes('service started') || s.includes('started') || s.includes('progress')) return 4;
                if (s.startsWith('4') || s.includes('reached location') || s.includes('reached') || s.includes('arrive')) return 3;
                if (s.startsWith('3') || s.includes('on the way') || s.includes('way') || s.includes('transit') || s.includes('enroute')) return 2;
                if (s.startsWith('2') || s.includes('accepted') || s.includes('accept')) return 1;
                if (s.startsWith('1') || s.includes('assigned') || s.includes('assign')) return 0;
                return 0;
              };

              const [realtimeStatus, setRealtimeStatus] = React.useState<string | null>(null);

              React.useEffect(() => {
                const updateRealtimeStatus = (e?: Event) => {
                  try {
                    const detail = (e as CustomEvent)?.detail;
                    if (detail && detail.status) {
                      const targetTech = detail.technicianName || detail.assignedTechName || detail.assignedTech || detail.techName;
                      const targetJobId = detail.jobId || detail.id;
                      const matchesTech = targetTech && (
                        targetTech.toLowerCase() === activeTech.name.toLowerCase() ||
                        activeTech.name.toLowerCase().includes(targetTech.toLowerCase()) ||
                        targetTech.toLowerCase().includes(activeTech.name.toLowerCase())
                      );
                      const matchesJob = (targetJobId && activeTech.jobId === targetJobId) || (activeTech.id === targetJobId);
                      if (matchesTech || matchesJob) {
                        setRealtimeStatus(detail.status);
                        return;
                      }
                    }

                    const raw = localStorage.getItem('fixmate_last_job_status_update');
                    if (raw) {
                      const parsed = JSON.parse(raw);
                      if (parsed && parsed.status) {
                        const targetTech = parsed.technicianName || parsed.assignedTechName || parsed.assignedTech || parsed.techName;
                        const targetJobId = parsed.jobId || parsed.id;
                        const matchesTech = targetTech && (
                          targetTech.toLowerCase() === activeTech.name.toLowerCase() ||
                          activeTech.name.toLowerCase().includes(targetTech.toLowerCase()) ||
                          targetTech.toLowerCase().includes(activeTech.name.toLowerCase())
                        );
                        const matchesJob = (targetJobId && activeTech.jobId === targetJobId) || (activeTech.id === targetJobId);
                        if (matchesTech || matchesJob) {
                          setRealtimeStatus(parsed.status);
                          return;
                        }
                      }
                    }

                    if (activeTech.jobId) {
                      const jobSpecific = localStorage.getItem(`fixmate_job_status_${activeTech.jobId}`);
                      if (jobSpecific) {
                        setRealtimeStatus(jobSpecific);
                        return;
                      }
                    }
                  } catch(err) {}

                  setRealtimeStatus(null);
                };

                updateRealtimeStatus();
                window.addEventListener('fixmate_job_status_updated', updateRealtimeStatus);
                window.addEventListener('storage', updateRealtimeStatus);
                return () => {
                  window.removeEventListener('fixmate_job_status_updated', updateRealtimeStatus);
                  window.removeEventListener('storage', updateRealtimeStatus);
                };
              }, [selectedTechForStatus, activeTech?.id, activeTech?.jobId, activeTech?.name]);

              const effectiveStatus = realtimeStatus || activeTech.status;
              const currentStep = getStepIndex(effectiveStatus);

              return (
                <div className="space-y-4">
                  {/* Stepper Timeline Visual */}
                  <div className="relative mt-6 mb-6">
                    {/* Line Background */}
                    <div className="absolute top-[15px] left-[10%] right-[10%] h-[3px] bg-slate-200 -z-10 rounded-full"></div>
                    {/* Active Line Progress */}
                    <div 
                      className="absolute top-[15px] left-[10%] h-[3px] bg-blue-600 -z-10 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(currentStep / 5) * 80}%` }}
                    ></div>

                    {/* Nodes flex */}
                    <div className="flex justify-between items-start">
                      {stepperSteps.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;
                        const isFuture = idx > currentStep;
                        const hashVal = activeTech.id ? activeTech.id.charCodeAt(0) : 7;

                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 text-center">
                            {/* Circle Node */}
                            <div className="relative flex items-center justify-center">
                              {isActive ? (
                                <>
                                  <span className="absolute w-8 h-8 rounded-full bg-blue-100 border border-blue-300 animate-ping opacity-75"></span>
                                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-black z-10 transition-all duration-300 transform scale-110">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                                  </div>
                                </>
                              ) : isCompleted ? (
                                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs z-10 transition-all duration-300">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 shadow-inner flex items-center justify-center text-slate-400 text-xs z-10 transition-all duration-300">
                                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                </div>
                              )}
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] font-black mt-2.5 transition-colors duration-300 ${
                              isActive ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                            {/* Timestamp */}
                            <span className="text-[8px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                              {isCompleted 
                                ? (idx === 0 ? (activeTech.assignedTimeLabel || '25m ago') : idx === 1 ? (activeTech.acceptedTimeLabel || '12m ago') : `${(currentStep - idx) * 10 + 2}m ago`)
                                : isActive ? 'Active' : 'Pending'
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Step Details Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mt-4 shadow-inner transition-all duration-300 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-[#0A2540] flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${activeTech.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'}`}></span>
                        {stepperSteps[currentStep].title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed">
                      {stepperSteps[currentStep].desc}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Live Activity Stream Layout Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex items-start gap-2 text-slate-700 pt-1">
                <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Live Sector</span>
                  <span className="font-bold text-slate-800">{activeTech.currentLocation || "Kodialbail, Mangaluru"}</span>
                </div>
              </div>

              {activeTech.destination && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Navigation size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Enroute To</span>
                    <span className="font-bold text-slate-800">{activeTech.destination}</span>
                  </div>
                </div>
              )}

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeTech.currentLocation || activeTech.destination || 'Mangaluru')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all pointer-events-auto"
              >
                <Navigation size={13} /> Open in Google Maps
              </a>
            </div>

            {/* Read-Only Footer Note */}
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Activity size={12} className="text-emerald-500" /> GPS Signal Live</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (25%) */}
      <div className="lg:w-1/4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-2xl font-black text-[#0A2540]">Mangaluru Fleet</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1">{liveTechnicians.length} Assigned Jobs Active</p>
        </div>

        {/* Scrollable Lists */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {liveTechnicians.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-semibold text-xs bg-white rounded-xl border border-slate-200/70 shadow-xs">
              <p className="font-bold text-slate-700">No Active Assigned Jobs</p>
              <p className="mt-1 text-[11px]">Jobs will appear here once assigned to a technician.</p>
            </div>
          ) : (
            <>
              {liveTechnicians.filter(t => ['Assigned', 'Accepted', 'On the Way', 'Enroute', 'In Transit'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 ml-2">In-Transit</h4>
                  <div className="space-y-3">
                    {liveTechnicians.filter(t => ['Assigned', 'Accepted', 'On the Way', 'Enroute', 'In Transit'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).map(tech => (
                      <div key={`${tech.id}_${tech.jobId}`} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setSelectedTechForStatus(tech.id)}>
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                                {tech.initials}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-slate-800 leading-tight">{tech.name}</h5>
                              <p className="text-[10px] text-slate-500 font-semibold">{tech.role}</p>
                            </div>
                          </div>
                          {tech.eta && (
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap">
                              {tech.eta}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                          <span>Enroute to {tech.destination}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {liveTechnicians.filter(t => !['Assigned', 'Accepted', 'On the Way', 'Enroute', 'In Transit'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 ml-2">On-Site & In Progress</h4>
                  <div className="space-y-3">
                    {liveTechnicians.filter(t => !['Assigned', 'Accepted', 'On the Way', 'Enroute', 'In Transit'].some(s => (t.status || '').toLowerCase().includes(s.toLowerCase()))).map(tech => (
                      <div key={`${tech.id}_${tech.jobId}`} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setSelectedTechForStatus(tech.id)}>
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                                {tech.initials}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-slate-800 leading-tight">{tech.name}</h5>
                              <p className="text-[10px] text-slate-500 font-semibold">{tech.role}</p>
                            </div>
                          </div>
                          <span className="text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                            {tech.status}
                          </span>
                        </div>
                        {tech.progress !== null && (
                          <div className="mt-4">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${tech.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>Job progress: {tech.progress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
