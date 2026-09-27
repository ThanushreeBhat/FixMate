'use client';
import { UserCheck, Briefcase, Radio, ShieldCheck } from 'lucide-react';

export default function PortalSection() {
  const portals = [
    {
      role: 'customer',
      title: 'Customer Experience',
      subtitle: 'Homeowner Platform',
      desc: 'Track ongoing service requests, view technician ETA on live maps, and access upfront job invoices.',
      icon: UserCheck,
      badge: 'Homeowners'
    },
    {
      role: 'technician',
      title: 'Technician Hub',
      subtitle: 'Field Operations',
      desc: 'Assigned job checklist, availability duty toggle, emergency request acceptance, and earning metrics.',
      icon: Briefcase,
      badge: 'Technicians'
    },
    {
      role: 'dispatcher',
      title: 'Dispatcher Routing',
      subtitle: 'Internal Operations',
      desc: 'Broadcast emergency requests, optimize technician travel zones, and monitor fleet workload in real-time.',
      icon: Radio,
      badge: 'Operations'
    },
    {
      role: 'admin',
      title: 'Admin Command Center',
      subtitle: 'Enterprise Governance',
      desc: 'Manage service pricing catalogs, verify new technician credentials, and oversee operational health.',
      icon: ShieldCheck,
      badge: 'Enterprise'
    }
  ];

  return (
    <section className="py-20 bg-mintCream">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-regalNavy bg-white px-4 py-1.5 rounded-full border border-powderBlue/40">
            Four Role Ecosystem Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-heading text-prussianBlue tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-sm font-normal text-slate-600 leading-relaxed">
            FixMate connects Homeowners, Verified Field Technicians, Regional Operations Dispatchers, and Enterprise Administrators seamlessly.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((p) => {
            const IconComp = p.icon;
            return (
              <div
                key={p.role}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-mintCream text-regalNavy flex items-center justify-center group-hover:bg-regalNavy group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-regalNavy uppercase tracking-wider block mb-1">
                      {p.subtitle}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-prussianBlue">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed mt-2">
                      {p.desc}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
