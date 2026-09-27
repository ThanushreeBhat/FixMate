'use client';
import Image from 'next/image';
import { Star, ShieldCheck, Wrench, Clock, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onBookService: () => void;
}

export default function HeroSection({ onBookService }: HeroSectionProps) {
  return (
    <section id="home" className="py-20 md:py-24 bg-mintCream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Value Proposition & Call to Action */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white text-regalNavy font-semibold text-xs px-4 py-2 rounded-full border border-powderBlue/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-regalNavy" />
            <span>VERIFIED & INSURED PROFESSIONALS</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-prussianBlue tracking-tight leading-[1.12]">
            Reliable Home Services, <span className="text-regalNavy">Simplified.</span>
          </h1>

          <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            Book background-verified technicians for plumbing, electrical work, AC servicing, carpentry, appliance repair, and home maintenance with upfront pricing and live dispatch tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onBookService}
              className="bg-regalNavy hover:bg-oxfordNavy text-white font-semibold text-base px-8 py-4 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Service
            </button>
            <a 
              href="#services"
              className="bg-white hover:bg-slate-50 text-regalNavy font-semibold text-base px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:scale-[1.02]"
            >
              Explore All Services
            </a>
          </div>

          {/* Social Trust Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200/80">
            <div>
              <h4 className="text-2xl font-black font-heading text-prussianBlue flex items-center gap-1">
                4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Average Rating</p>
            </div>
            <div>
              <h4 className="text-2xl font-black font-heading text-prussianBlue">10k+</h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Jobs Completed</p>
            </div>
            <div>
              <h4 className="text-2xl font-black font-heading text-prussianBlue">100%</h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Vetted Techs</p>
            </div>
            <div>
              <h4 className="text-2xl font-black font-heading text-prussianBlue">24/7</h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Emergency Line</p>
            </div>
          </div>

        </div>

        {/* Right Hero Visual Showcase Collage */}
        <div className="relative h-[460px] flex items-center justify-center">
          <div className="relative w-full h-full">
            
            {/* Main Center-Top Card */}
            <div className="absolute top-2 left-6 w-64 h-48 rounded-2xl overflow-hidden shadow-card border-4 border-white z-10 transition-transform hover:scale-[1.02]">
              <Image src="/assets/images/hero_plumber.png" alt="Verified Plumber" fill className="object-cover" />
            </div>

            {/* Top Right Card */}
            <div className="absolute top-6 right-6 w-48 h-36 rounded-2xl overflow-hidden shadow-card border-4 border-white z-0 transition-transform hover:scale-[1.02]">
              <Image src="/assets/images/hero_handyman.png" alt="Handyman Repair" fill className="object-cover" />
            </div>

            {/* Middle Right Card */}
            <div className="absolute top-40 right-10 w-44 h-44 rounded-2xl overflow-hidden shadow-card border-4 border-white z-20 transition-transform hover:scale-[1.02]">
              <Image src="/assets/images/hero_electrician.png" alt="Certified Electrician" fill className="object-cover" />
            </div>

            {/* Bottom Left Card */}
            <div className="absolute bottom-4 left-10 w-72 h-44 rounded-2xl overflow-hidden shadow-card border-4 border-white z-30 transition-transform hover:scale-[1.02]">
              <Image src="/assets/images/hero_ac_tech.png" alt="AC Technician" fill className="object-cover" />
            </div>

            {/* Quality Shield Badge */}
            <div className="absolute bottom-36 right-4 bg-white p-3 rounded-2xl shadow-card border border-slate-100 flex items-center gap-3 z-40">
              <div className="w-10 h-10 rounded-xl bg-regalNavy text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold font-heading text-prussianBlue block">FixMate Verified</span>
                <span className="text-[10px] text-slate-500 font-medium">Background Checked</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
