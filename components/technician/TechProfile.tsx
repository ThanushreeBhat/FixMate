'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { 
  User, 
  CheckCircle2, 
  Save, 
  Loader2,
  LogOut
} from 'lucide-react';

interface TechProfileData {
  uid?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  specialization?: string;
  experienceYears?: string;
  experience?: number | string;
  workingArea?: string;
  serviceArea?: string;
  avatarUrl?: string;
  availability?: string;
  status?: string;
  role?: string;
  skills?: string[];
}

interface TechProfileProps {
  availability?: string;
  onToggleAvailability?: () => void;
  currentUser?: TechProfileData | null;
  onUpdateProfile?: (data: Partial<TechProfileData>) => void;
  onLogout?: () => void;
}

export default function TechProfile({ 
  availability = 'Available', 
  onToggleAvailability,
  currentUser,
  onUpdateProfile,
  onLogout
}: TechProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || auth.currentUser?.displayName || 'Technician',
    phone: currentUser?.phone || auth.currentUser?.phoneNumber || '',
    email: currentUser?.email || auth.currentUser?.email || '',
    specialization: currentUser?.specialization || 'General Services',
    experienceYears: currentUser?.experienceYears || '5',
    workingArea: currentUser?.workingArea || 'Mangaluru Region',
    avatarUrl: currentUser?.avatarUrl || '',
    availability: availability || 'Available'
  });

  useEffect(() => {
    let unsubscribeDoc: Unsubscribe | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const targetUid = user.uid;
      const userDocRef = doc(db, 'users', targetUid);

      unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const syncedData = {
            name: data.name || data.fullName || profileData.name,
            phone: data.phone || data.mobile || profileData.phone,
            email: data.email || user?.email || profileData.email,
            specialization: data.specialization || (data.skills && data.skills.join(', ')) || profileData.specialization,
            experienceYears: String(data.experienceYears || data.experience || profileData.experienceYears),
            workingArea: data.workingArea || data.serviceArea || profileData.workingArea,
            avatarUrl: data.avatarUrl || profileData.avatarUrl,
            availability: data.availability || availability || 'Available'
          };
          setProfileData(syncedData);
          if (onUpdateProfile) onUpdateProfile(syncedData);
        } else {
          const initialData = {
            name: currentUser?.name || 'Rajesh Kumar',
            phone: currentUser?.phone || '+91 98765 43210',
            email: user?.email || currentUser?.email || 'rajesh.kumar@fixmate.in',
            specialization: currentUser?.specialization || 'Master Plumber',
            experienceYears: currentUser?.experienceYears || '8',
            workingArea: currentUser?.workingArea || 'Kodialbail & Hampankatta, Mangaluru',
            avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            availability: availability || 'Available',
            role: 'technician',
            createdAt: new Date().toISOString()
          };
          setDoc(userDocRef, initialData, { merge: true }).catch(console.error);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Firestore onSnapshot subscription warning:', error);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      const targetUid = user?.uid || currentUser?.uid || 'tech_rajesh_kumar';
      
      const userDocRef = doc(db, 'users', targetUid);
      const techDocRef = doc(db, 'technicians', targetUid);

      const payload = {
        name: profileData.name.trim(),
        fullName: profileData.name.trim(),
        phone: profileData.phone.trim(),
        mobile: profileData.phone.trim(),
        email: profileData.email.trim(),
        specialization: profileData.specialization.trim(),
        experienceYears: profileData.experienceYears,
        experience: Number(profileData.experienceYears) || 8,
        workingArea: profileData.workingArea.trim(),
        serviceArea: profileData.workingArea.trim(),
        avatarUrl: profileData.avatarUrl,
        role: 'technician',
        updatedAt: new Date().toISOString()
      };

      await setDoc(userDocRef, payload, { merge: true });
      await setDoc(techDocRef, payload, { merge: true });

      setIsEditing(false);
      setSavedSuccess(true);
      if (onUpdateProfile) onUpdateProfile(payload);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: unknown) {
      console.error('Failed to update profile in Firebase:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert('Error updating profile in Firebase: ' + errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Real-time Dynamic Profile Form */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-xs space-y-6 relative">
        
        {loading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-10 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-[#0B2545]">
            <Loader2 className="w-5 h-5 animate-spin text-[#134074]" />
            <span>Fetching real-time profile from Firebase...</span>
          </div>
        )}

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-[#0B2545]">Technician Profile & Duty Settings</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Synced in real-time with Cloud Firestore database</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved & updated in Firebase Cloud Firestore!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Profile Icon Header */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#134074] text-white flex items-center justify-center border-2 border-slate-200 shadow-xs">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#0B2545]">{profileData.name}</h4>
              <p className="text-xs font-semibold text-slate-500">{profileData.specialization}</p>
              
              {/* Duty Toggle */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Current Duty Status:</span>
                <button
                  type="button"
                  onClick={() => onToggleAvailability && onToggleAvailability()}
                  className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    availability === 'ONLINE' || availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : availability === 'BUSY' || availability === 'Busy'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  ● {availability} (Click to toggle)
                </button>
              </div>
            </div>
          </div>

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Full Name</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#EEF4ED]/40 border border-slate-200/80 rounded-xl text-xs font-normal text-[#0B2545] disabled:opacity-75 focus:outline-none focus:bg-white focus:border-[#134074] transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone Number</label>
              <input 
                type="tel"
                disabled={!isEditing}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#EEF4ED]/40 border border-slate-200/80 rounded-xl text-xs font-normal text-[#0B2545] disabled:opacity-75 focus:outline-none focus:bg-white focus:border-[#134074] transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Service Specialization</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.specialization}
                onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#EEF4ED]/40 border border-slate-200/80 rounded-xl text-xs font-normal text-[#0B2545] disabled:opacity-75 focus:outline-none focus:bg-white focus:border-[#134074] transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Years of Experience</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.experienceYears}
                onChange={(e) => setProfileData({ ...profileData, experienceYears: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#EEF4ED]/40 border border-slate-200/80 rounded-xl text-xs font-normal text-[#0B2545] disabled:opacity-75 focus:outline-none focus:bg-white focus:border-[#134074] transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Working Coverage Zone</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.workingArea}
                onChange={(e) => setProfileData({ ...profileData, workingArea: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#EEF4ED]/40 border border-slate-200/80 rounded-xl text-xs font-normal text-[#0B2545] disabled:opacity-75 focus:outline-none focus:bg-white focus:border-[#134074] transition-all"
                placeholder="e.g. Indiranagar & HSR Layout, Bengaluru"
                required
              />
            </div>

          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#134074] hover:bg-[#13315C] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 inline-flex disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Updates</span>
                  </>
                )}
              </button>
            </div>
          )}

        </form>

        <div className="pt-6 border-t border-slate-200/80">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out of Technician Account</span>
          </button>
        </div>

      </div>

    </div>
  );
}
