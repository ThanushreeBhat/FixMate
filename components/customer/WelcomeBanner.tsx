'use client';

import { CalendarCheck, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WelcomeBanner() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-[#0A2540] to-[#1B4F8C] rounded-3xl overflow-hidden shadow-xl">
      <div className="px-10 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/10 text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-5">
            <CalendarCheck size={16} />
            Welcome Back
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Professional Home Services
            <br />
            Whenever You Need Them
          </h1>

          <p className="mt-5 text-blue-100 text-lg leading-8">
            Book trusted technicians, track your service requests,
            and get emergency assistance—all from one dashboard.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">

            {/* Book Service Button */}
            <button
              onClick={() => router.push('/customer/servlist')}
              className="bg-white text-[#0A2540] px-7 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Book a Service
            </button>

            {/* Track Requests Button */}
            <button
              onClick={() => router.push('/customer/bookings')}
              className="border border-white text-white px-7 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#0A2540] transition"
            >
              Track Requests
            </button>

          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="hidden lg:flex items-center justify-center w-64 h-64 rounded-full bg-white/10">
          <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center shadow-xl">
            <Wrench size={80} className="text-[#0A2540]" />
          </div>
        </div>

      </div>
    </section>
  );
}
