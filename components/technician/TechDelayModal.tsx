'use client';
import { useState } from 'react';
import { Ban, X, Send, ShieldAlert } from 'lucide-react';

interface TechDelayModalProps {
  isOpen: boolean;
  job?: any;
  onClose: () => void;
  onReportDelay?: (jobId: string, reason: string, notes: string) => void;
}

export default function TechDelayModal({ 
  isOpen, 
  job, 
  onClose, 
  onReportDelay 
}: TechDelayModalProps) {
  const [reasonType, setReasonType] = useState('Unable to Reach Customer');
  const [notes, setNotes] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalReason = `Cancel Assignment: ${reasonType}`;

    if (onReportDelay) {
      onReportDelay(job.id, finalReason, notes);
    }
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-rose-500 relative space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 shadow-inner">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0A2540]">Cancel Job Assignment</h3>
            <p className="text-xs font-medium text-slate-500">Urgent Dispatcher Alert</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Select Mandatory Cancellation Reason *
            </label>

            <div className="space-y-2">
              {[
                { key: 'Unable to Reach Customer', label: '📞 Unable to Reach Customer / No Answer' },
                { key: 'Customer Requested Cancellation', label: '❌ Customer Requested Cancellation' },
                { key: 'Invalid Address / Site Unreachable', label: '📍 Invalid Address / Site Unreachable' },
                { key: 'Technical Emergency Issue', label: '⚠️ Technical Emergency / Equipment Safety Issue' }
              ].map((opt) => (
                <label 
                  key={opt.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                    reasonType === opt.key 
                      ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="cancellationReason"
                    checked={reasonType === opt.key}
                    onChange={() => setReasonType(opt.key)}
                    className="accent-rose-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Additional Justification / Notes</label>
            <textarea 
              rows={3}
              placeholder="Provide specific details regarding why this assignment must be cancelled..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-rose-500 transition-all"
            />
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              🚨 Cancelling will immediately lock this job in Read-Only mode, reset your daily workload capacity, and send an Urgent Priority 10 Alert to the Dispatcher terminal.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Cancel Job & Notify Dispatcher Immediately</span>
          </button>

        </form>

      </div>
    </div>
  );
}
