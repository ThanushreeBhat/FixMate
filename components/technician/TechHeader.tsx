'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  ChevronDown, 
  X
} from 'lucide-react';
import StaggeredMenu from './StaggeredMenu';

interface TechNotification {
  id: string | number;
  title: string;
  message: string;
  time: string;
}

interface TechHeaderProps {
  title?: string;
  availability: string;
  onToggleAvailability: (statusKey?: string) => void;
  notifications?: TechNotification[];
  onTriggerEmergency?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  currentUser?: {
    name?: string;
    specialization?: string;
  } | null;
  onLogout?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onOpenAuth?: (mode: string) => void;
}

export default function TechHeader({ 
  title, 
  availability, 
  onToggleAvailability, 
  notifications = [], 
  onTriggerEmergency,
  activeTab = 'dashboard',
  setActiveTab,
  currentUser,
  onLogout
}: TechHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const staggeredMenuItems = [
    { 
      label: 'Dashboard', 
      ariaLabel: 'Technician Dashboard', 
      onClick: () => setActiveTab && setActiveTab('dashboard') 
    },
    { 
      label: 'Assigned Jobs', 
      ariaLabel: 'View assigned jobs', 
      onClick: () => setActiveTab && setActiveTab('jobs') 
    },
    { 
      label: 'Emergency Duty', 
      ariaLabel: 'Emergency broadcasts', 
      onClick: () => setActiveTab && setActiveTab('emergency') 
    },
    { 
      label: 'Performance', 
      ariaLabel: 'Earnings and ratings', 
      onClick: () => setActiveTab && setActiveTab('performance') 
    },
    { 
      label: 'Profile & Settings', 
      ariaLabel: 'Technician profile', 
      onClick: () => setActiveTab && setActiveTab('profile') 
    },
    { 
      label: 'Home', 
      ariaLabel: 'Return to home landing page', 
      link: '/' 
    },
    {
      label: 'Log Out',
      ariaLabel: 'Log out of technician account',
      onClick: () => onLogout && onLogout()
    }
  ];

  const socialItems = [
    { label: 'Emergency Alert', onClick: onTriggerEmergency },
    { label: 'Home', link: '/' }
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 h-20 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60' 
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-4">
          
          {/* Left Elements Order: 1. Logo -> 2. Technician Portal Badge -> 3. StaggeredMenu Button */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            
            {/* 1. Brand Logo Image (Zoomed) */}
            <Link href="/" className="flex items-center overflow-visible py-1">
              <img 
                src="/assets/images/logo.png" 
                alt="FixMate Logo" 
                className="h-12 sm:h-14 md:h-15 w-auto object-contain scale-125 origin-left" 
              />
            </Link>

            {/* 2. Technician Portal Badge */}
            <span className="inline-flex text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-regalNavy bg-mintCream px-3 py-1 rounded-full border border-powderBlue/40 whitespace-nowrap shadow-2xs">
              Technician Portal
            </span>

            {/* 3. StaggeredMenu toggle button (Menu option opening on the left) */}
            <StaggeredMenu
              position="left"
              items={staggeredMenuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              colors={['#134074', '#13315C', '#0B2545']}
              logoUrl="/assets/images/logo.png"
              menuButtonColor="#134074"
              openMenuButtonColor="#134074"
              accentColor="#134074"
              changeMenuColorOnOpen={true}
            />

          </div>

          {/* Right Action Tools: Duty Status & Notification Center */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* 1. Duty Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B2545] bg-white hover:bg-[#EEF4ED]/50 transition-all shadow-xs whitespace-nowrap"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${
                  availability === 'ONLINE' || availability === 'Available'
                    ? 'bg-emerald-500' 
                    : availability === 'BUSY' || availability === 'Busy'
                      ? 'bg-amber-500' 
                      : 'bg-slate-400'
                }`}></span>
                <span className="hidden sm:inline">Duty: {availability}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200/80 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {[
                    { label: 'Available', statusKey: 'ONLINE', color: 'bg-emerald-500' },
                    { label: 'Busy', statusKey: 'BUSY', color: 'bg-amber-500' },
                    { label: 'Offline', statusKey: 'OFFLINE', color: 'bg-slate-400' }
                  ].map((st) => (
                    <button
                      key={st.label}
                      onClick={() => {
                        onToggleAvailability(st.statusKey);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0B2545] hover:bg-[#EEF4ED]/60 flex items-center gap-2.5"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`}></span>
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Notification Center Bell Icon */}
            <button 
              onClick={() => setShowNotificationDrawer(true)}
              className="relative text-slate-600 hover:text-[#134074] transition-colors p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-[#EEF4ED]/50 shadow-xs flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#0B2545]" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  {notifications.length}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Technician Notification Drawer */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200/80">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#134074]" />
                  <h3 className="text-base font-bold text-[#0B2545]">Notification Center</h3>
                </div>
                <button 
                  onClick={() => setShowNotificationDrawer(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400 text-center py-12">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-[#EEF4ED]/50 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-bold text-[#0B2545]">{n.title}</h5>
                        <span className="text-[10px] font-semibold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-normal">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowNotificationDrawer(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors text-center"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
