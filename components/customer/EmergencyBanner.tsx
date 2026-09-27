'use client';

import { Siren, PhoneCall, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmergencyBanner() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl shadow-xl overflow-hidden">
      <div className="px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
            <Siren size={42} className="text-white" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">
              Need Emergency Assistance?
            </h2>

            <p className="text-red-100 mt-3 max-w-2xl leading-7">
              Request an emergency technician for urgent electrical,
              plumbing, appliance, or other repair issues. Our team
              will prioritize your request immediately.
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => router.push('/customer/emergency')}
            className="flex items-center gap-2 bg-white text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowRight size={18} />
            Request Emergency Service
          </button>

          <button
            className="flex items-center gap-2 border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-red-600 transition"
          >
            <PhoneCall size={18} />
            Call Support
          </button>
        </div>
      </div>
    </section>
  );
}
