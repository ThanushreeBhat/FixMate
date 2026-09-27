'use client';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    { title: 'Rigorous Background Checks', desc: 'Every technician undergoes national identity verification and criminal record screening before joining.', icon: ShieldCheck },
    { title: 'Transparent Upfront Pricing', desc: 'We eliminate price haggling. You receive clear fixed estimates prior to service execution.', icon: Award },
    { title: 'Home Safety Guarantee', desc: 'Full liability insurance coverage and a 100% satisfaction re-service pledge on every job.', icon: HeartHandshake },
    { title: 'Certified Master Techs', desc: 'Our technicians average 6+ years of field experience across plumbing, electrical, and HVAC.', icon: Users },
  ];

  return (
    <section id="about" className="py-24 bg-mintCream border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-regalNavy bg-white px-4 py-1.5 rounded-full border border-powderBlue/40">
            Our Mission & Commitment
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-heading text-prussianBlue tracking-tight">
            About FixMate
          </h2>
          <p className="text-sm font-normal text-slate-600 leading-relaxed">
            FixMate was built to solve a single fundamental question: "Would a family trust this company to send someone into their home?"
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Story & Pillars */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold font-heading text-prussianBlue tracking-tight">
              Reinventing Home Maintenance with Integrity, Transparency, and Respect
            </h3>

            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Founded with the vision of modernizing neighborhood home services, FixMate brings together certified professionals and homeowners through seamless technology. We prioritize safety, craftsmanship, and honest pricing above everything else.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((p) => {
                const IconC = p.icon;
                return (
                  <div key={p.title} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-mintCream text-regalNavy flex items-center justify-center font-bold">
                      <IconC className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold font-heading text-prussianBlue">{p.title}</h4>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image Feature Box */}
          <div className="relative rounded-2xl overflow-hidden shadow-card border-4 border-white h-[440px]">
            <Image 
              src="/assets/images/hero_handyman.png" 
              alt="FixMate Certified Professional" 
              fill
              className="object-cover" 
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>The FixMate Quality Pledge</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                "We treat your home with the same care and respect as our own. Guaranteed quality, every time."
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
