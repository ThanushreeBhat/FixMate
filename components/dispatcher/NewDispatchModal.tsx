'use client';

import React from 'react';
import type { NewRequestData } from './useDispatcherState';

interface NewDispatchModalProps {
  isNewRequestOpen: boolean;
  setIsNewRequestOpen: (open: boolean) => void;
  newRequestData: NewRequestData;
  setNewRequestData: React.Dispatch<React.SetStateAction<NewRequestData>>;
  handleCreateRequest: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewDispatchModal({
  isNewRequestOpen,
  setIsNewRequestOpen,
  newRequestData,
  setNewRequestData,
  handleCreateRequest
}: NewDispatchModalProps) {
  if (!isNewRequestOpen) return null;

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Create Dispatch Ticket</h3>
            <p className="text-[11px] text-slate-400 font-medium">Create a new service request on behalf of a customer</p>
          </div>
          <button 
            onClick={() => setIsNewRequestOpen(false)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreateRequest} className="p-6 space-y-4 text-xs font-semibold text-slate-700 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Issue / Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Issue / Description <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={newRequestData.title || ''}
              onChange={(e) => setNewRequestData({ ...newRequestData, title: e.target.value })}
              placeholder="e.g. Toilet Overflowing, Short Circuit in kitchen" 
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              required 
            />
          </div>

          {/* Customer Info (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Customer Name
              </label>
              <input 
                type="text" 
                value={newRequestData.customerName || ''}
                onChange={(e) => setNewRequestData({ ...newRequestData, customerName: e.target.value })}
                placeholder="Walk-In Customer / Name" 
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input 
                type="text" 
                value={newRequestData.customerPhone || ''}
                onChange={(e) => setNewRequestData({ ...newRequestData, customerPhone: e.target.value })}
                placeholder="+91 98765 43210" 
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Site Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Site Address <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={newRequestData.address || ''}
              onChange={(e) => setNewRequestData({ ...newRequestData, address: e.target.value })}
              placeholder="Street Address, Apt / Suite, City" 
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              required 
            />
          </div>

          {/* Trade Category & Service Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Trade Category
              </label>
              <select 
                value={newRequestData.category || 'PLUMBING'}
                onChange={(e) => setNewRequestData({ ...newRequestData, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer bg-white transition-all"
              >
                <option value="PLUMBING">PLUMBING</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="AC_SERVICE">AC MAINTENANCE</option>
                <option value="CARPENTRY">CARPENTRY</option>
                <option value="CLEANING">CLEANING</option>
                <option value="APPLIANCE">APPLIANCE REPAIR</option>
                <option value="PAINTING">PAINTING</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Service Type
              </label>
              <select 
                value={newRequestData.type || 'RESIDENTIAL'}
                onChange={(e) => setNewRequestData({ ...newRequestData, type: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer bg-white transition-all"
              >
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          {/* Preferred Schedule (Hidden when Emergency Dispatch is selected) */}
          {!newRequestData.isEmergency && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Preferred Date
                </label>
                <input 
                  type="date" 
                  value={newRequestData.date || ''}
                  onChange={(e) => setNewRequestData({ ...newRequestData, date: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={newRequestData.timeSlot || ''}
                  onChange={(e) => setNewRequestData({ ...newRequestData, timeSlot: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white cursor-pointer"
                >
                  <option value="">Select Time Slot...</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          )}


          {/* Emergency Dispatch */}
          <div className="flex items-center gap-3.5 bg-rose-50/70 p-4 rounded-xl border border-rose-200">
            <input 
              type="checkbox"
              id="isEmergency"
              checked={Boolean(newRequestData.isEmergency)}
              onChange={(e) => setNewRequestData({ ...newRequestData, isEmergency: e.target.checked })}
              className="w-4.5 h-4.5 text-rose-600 border-rose-300 rounded focus:ring-rose-500 cursor-pointer accent-rose-600"
            />
            <label htmlFor="isEmergency" className="cursor-pointer select-none">
              <span className="block text-rose-900 font-extrabold text-xs">Emergency Dispatch</span>
              <span className="block text-[10px] text-rose-600 font-medium">Places in Urgent Broadcast feed</span>
            </label>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Notes & Special Instructions
            </label>
            <textarea 
              rows={2}
              value={newRequestData.notes || ''}
              onChange={(e) => setNewRequestData({ ...newRequestData, notes: e.target.value })}
              placeholder="Any additional notes or customer preferences..." 
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none" 
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button 
              type="button"
              onClick={() => setIsNewRequestOpen(false)}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              Submit Ticket
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
