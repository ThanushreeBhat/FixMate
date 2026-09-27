'use client';
import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  Zap, 
  Activity, 
  Award,
  Layers
} from 'lucide-react';

interface PortalItem {
  service?: string;
  customer?: string;
  zone?: string;
  address?: string;
  date?: string;
  techCount?: number;
  price?: string | number;
  cost?: string | number;
  status?: string;
}

interface PortalData {
  title?: string;
  technicianName?: string;
  role?: string;
  activeBooking?: { status?: string };
  assignedJobs?: PortalItem[];
  history?: PortalItem[];
  routes?: PortalItem[];
  [key: string]: any;
}

interface PortalModalProps {
  isOpen: boolean;
  initialRole?: string;
  onClose: () => void;
}

export default function PortalModal({ isOpen, initialRole, onClose }: PortalModalProps) {
  const [activeRole, setActiveRole] = useState<string>(initialRole || 'admin');
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialRole) setActiveRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/portals/${activeRole}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portal) {
          setPortalData(data.portal);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isOpen, activeRole]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#0A2540] px-7 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                FixMate Enterprise Console
              </h3>
              <p className="text-xs text-slate-300">Urban Company Style Operations & Analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-300 hover:text-white transition-colors">&times;</button>
        </div>

        {/* Role Navigation Tabs */}
        <div className="bg-slate-100/80 px-7 py-3 border-b border-slate-200 flex gap-2 overflow-x-auto">
          {[
            { id: 'admin', label: 'Admin Command Center' },
            { id: 'customer', label: 'Customer Portal' },
            { id: 'technician', label: 'Technician Hub' },
            { id: 'dispatcher', label: 'Dispatcher Routing' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeRole === r.id 
                  ? 'bg-[#0A2540] text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 bg-slate-50/50 flex-grow">
          {loading ? (
            <div className="text-center py-16 text-sm font-bold text-slate-500 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading Enterprise Dashboard...</span>
            </div>
          ) : activeRole === 'admin' ? (
            /* Premium Urban Company Admin Dashboard View */
            <div className="space-y-6">
              
              {/* Top Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><TrendingUp className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-[#0A2540]">₹28,45,000</div>
                  <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Technicians</span>
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-[#0A2540]">1,482</div>
                  <div className="mt-2 text-xs font-semibold text-slate-500">
                    🟢 1,120 Currently On Duty
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-rose-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Emergencies</span>
                    <span className="p-2 rounded-lg bg-rose-50 text-rose-600"><ShieldAlert className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-rose-600">14</div>
                  <div className="mt-2 text-xs font-bold text-rose-600">
                    High Priority Action Needed
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Rating</span>
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-500"><Star className="w-4 h-4 fill-amber-400" /></span>
                  </div>
                  <div className="text-2xl font-black text-[#0A2540]">4.88 / 5</div>
                  <div className="mt-2 text-xs font-semibold text-slate-500">
                    Based on 15.4k+ Reviews
                  </div>
                </div>
              </div>

              {/* Jobs Completed vs Target Section (Void Space Filled Premium Grid) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0A2540]">Jobs Completed vs Monthly Target</h4>
                    <p className="text-xs text-slate-500">Real-time completion metrics across all operational zones</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0A2540]"></span> Actual (12,450)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Target (15,000)</span>
                  </div>
                </div>

                {/* Urban Company Style Monthly Progress Bars & Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Bar Visualizer */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#0A2540]">Overall Completion Target</span>
                        <span className="text-blue-600">83% Achieved</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[83%] shadow-sm"></div>
                      </div>
                    </div>

                    {/* Zone Progress Breakdowns */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 mb-1">Mumbai Metro</div>
                        <div className="text-base font-extrabold text-[#0A2540]">4,250 Jobs</div>
                        <div className="text-[11px] font-semibold text-emerald-600">92% of target</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 mb-1">Delhi NCR</div>
                        <div className="text-base font-extrabold text-[#0A2540]">3,890 Jobs</div>
                        <div className="text-[11px] font-semibold text-emerald-600">86% of target</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 mb-1">Bengaluru</div>
                        <div className="text-base font-extrabold text-[#0A2540]">2,610 Jobs</div>
                        <div className="text-[11px] font-semibold text-emerald-600">79% of target</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 mb-1">Hyderabad</div>
                        <div className="text-base font-extrabold text-[#0A2540]">1,700 Jobs</div>
                        <div className="text-[11px] font-semibold text-emerald-600">75% of target</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Highlights Card */}
                  <div className="bg-gradient-to-br from-[#0A2540] to-[#13395F] text-white p-5 rounded-xl flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                        <Award className="w-4 h-4 text-amber-400" /> Top Performer Zone
                      </div>
                      <div className="text-xl font-black mb-1">Mumbai Central</div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Technician arrival time reduced to an average of 14 minutes. Customer satisfaction rate at 99.1%.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold">
                      <span>Dispatch Efficiency</span>
                      <span className="text-emerald-400 font-bold">98.4%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Real-time Activity Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="text-base font-extrabold text-[#0A2540] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" /> Live Operational Stream
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-[#0A2540]">New Technician Verified</div>
                        <div className="text-slate-500">Rajesh Sharma (Plumbing Specialist) added to Mumbai North.</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">2 mins ago</div>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-[#0A2540]">Emergency Dispatch Resolved</div>
                        <div className="text-slate-500">Water pipe burst repair completed in 28 mins.</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">14 mins ago</div>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-[#0A2540]">High Demand Spike</div>
                        <div className="text-slate-500">AC service requests increased by 34% in Delhi NCR.</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">45 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enterprise Quick Controls */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="text-base font-extrabold text-[#0A2540] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" /> Quick Administrative Actions
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-xs font-bold text-[#0A2540] flex justify-between items-center transition-all">
                      <span>Verify & Onboard Technicians</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-xs font-bold text-[#0A2540] flex justify-between items-center transition-all">
                      <span>Generate Monthly Financial Report</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-xs font-bold text-[#0A2540] flex justify-between items-center transition-all">
                      <span>Broadcast Global Notification</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* General Role View */
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-lg font-extrabold text-[#0A2540]">{portalData?.title || activeRole}</h4>
                  <p className="text-xs text-slate-500">{portalData?.technicianName || portalData?.role}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {portalData?.activeBooking?.status || 'Operational'}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Portal Data</div>
              <div className="space-y-2.5">
                {(portalData?.assignedJobs || portalData?.history || portalData?.routes || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-[#0A2540]">{item.service || item.customer || item.zone}</div>
                      <div className="text-xs text-slate-500">{item.address || item.date || item.techCount + ' Technicians'} • {item.price || item.cost || item.status}</div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-600">
                      {item.status || 'Verified'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
