'use client';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  AlertTriangle, 
  TrendingUp, 
  User, 
  Home,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface TechDesktopSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  availability: string;
  onToggleAvailability: () => void;
  pendingCount?: number;
  emergencyCount?: number;
  maxDailyCapacity?: number;
  onOpenAuth: (mode: string) => void;
  currentUser?: {
    name?: string;
    specialization?: string;
  } | null;
}

export default function TechDesktopSidebar({ 
  activeTab, 
  setActiveTab, 
  availability, 
  onToggleAvailability,
  pendingCount = 4,
  emergencyCount = 1,
  maxDailyCapacity = 6,
  onOpenAuth,
  currentUser
}: TechDesktopSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, isEmergency: false },
    { id: 'jobs', label: 'Assigned Jobs', icon: Briefcase, badge: pendingCount > 0 ? `${pendingCount}` : null, isEmergency: false },
    { id: 'emergency', label: 'Emergency Alerts', icon: AlertTriangle, badge: emergencyCount > 0 ? 'LIVE' : null, isEmergency: true },
    { id: 'performance', label: 'Earnings & Metrics', icon: TrendingUp, badge: null, isEmergency: false },
    { id: 'profile', label: 'Profile & Settings', icon: User, badge: null, isEmergency: false }
  ];

  const isCapacityFull = pendingCount >= maxDailyCapacity;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 antialiased">
      
      {/* Top Section: Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A2540] to-blue-600 flex items-center justify-center text-white text-base shadow-md">
              🛠️
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#0A2540] tracking-tight leading-none">
                FixMate Pro
              </h1>
              <span className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase mt-1 block">
                Technician Hub
              </span>
            </div>
          </div>
        </div>

        {/* Home Navigation Link */}
        <div className="px-4 pt-3">
          <Link 
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0A2540] hover:bg-slate-100/70 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 mt-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Main Menu
          </span>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                    : item.isEmergency 
                      ? 'text-rose-600 hover:bg-rose-50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600' : item.isEmergency ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.isEmergency 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Duty Status, Capacity Meter & Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        
        {/* Daily Capacity Meter (Issue #10) */}
        <div className="bg-white rounded-xl p-3 border border-slate-200/70 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-600" /> Daily Capacity
            </span>
            <span className={isCapacityFull ? 'text-rose-600 font-extrabold' : 'text-slate-700'}>
              {pendingCount} / {maxDailyCapacity} Jobs
            </span>
          </div>
          
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, (pendingCount / maxDailyCapacity) * 100)}%` }} 
              className={`h-full transition-all duration-300 ${
                isCapacityFull ? 'bg-rose-500' : pendingCount >= 4 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
            />
          </div>

          {isCapacityFull && (
            <span className="text-[9px] font-bold text-rose-600 block text-center">
              ⚠️ Max daily limit reached (Unavailable for new auto-assignments)
            </span>
          )}
        </div>

        {/* Duty Status Selector (Issue #11) */}
        <div className="bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase text-slate-400 block">
              Duty Status
            </span>
            <span className={`text-xs font-bold ${
              availability === 'ONLINE' || availability === 'Available' 
                ? 'text-emerald-600' 
                : availability === 'BUSY' || availability === 'Busy' 
                  ? 'text-amber-600' 
                  : 'text-slate-400'
            }`}>
              ● {availability}
            </span>
          </div>

          <button 
            onClick={onToggleAvailability}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            Switch
          </button>
        </div>

        {/* User Card & Auth */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#134074] text-white flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-extrabold text-[#0A2540] truncate leading-tight">
                {currentUser?.name || "Alex Vance"}
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold truncate">
                {currentUser?.specialization || "Master Plumber"}
              </p>
            </div>
          </div>

          <button 
            onClick={() => onOpenAuth('login')}
            title="Sign In / Switch Account"
            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
}
