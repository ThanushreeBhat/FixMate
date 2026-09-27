'use client';
import { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Phone, Wrench, Briefcase, MapPin, X, ArrowRight } from 'lucide-react';

interface TechAuthModalProps {
  isOpen: boolean;
  mode?: 'login' | 'register' | string;
  onClose: () => void;
  onAuthSuccess: (techData: any, message: string) => void;
}

export default function TechAuthModal({ isOpen, mode = 'login', onClose, onAuthSuccess }: TechAuthModalProps) {
  const [authMode, setAuthMode] = useState(mode); // 'login' | 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    specialization: 'Plumbing',
    experienceYears: '5',
    workingArea: 'Downtown Sector',
    avatarUrl: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please provide both email and password.');
        return;
      }
      onAuthSuccess({
        email: formData.email,
        name: 'Alex Vance (Master Tech)',
        role: 'Technician',
        specialization: 'Plumbing',
        status: 'Available'
      }, 'Login successful! Welcome back.');
      onClose();
    } else {
      if (!formData.email || !formData.password || !formData.fullName || !formData.phone) {
        setError('Please fill in all mandatory fields.');
        return;
      }
      onAuthSuccess({
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization,
        experienceYears: formData.experienceYears,
        workingArea: formData.workingArea,
        role: 'Technician',
        status: 'Available',
        avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      }, 'Registration complete! Welcome to FixMate FieldFlow.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200/80 relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#0A2540] tracking-tight">
              {authMode === 'login' ? 'Technician Sign In' : 'Technician Registration'}
            </h3>
            <p className="text-xs font-medium text-slate-500">
              {authMode === 'login' ? 'Access your assigned field jobs' : 'Join FixMate as a verified technician'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'register' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel"
                      required
                      placeholder="555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Specialization</label>
                  <div className="relative">
                    <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>HVAC / AC Service</option>
                      <option>Carpentry</option>
                      <option>Painting</option>
                      <option>Appliance Repair</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Experience (Years)</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number"
                      min="1"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Working Zone</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.workingArea}
                      onChange={(e) => setFormData({ ...formData, workingArea: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option>Downtown Sector</option>
                      <option>North Metro</option>
                      <option>South Suburbs</option>
                      <option>West District</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                required
                placeholder="tech@fixmate.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{authMode === 'login' ? 'Sign In to Duty' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              setError('');
              setAuthMode(authMode === 'login' ? 'register' : 'login');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {authMode === 'login' 
              ? "New technician? Click here to register" 
              : "Already registered? Click here to log in"}
          </button>
        </div>

      </div>
    </div>
  );
}
