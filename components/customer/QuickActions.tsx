'use client';

import { CalendarPlus, ClipboardList, Siren, UserCircle, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

export default function QuickActions() {
  const router = useRouter();

  const actions: QuickActionItem[] = [
    {
      title: 'Book Service',
      description: 'Schedule a repair service',
      icon: CalendarPlus,
      color: 'bg-blue-100 text-blue-600',
      path: '/customer/servlist',
    },
    {
      title: 'Track Requests',
      description: 'View your ongoing services',
      icon: ClipboardList,
      color: 'bg-green-100 text-green-600',
      path: '/customer/bookings',
    },
    {
      title: 'Emergency',
      description: 'Immediate assistance',
      icon: Siren,
      color: 'bg-red-100 text-red-600',
      path: '/customer/emergency',
    },
    {
      title: 'My Profile',
      description: 'Manage account settings',
      icon: UserCircle,
      color: 'bg-yellow-100 text-yellow-600',
      path: '/customer/profile',
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => router.push(action.path)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left border border-slate-200 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${action.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#0A2540]">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
