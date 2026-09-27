'use client';

import {
  Zap,
  Wrench,
  Wind,
  Refrigerator,
  Hammer,
  Paintbrush,
  Sparkles,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function ServiceGrid() {
  const router = useRouter();

  const services: ServiceItem[] = [
    {
      title: 'Electrical',
      description: 'Wiring, switches, lighting & repairs',
      icon: Zap,
    },
    {
      title: 'Plumbing',
      description: 'Leak repairs, fittings & installations',
      icon: Wrench,
    },
    {
      title: 'AC Repair',
      description: 'Installation, servicing & maintenance',
      icon: Wind,
    },
    {
      title: 'Appliance Repair',
      description: 'TV, Washing Machine, Refrigerator',
      icon: Refrigerator,
    },
    {
      title: 'Carpentry',
      description: 'Furniture assembly & woodwork',
      icon: Hammer,
    },
    {
      title: 'Painting',
      description: 'Interior & exterior painting',
      icon: Paintbrush,
    },
    {
      title: 'Cleaning',
      description: 'Home deep cleaning services',
      icon: Sparkles,
    },
  ];

  const handleServiceClick = (service: string) => {
    router.push(
      `/customer/services?category=${encodeURIComponent(service)}`
    );
  };

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <div
              key={service.title}
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group
              ${
                index === services.length - 1
                  ? 'md:col-span-2 xl:col-start-2 xl:col-span-1'
                  : ''
              }`}
            >
              <div className="p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#0A2540]/10 flex items-center justify-center mb-5">
                  <Icon
                    size={34}
                    className="text-[#0A2540]"
                  />
                </div>

                <h3 className="text-xl font-bold text-[#0A2540]">
                  {service.title}
                </h3>

                <p className="text-slate-600 mt-3 leading-7">
                  {service.description}
                </p>

                <button
                  onClick={() => handleServiceClick(service.title)}
                  className="mt-6 flex items-center gap-2 text-[#0A2540] font-semibold group-hover:gap-3 transition-all"
                >
                  Explore Service
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
