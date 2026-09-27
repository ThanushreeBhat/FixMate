'use client';

import React from 'react';
import { 
  ClipboardList, 
  RefreshCw, 
  Server, 
  Flame, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import type { DispatchItem, TechnicianItem, RequestItem, ActivityItem } from './useDispatcherState';

interface DashboardTabProps {
  totalRequestsCount: number;
  activeJobsCount: number;
  pendingEmergenciesCount: number;
  dispatches: DispatchItem[];
  technicians: TechnicianItem[];
  filteredActivities?: ActivityItem[];
  handleOpenAssign: (dispatch: DispatchItem) => void;
  setIsMapExpanded: (expanded: boolean) => void;
  showToast: (msg: string) => void;
  emergencyRequests?: RequestItem[];
  requests?: RequestItem[];
}

export default function DashboardTab({
  totalRequestsCount,
  activeJobsCount,
  pendingEmergenciesCount,
  dispatches,
  technicians,
  handleOpenAssign,
  setIsMapExpanded,
  showToast,
  emergencyRequests = [],
  requests = []
}: DashboardTabProps) {
  const sortedDispatches = React.useMemo(() => {
    const emergencyIds = new Set(emergencyRequests.map(r => r.id));
    const seenKeys = new Set();
    const result: DispatchItem[] = [];

    for (const d of dispatches) {
      if (!d) continue;
      if (d.isEmergency || emergencyIds.has(d.id) || (d.jobId && emergencyIds.has(d.jobId))) continue;
      const s = (d.status || '').toUpperCase();
      if (s === 'ASSIGNED' || s.includes('ASSIGN') || s.includes('COMPLET')) continue;

      const key = d.jobId || d.reqId || d.id;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      result.push(d);
    }

    result.sort((a, b) => {
      const aUrgent = (a.priority && a.priority.includes('10')) || a.type === 'URGENT';
      const bUrgent = (b.priority && b.priority.includes('10')) || b.type === 'URGENT';
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      return 0;
    });

    return result;
  }, [dispatches, emergencyRequests]);

  const techniciansOnlineCount = React.useMemo(() => {
    return technicians.filter(tech => tech.status && tech.status.toLowerCase() !== 'offline').length;
  }, [technicians]);

  const capacityPercentage = React.useMemo(() => {
    const onlineTechs = technicians.filter(tech => tech.status && tech.status.toLowerCase() !== 'offline');
    if (onlineTechs.length === 0) return 0;
    const busyTechs = onlineTechs.filter(tech => tech.status === 'Busy').length;
    return Math.round((busyTechs / onlineTechs.length) * 100);
  }, [technicians]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
            <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">{totalRequestsCount.toLocaleString()}</h3>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
              +12%
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <ClipboardList size={18} />
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</span>
            <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">{activeJobsCount}</h3>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-50 text-slate-650 flex items-center gap-0.5">
              Steady
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <RefreshCw size={16} className="animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technicians Online</span>
            <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">
              {techniciansOnlineCount < 10 ? `0${techniciansOnlineCount}` : techniciansOnlineCount}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
              {capacityPercentage}% Capacity
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Server size={18} />
            </div>
          </div>
        </div>

        {/* Stat 4 - EMERGENCY RED CARD */}
        <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} className="animate-bounce" />
              Pending Emergency
            </span>
            <h3 className="text-3xl font-black text-red-600 mt-1">
              {pendingEmergenciesCount < 10 ? `0${pendingEmergenciesCount}` : pendingEmergenciesCount}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200">
              High Priority
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <AlertCircle size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* Emergency Broadcasts Box (Full Screen Width) */}
      <div className="bg-white border-2 border-red-500 rounded-2xl shadow-md overflow-hidden animate-in fade-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
          <div>
            <h4 className="text-base font-extrabold text-red-700 flex items-center gap-1.5 animate-pulse">
              🚨 Emergency Broadcasts
            </h4>
            <p className="text-xs text-slate-500 font-semibold">Unassigned emergency calls</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
            {emergencyRequests.length} Live
          </span>
        </div>

        <div className="p-6 space-y-4">
          {emergencyRequests.length === 0 ? (
            <div className="text-center py-8 text-sm font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              🎉 No pending emergency calls!
            </div>
          ) : (
            emergencyRequests.map((req) => (
              <div 
                key={req.id} 
                className="p-5 rounded-2xl border border-red-100 bg-red-50/10 hover:border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm bg-red-50 text-red-600 border border-red-100 font-bold">
                    {req.icon || '🚨'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-extrabold text-slate-800 text-sm">{req.customer}</h5>
                      <span className="text-[10px] font-bold text-red-500 bg-white px-2 py-0.5 rounded border border-red-200 uppercase tracking-wider">
                        {req.id.startsWith('#') ? req.id : '#' + req.id.substring(0, 7).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {req.location} • <span className="font-extrabold text-red-600">Emergency</span>
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap mt-2.5">
                      <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {req.service.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-end gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenAssign({
                      id: req.id,
                      reqId: req.id,
                      title: `${req.service} request`,
                      time: 'Just now',
                      address: req.location,
                      priority: 'Priority Level 10',
                      category: req.service.toUpperCase(),
                      type: 'URGENT',
                      icon: req.icon,
                      isEmergency: true,
                      collectionName: req.collectionName,
                      customerName: req.customer,
                      description: req.description,
                      notes: req.notes,
                      requestPreviousTechnician: Boolean(req.requestPreviousTechnician),
                      techSpecialty: req.service,
                      cancelledBy: req.cancelledBy,
                      cancelledTechName: req.cancelledTechName,
                      cancelledTechs: req.cancelledTechs,
                      technicianName: (req.assignedTech && req.assignedTech !== req.customer) ? req.assignedTech : (req.cancelledTechName || req.cancelledBy || null)
                    })}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                  >
                    Assign Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Urgent Broadcasts Box (Full Screen Width) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-[#0A2540]">Urgent Broadcasts</h4>
            <p className="text-xs text-slate-400 font-medium">Unassigned emergency service calls</p>
          </div>
          <button 
            onClick={() => showToast('View all unassigned jobs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="p-6 space-y-4">
          {sortedDispatches.length === 0 ? (
            <div className="text-center py-8 text-sm font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              🎉 All urgent broadcasts assigned!
            </div>
          ) : (
            sortedDispatches.map((disp) => {
              const targetReq = (requests || []).find(r => 
                (r.id && (r.id === disp.id || r.id === disp.reqId || r.id === disp.jobId))
              );
              const categoryStr = `${targetReq?.service || ''} ${disp.category || ''} ${disp.techSpecialty || ''} ${disp.service || ''} ${disp.serviceName || ''} ${disp.title || ''} ${disp.description || ''}`.toLowerCase();
              
              let trade = '';
              let badge = 'PLUMBING';
              if (categoryStr.includes('carpen')) { trade = 'Carpentry'; badge = 'CARPENTRY'; }
              else if (categoryStr.includes('plumb')) { trade = 'Plumbing'; badge = 'PLUMBING'; }
              else if (categoryStr.includes('elect')) { trade = 'Electrical'; badge = 'ELECTRICAL'; }
              else if (categoryStr.includes('ac ') || categoryStr.includes('ac_') || categoryStr.includes('hvac') || categoryStr.includes('air conditioning') || categoryStr.includes('maintenance')) { trade = 'AC Maintenance'; badge = 'AC REPAIR'; }
              else if (categoryStr.includes('clean')) { trade = 'Cleaning'; badge = 'HOME CLEANING'; }
              else if (categoryStr.includes('appliance') || categoryStr.includes('microwave') || categoryStr.includes('fridge') || categoryStr.includes('washing')) { trade = 'Appliance Repair'; badge = 'APPLIANCE'; }
              else if (categoryStr.includes('paint')) { trade = 'Painting'; badge = 'PAINTING'; }
              else if (categoryStr.includes('pest')) { trade = 'Pest Control'; badge = 'PEST CONTROL'; }
              else {
                let clean = String(disp.service || disp.category || disp.title || 'Plumbing')
                  .replace(/MID-SERVICE CANCELLATION REQUEST/gi, '')
                  .replace(/CANCELLATION REQUEST/gi, '')
                  .replace(/EMERGENCY/gi, '')
                  .replace(/URGENT/gi, '')
                  .replace(/-?\s*#[A-Za-z0-9]+/g, '')
                  .replace(/[-–—🚨⚡]/g, '')
                  .trim();
                if (clean && clean.toLowerCase() !== 'service' && clean.toLowerCase() !== 'service request') {
                  trade = clean.charAt(0).toUpperCase() + clean.slice(1);
                  badge = clean.toUpperCase();
                } else {
                  trade = 'Plumbing';
                  badge = 'PLUMBING';
                }
              }

              return (
                <div 
                  key={disp.id} 
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${disp.colorClass}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm ${disp.iconBg}`}>
                      {disp.icon || '🚨'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-extrabold text-slate-800 text-sm">
                          🚨 {trade} Request
                        </h5>
                        <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                          {disp.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        {disp.address}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap mt-2.5">
                        <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {badge}
                        </span>
                        <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {disp.type || 'URGENT'}
                        </span>
                        {disp.recommendedTech && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-700 border border-blue-200 flex items-center gap-1">
                            ⭐ Recommended Match: {disp.recommendedTech} ({disp.distance})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                    {disp.price && (
                      <span className="text-sm font-black text-emerald-600">
                        ₹{disp.price}
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenAssign({
                        ...disp,
                        category: trade.toUpperCase(),
                        service: trade,
                        techSpecialty: trade
                      })}
                      className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
                    >
                      Assign Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID MAIN SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & MIDDLE (Col Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Technician Workload Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-extrabold text-[#0A2540]">Technician Workload</h4>
                <p className="text-xs text-slate-400 font-medium">Real-time task distribution across fleet</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                  <span>Assigned</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-[#93C5FD]"></span>
                  <span>Travel</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Visual */}
            <div className="flex items-end justify-between h-52 pt-8 px-6 border-b border-slate-100">
              {technicians.map((tech) => {
                const maxVal = 10;
                const assignedHeight = `${(tech.assigned / maxVal) * 100}%`;
                const travelHeight = `${((tech.travel || 0) / maxVal) * 100}%`;
                const isOff = tech.status === 'Offline';
                
                return (
                  <div key={tech.name} className="flex flex-col items-center gap-2 group w-16 relative">
                    <div className="relative w-8 h-36 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex flex-col justify-end">
                      {isOff ? (
                        <div className="absolute inset-0 bg-slate-200/40 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest rotate-90">OFF</span>
                        </div>
                      ) : (
                        <>
                          <div 
                            style={{ height: travelHeight }}
                            className="w-full bg-[#93C5FD] hover:bg-[#60A5FA] transition-all duration-300 cursor-pointer"
                            title={`Travel: ${tech.travel || 0}`}
                          />
                          <div 
                            style={{ height: assignedHeight }}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                            title={`Assigned: ${tech.assigned}`}
                          />
                        </>
                      )}

                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-[#0A2540] text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-30">
                        <p className="font-extrabold text-white border-b border-white/10 pb-1 mb-1">{tech.name} ({tech.specialty})</p>
                        <p className="text-slate-300 font-semibold">📍 Zone: {tech.zone}</p>
                        <p className="text-blue-300 font-semibold">⚡ Assigned Jobs: {tech.assigned}</p>
                        <p className="text-[#93C5FD] font-semibold">🚙 Transit Runs: {tech.travel || 0}</p>
                        <p className={`mt-1 font-bold ${tech.status === 'Online' ? 'text-emerald-400' : 'text-slate-400'}`}>● {tech.status}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-700">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Col Span 1) */}
        <div className="space-y-8">
          
          {/* MINI MAP CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 overflow-hidden group">
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-105 border border-slate-200 shadow-inner flex items-center justify-center">
              
              <div className="absolute inset-0 bg-cover opacity-90 transition-transform duration-500 group-hover:scale-105" 
                   style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-87.6298,41.8781,11,0/400x250?access_token=mock')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="w-full h-full bg-sky-50 relative flex items-center justify-center">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <path d="M50 40 Q 150 20 220 80" fill="none" stroke="#60A5FA" strokeWidth="3" strokeDasharray="5,5" />
                    <path d="M120 130 Q 180 80 220 80" fill="none" stroke="#3B82F6" strokeWidth="4" />
                    
                    <circle cx="50" cy="40" r="7" fill="#10B981" stroke="white" strokeWidth="2" />
                    <circle cx="120" cy="130" r="7" fill="#3B82F6" stroke="white" strokeWidth="2" />
                    
                    <circle cx="220" cy="80" r="8" fill="#EF4444" stroke="white" strokeWidth="2" />
                    <circle cx="220" cy="80" r="16" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '220px 80px' }} />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-[#0A2540]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                <button
                  onClick={() => setIsMapExpanded(true)}
                  className="px-4 py-2 bg-white text-[#0A2540] text-xs font-bold rounded-lg shadow-xl flex items-center gap-1.5 transition-transform duration-200 hover:scale-105"
                >
                  <ExternalLink size={12} />
                  <span>Expand Fleet Map</span>
                </button>
              </div>

              <div className="absolute bottom-2.5 left-2.5 bg-[#0A2540] text-white text-[9px] font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                Chicago Fleet Grid
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
