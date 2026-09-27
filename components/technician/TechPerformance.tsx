'use client';

import { 
  Star, 
  DollarSign
} from 'lucide-react';

interface TechPerformanceJob {
  status: string;
  isEmergency?: boolean;
  tag?: string;
  category?: string;
}

interface RatingReview {
  id: string | number;
  customerName?: string;
  customer?: string;
  service: string;
  rating: number;
  review?: string;
  comment?: string;
  date: string;
}

interface TechPerformanceProps {
  jobs?: TechPerformanceJob[];
  currentUser?: { name?: string } | null;
  availability?: string;
  ratingsList?: RatingReview[];
  avgRating?: string;
  positivePercentage?: number;
}

export default function TechPerformance({ 
  jobs = [], 
  currentUser,
  availability = 'Available',
  ratingsList = [],
  avgRating = '4.92'
}: TechPerformanceProps) {
  const jobsCompletedToday = jobs.filter(j => j.status === 'Completed').length;
  const totalJobsCompleted = jobsCompletedToday;
  const emergencyJobsAccepted = jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY' || j.category === 'Emergency') && j.status !== 'Cancelled').length;
  const emergencyJobsCompleted = jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY' || j.category === 'Emergency') && j.status === 'Completed').length;
  const cancellationCount = jobs.filter(j => j.status === 'Cancelled' || j.status === 'CANCELLED' || j.status === 'cancelled' || (typeof j.status === 'string' && j.status.toLowerCase().includes('cancel'))).length;
  
  const totalEarnings = (totalJobsCompleted * 499) + (emergencyJobsCompleted * 200);

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="bg-[#0B2545] rounded-2xl p-8 text-white shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#13315C]">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#134074] text-[#8DA9C4] border border-[#8DA9C4]/30 text-xs font-semibold flex items-center gap-1">
              Performance Overview
            </span>

            {/* Current Duty Availability Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              availability === 'Available' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : availability === 'Busy'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-200 border border-slate-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white" />
              Status: {availability}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {currentUser?.name || 'Technician'}'s Performance
          </h2>
          <p className="text-xs text-[#8DA9C4] font-normal max-w-xl">
            Summary of your completed jobs and rating metrics.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-[10px] font-semibold text-[#8DA9C4] uppercase tracking-wider">Overall Customer Rating</span>
          <div className="text-3xl font-bold text-amber-400 flex items-center justify-center gap-1.5">
            <Star className="w-7 h-7 fill-amber-400 text-amber-400" /> {avgRating}
          </div>
          <p className="text-[11px] font-normal text-slate-200">Based on verified client ratings</p>
        </div>
      </div>

      {/* 5 Dynamic Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Jobs Completed Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed Today</span>
          <h3 className="text-2xl font-bold text-[#0B2545]">{jobsCompletedToday}</h3>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full">
            Updated Today
          </span>
        </div>

        {/* Metric 2: Total Jobs Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Completed</span>
          <h3 className="text-2xl font-bold text-emerald-600">{totalJobsCompleted}</h3>
          <span className="text-[10px] font-semibold text-[#134074] bg-[#EEF4ED] py-0.5 px-2 rounded-full">
            Lifetime Jobs
          </span>
        </div>

        {/* Metric 3: Emergency Jobs Accepted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Emergency Accepted</span>
          <h3 className="text-2xl font-bold text-rose-600">{emergencyJobsAccepted}</h3>
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 py-0.5 px-2 rounded-full">
            Accepted Calls
          </span>
        </div>

        {/* Metric 4: Cancellation Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cancellations</span>
          <h3 className={`text-2xl font-bold ${cancellationCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {cancellationCount}
          </h3>
          <span className={`text-[10px] font-semibold py-0.5 px-2 rounded-full ${
            cancellationCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {cancellationCount > 0 ? 'Cancelled' : '0 Cancelled'}
          </span>
        </div>

        {/* Metric 5: Current Availability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Availability</span>
          <h3 className={`text-xl font-bold truncate ${
            availability === 'Available' ? 'text-emerald-600' : availability === 'Busy' ? 'text-amber-600' : 'text-slate-500'
          }`}>
            {availability}
          </h3>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 py-0.5 px-2 rounded-full">
            Active
          </span>
        </div>

      </div>

      {/* Two Column Grid: Rating Reviews & Payout Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Reviews (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0B2545]">Customer Feedback & Ratings</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Recent reviews from completed service requests</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF4ED] text-[#134074] text-xs font-semibold">
                Verified Reviews
              </span>
            </div>

            <div className="space-y-4">
              {ratingsList.length === 0 ? (
                <div className="text-center py-12 px-4 bg-[#EEF4ED]/30 rounded-2xl border border-dashed border-slate-200/80 text-xs font-normal text-slate-400">
                  No customer reviews yet.
                </div>
              ) : (
                ratingsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#EEF4ED]/30 border border-slate-100 space-y-2 hover:bg-white hover:shadow-xs transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0B2545]">{rev.customerName || rev.customer}</span>
                        <span className="text-[10px] text-slate-400 font-normal">• {rev.service}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-normal italic">"{rev.review || rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 font-semibold block text-right">{rev.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Monthly Payout Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Monthly Payout Summary</h4>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-2xl font-bold text-[#0B2545]">₹{totalEarnings.toLocaleString()}</span>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Approved for Next Cycle Payout</p>
            </div>

            <div className="space-y-2 text-xs font-normal text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Completed Job Rates ({totalJobsCompleted})</span>
                <span>₹{(totalJobsCompleted * 499).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Bonus Pay ({emergencyJobsCompleted})</span>
                <span className="text-emerald-600 font-semibold">+₹{(emergencyJobsCompleted * 200).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
