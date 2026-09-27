'use client';

import Link from 'next/link';
import { User, LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../../lib/firebase/auth';
import { auth, db } from '../../lib/firebase/firebase';
import NotificationWatcher from "./NotificationWatcher";
import NotificationBell from "./NotificationBell";

import { useEffect, useState } from 'react';

import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

export default function CustomerHeader() {
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('isRead', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificationCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NotificationWatcher />

      <header className="sticky top-0 z-50 h-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/customer"
            className="flex items-center overflow-visible py-1"
          >
            <img
              src="/assets/images/logo.png"
              alt="FixMate Logo"
              className="h-14 sm:h-16 w-auto object-contain scale-125 origin-left transition-transform hover:scale-110"
            />
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              onClick={() => router.push('/customer/notifications')}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
            >
              <Bell size={22} className="text-[#0B2545]" />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-semibold">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => router.push('/customer/profile')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B2545] font-semibold transition"
            >
              <User size={18} />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133A63] text-white font-semibold transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
