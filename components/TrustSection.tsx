'use client';
import Image from 'next/image';
import { ShieldCheck, Tag, MapPin, Award } from 'lucide-react';

export default function TrustSection() {
  return (
    <section id="why-us" className="py-24 bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-regalNavy bg-mintCream px-4 py-1.5 rounded-full border border-powderBlue/40">
            Built On Trust & Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-prussianBlue tracking-tight">
            Why Thousands of Homeowners Choose FixMate
          </h2>
          <p className="text-sm font-normal text-slate-600 leading-relaxed">
            Every detail of FixMate is designed to provide safety, clarity, and peace of mind when inviting professionals into your home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Trust Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-mintCream/60 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-white text-regalNavy flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-prussianBlue mb-2">100% Background Checked</h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Every technician undergoes criminal background verification, identity check, and hands-on skill certification.
              </p>
            </div>

            <div className="bg-mintCream/60 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-white text-regalNavy flex items-center justify-center mb-4 shadow-sm">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-prussianBlue mb-2">Upfront Fixed Pricing</h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                No surprises or hidden fees. See complete cost breakdowns before confirming your service request.
              </p>
            </div>

            <div className="bg-mintCream/60 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-white text-regalNavy flex items-center justify-center mb-4 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-prussianBlue mb-2">Live Dispatch Tracking</h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Follow your assigned technician's location and estimated arrival time directly in real-time.
              </p>
            </div>

            <div className="bg-mintCream/60 rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-card transition-all">
              <div className="w-11 h-11 rounded-xl bg-white text-regalNavy flex items-center justify-center mb-4 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-prussianBlue mb-2">Satisfaction Guarantee</h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                We stand behind our work. If you're not satisfied with the job quality, we will re-service it free of charge.
              </p>
            </div>

          </div>

          {/* Right Image Visual Showcase */}
          <div className="relative rounded-2xl overflow-hidden shadow-card border-4 border-white h-[400px]">
            <Image 
              src="/assets/images/fixmate_app_mockup.png" 
              alt="FixMate Platform Experience" 
              fill
              className="object-cover" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}
