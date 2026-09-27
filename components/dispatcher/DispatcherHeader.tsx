'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Bell, X } from 'lucide-react';
import StaggeredMenu from '../technician/StaggeredMenu';
import type { NotificationItem } from './useDispatcherState';

interface DispatcherHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dispatcherStatus: string;
  setDispatcherStatus: (status: string) => void;
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  onOpenNewRequest: () => void;
  showToast: (msg: string) => void;
  staggeredMenuItems: Array<{
    label: string;
    ariaLabel: string;
    onClick?: () => void;
    link?: string;
  }>;
  socialItems: Array<{
    label: string;
    onClick?: () => void;
    link?: string;
  }>;
  notifications?: NotificationItem[];
}

export default function DispatcherHeader({
  searchQuery,
  setSearchQuery,
  onOpenNewRequest,
  staggeredMenuItems,
  socialItems,
  notifications = []
}: DispatcherHeaderProps) {
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .dispatcher-menu .sm-panel-header span {
          font-size: 0 !important;
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
        .dispatcher-menu .sm-panel-header span::after {
          content: "Dispatcher Portal" !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #0B2545 !important;
          background-color: #E6F0FA !important;
          padding: 4px 10px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(186, 215, 233, 0.4) !important;
          display: inline-block !important;
        }
      ` }} />

      <header className="sticky top-0 z-40 h-20 w-full bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/" className="flex items-center overflow-visible py-1">
              <img 
                src="/assets/images/logo.png" 
                alt="FixMate Logo" 
                className="h-12 sm:h-14 md:h-15 w-auto object-contain scale-125 origin-left" 
              />
            </Link>

            <span className="inline-flex text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-regalNavy bg-mintCream px-3 py-1 rounded-full border border-powderBlue/40 whitespace-nowrap shadow-2xs">
              Dispatcher Portal
            </span>

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
              className="dispatcher-menu"
            />
          </div>

          <div className="hidden md:block w-72 lg:w-96 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button 
              onClick={onOpenNewRequest}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Request</span>
            </button>

            <button 
              onClick={() => setShowNotificationDrawer(true)}
              className="relative text-slate-500 hover:text-regalNavy transition-colors p-2 rounded-xl hover:bg-slate-100/60"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0A2540]" />
                  <h3 className="text-base font-extrabold text-[#0A2540]">Notification Center</h3>
                </div>
                <button 
                  onClick={() => setShowNotificationDrawer(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400 text-center py-8">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-extrabold text-slate-800">{n.title}</h5>
                        <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowNotificationDrawer(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
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
