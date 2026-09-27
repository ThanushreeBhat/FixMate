'use client';
import { MousePointerClick, ShieldCheck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onBookService: () => void;
}

export default function HowItWorksSection({ onBookService }: HowItWorksSectionProps) {
  const steps = [
    {
      step: '01',
      title: 'Select Your Service',
      desc: 'Browse our service catalog with fixed upfront pricing for plumbing, electrical, AC repair, painting, and carpentry.',
      icon: MousePointerClick,
      color: 'bg-regalNavy text-white'
    },
    {
      step: '02',
      title: 'Matched with Verified Tech',
      desc: 'FixMate automatically assigns a background-verified, certified professional working near your neighborhood.',
      icon: ShieldCheck,
      color: 'bg-oxfordNavy text-white'
    },
    {
      step: '03',
      title: 'Live Dispatch Tracking',
      desc: 'Track your assigned technician on a real-time GPS map with arrival status updates and instant communication.',
      icon: MapPin,
      color: 'bg-prussianBlue text-white'
    },
    {
      step: '04',
      title: 'Service & Guarantee',
      desc: 'Job completed with excellence. Pay securely online with our 100% satisfaction re-service guarantee.',
      icon: CheckCircle2,
      color: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-regalNavy bg-mintCream px-4 py-1.5 rounded-full border border-powderBlue/40">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-heading text-prussianBlue tracking-tight">
            How FixMate Works
          </h2>
          <p className="text-sm font-normal text-slate-600 leading-relaxed">
            From initial booking to technician arrival and job completion, we make home maintenance effortless and stress-free.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => {
            const IconComp = s.icon;
            return (
              <div 
                key={s.step}
                className="bg-mintCream/50 rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center font-bold shadow-sm`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-heading text-powderBlue/80">
                      {s.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-prussianBlue">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-powderBlue">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="bg-prussianBlue rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div>
            <h4 className="text-xl font-bold font-heading text-white">Ready to experience effortless home repairs?</h4>
            <p className="text-xs text-slate-300 font-normal mt-1">Book your appointment in less than 2 minutes.</p>
          </div>

          <button
            onClick={onBookService}
            className="bg-white hover:bg-slate-100 text-prussianBlue font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-all hover:scale-[1.02] shrink-0"
          >
            Book Your Service Now
          </button>
        </div>

      </div>
    </section>
  );
}
