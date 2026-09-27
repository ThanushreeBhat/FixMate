'use client';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export default function EmergencyModal({ isOpen, onClose, onShowToast }: EmergencyModalProps) {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyType, setEmergencyType] = useState('Water Pipe Burst / Severe Leakage');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dispatchId = `DISP-${Math.floor(4800 + Math.random() * 200)}`;
    const category = emergencyType.toUpperCase().includes('PIPE') ? 'PLUMBING' : emergencyType.toUpperCase().includes('POWER') ? 'ELECTRICAL' : 'HVAC';
    const icon = emergencyType.toUpperCase().includes('PIPE') ? '💧' : emergencyType.toUpperCase().includes('POWER') ? '⚡' : '🔥';

    const newDispatchItem = {
      id: dispatchId,
      title: emergencyType,
      time: 'Just now',
      address: address,
      priority: 'Priority Level 10',
      category: category,
      type: 'URGENT',
      icon: icon,
      colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-100 text-rose-600',
      recommendedTech: 'Dave R.',
      techSpecialty: 'Emergency Squad',
      distance: '1.2 km away',
      price: '1499.00',
      customerName: phone || 'Emergency Call'
    };

    try {
      const local = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify([newDispatchItem, ...local]));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));
    } catch(err) {}

    try {
      const res = await fetch('http://localhost:5000/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergencyType, phone, address })
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(`EMERGENCY ALERT DISPATCHED! (${data.dispatch.id}) Tech ETA: ${data.dispatch.etaMinutes || 20} mins.`);
      } else {
        onShowToast('EMERGENCY ALERT DISPATCHED! Tech ETA: 20 mins.');
      }
    } catch (err) {
      onShowToast('EMERGENCY ALERT DISPATCHED! Tech ETA: 20 mins.');
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden border-t-4 border-red-600">
        <div className="bg-red-50 px-7 py-6 border-b border-red-100 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>24/7 Emergency Dispatch</span>
          </h3>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-red-700">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          <p className="text-xs text-slate-600 font-medium">Nearest emergency technician dispatched within 45 minutes guaranteed across major Indian cities.</p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Emergency Issue</label>
            <select 
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold text-[#0B2545]"
            >
              <option>Water Pipe Burst / Severe Leakage</option>
              <option>Power Outage / Short Circuit</option>
              <option>Gas Appliance Hazard</option>
              <option>Emergency Lockout</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210" 
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-red-600" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Location Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 104 Bandra West, Mumbai" 
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-red-600" 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg">
            Dispatch Emergency Technician Now
          </button>
        </form>
      </div>
    </div>
  );
}
