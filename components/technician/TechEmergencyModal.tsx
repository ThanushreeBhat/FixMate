'use client';
import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Lock, ChevronLeft, ChevronRight, X, ShieldAlert } from 'lucide-react';

export interface EmergencyJob {
  id: string;
  title?: string;
  category?: string;
  distance?: string;
  price?: number | string;
  location?: string;
  address?: string;
  description?: string;
  notes?: string;
  customerNote?: string;
  customerName?: string;
  customerPhone?: string;
  isEmergency?: boolean;
  status?: string;
}

interface TechEmergencyModalProps {
  isOpen: boolean;
  emergencyList?: EmergencyJob[];
  emergencyJob?: EmergencyJob | null;
  onAccept?: (job: EmergencyJob) => void;
  onDecline?: () => void;
}

export default function TechEmergencyModal({ 
  isOpen, 
  emergencyList = [], 
  emergencyJob, 
  onAccept, 
  onDecline 
}: TechEmergencyModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setDismissedIds([]);
      setCurrentIndex(0);
      setIsLocked(false);
      setIsAccepting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rawJobsArray = Array.isArray(emergencyList) && emergencyList.length > 0 
    ? emergencyList 
    : emergencyJob ? [emergencyJob] : [];

  const jobsArray = rawJobsArray.filter(j => !dismissedIds.includes(j.id));

  if (jobsArray.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-slate-200/60 relative text-center space-y-6">
          
          <button 
            onClick={onDecline}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#EEF4ED] text-[#134074] flex items-center justify-center mx-auto text-2xl border border-slate-200/60">
            <ShieldAlert className="w-7 h-7 text-[#134074]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-[#EEF4ED] px-3 py-1 rounded-full border border-slate-200/60">
              EMERGENCY BROADCAST STATUS
            </span>
            <h3 className="text-xl font-bold text-[#0B2545] tracking-tight">No Emergency Broadcasts Available</h3>
            <p className="text-xs font-normal text-slate-500 max-w-xs mx-auto leading-relaxed mt-1">
              All clear! There are currently no active or unassigned emergency service calls in your zone (Mangaluru Region).
            </p>
          </div>

          <button
            onClick={onDecline}
            className="w-full py-3 bg-[#134074] hover:bg-[#13315C] text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
          >
            Close Emergency Panel
          </button>

        </div>
      </div>
    );
  }

  const activeIndex = Math.min(currentIndex, jobsArray.length - 1);
  const currentJob = jobsArray[activeIndex] || jobsArray[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : jobsArray.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < jobsArray.length - 1 ? prev + 1 : 0));
  };

  const handleDeclineClick = () => {
    const remaining = jobsArray.filter(j => j.id !== currentJob.id);
    setDismissedIds(prev => [...prev, currentJob.id]);

    if (remaining.length === 0) {
      if (onDecline) onDecline();
    } else {
      setCurrentIndex(prev => (prev < remaining.length ? prev : 0));
    }
  };

  const handleAcceptClick = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      setIsLocked(true);
      if (onAccept) onAccept(currentJob);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl border border-rose-200 relative overflow-hidden space-y-6">
        
        {/* Pulsing Emergency Header Banner */}
        <div className="bg-rose-600 -mx-8 -mt-8 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-200 block">
                Emergency Request
              </span>
              <h3 className="text-lg font-bold tracking-tight">{currentJob.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-600 text-xs font-bold">
              LIVE
            </span>
            <button 
              onClick={handleDeclineClick}
              className="w-8 h-8 rounded-full bg-rose-700/60 hover:bg-rose-800 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Indicator */}
        {jobsArray.length > 1 && (
          <div className="flex items-center justify-between bg-rose-50/60 p-2.5 rounded-2xl border border-rose-200/80">
            <button 
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-700 font-semibold transition-colors shadow-xs flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Emergency Request {activeIndex + 1} of {jobsArray.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-700 font-semibold transition-colors shadow-xs flex items-center gap-1 text-xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Issue Details Box */}
        <div className="space-y-3 bg-rose-50/30 p-5 rounded-2xl border border-rose-100 text-xs font-normal text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-medium text-slate-500">Service Category</span>
            <span className="font-bold text-rose-600">{currentJob.category || "Emergency Plumbing"}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-medium text-slate-500">Proximity Distance</span>
            <span className="font-bold text-[#0B2545]">{currentJob.distance || "1.2 km away"}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-medium text-slate-500">Fixed Compensation</span>
            <span className="font-bold text-emerald-600 text-sm">₹{Number(currentJob.price || 1499).toFixed(2)}</span>
          </div>

          <div className="pt-1">
            <span className="font-medium text-slate-500 block mb-1">Customer Address</span>
            <p className="font-semibold text-slate-800 flex items-start gap-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{currentJob.location || currentJob.address}</span>
            </p>
          </div>

          {(currentJob.description || currentJob.notes || currentJob.customerNote) && (
            <div className="pt-2 border-t border-rose-200/60">
              <span className="font-medium text-slate-500 block mb-1">Issue Description</span>
              <p className="italic text-slate-600 bg-white p-2.5 rounded-xl border border-rose-200/60">
                "{currentJob.description || currentJob.notes || currentJob.customerNote}"
              </p>
            </div>
          )}
        </div>

        {/* Lock Rules Notice */}
        <p className="text-[11px] font-normal text-slate-500 text-center">
          First technician to accept gets assigned to this request.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            disabled={isAccepting || isLocked}
            onClick={handleDeclineClick}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Decline Broadcast
          </button>

          <button
            disabled={isAccepting || isLocked}
            onClick={handleAcceptClick}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
          >
            {isAccepting ? (
              <span>Locking Assignment...</span>
            ) : isLocked ? (
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" /> Job Locked & Accepted!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Accept Emergency Job
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
