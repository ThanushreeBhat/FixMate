'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TechFormData {
  name: string;
  age: string;
  gender: string;
  email: string;
  mobile: string;
  experience: string;
  skills: string[];
  serviceArea: string;
}

const skillOptions = [
  'Electrical',
  'Plumbing',
  'AC Repair',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'Microwave Repair',
  'Television Repair',
  'RO Water Purifier',
  'Carpentry',
  'Painting',
  'Home Cleaning',
  'Pest Control',
];

export default function TechnicianProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<TechFormData>({
    name: '',
    age: '',
    gender: '',
    email: '',
    mobile: '',
    experience: '',
    skills: [],
    serviceArea: '',
  });

  useEffect(() => {
    let unsubscribeDoc: Unsubscribe | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      
      unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || data.fullName || '',
            age: data.age ? String(data.age) : '',
            gender: data.gender || '',
            email: data.email || user.email || '',
            mobile: data.mobile || data.phone || '',
            experience: data.experience ? String(data.experience) : (data.experienceYears ? String(data.experienceYears) : ''),
            skills: data.skills || (data.specialization ? [data.specialization] : []),
            serviceArea: data.serviceArea || data.workingArea || '',
          });
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore subscription error:', err);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((item) => item !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const {
      name,
      age,
      gender,
      mobile,
      experience,
      skills,
      serviceArea
    } = formData;

    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!mobile.trim()) {
      alert('Please enter your mobile number.');
      return;
    }

    if (skills.length === 0) {
      alert('Please select at least one skill.');
      return;
    }

    if (!serviceArea.trim()) {
      alert('Please enter your service area.');
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      const uid = user ? user.uid : 'tech_rajesh_kumar';

      const payload = {
        name: name.trim(),
        fullName: name.trim(),
        age: age ? Number(age) : 30,
        gender: gender || 'Male',
        mobile: mobile.trim(),
        phone: mobile.trim(),
        email: formData.email || user?.email || 'rajesh.kumar@fixmate.in',
        experience: experience ? Number(experience) : 8,
        experienceYears: String(experience || 8),
        skills: skills,
        specialization: skills.join(', '),
        serviceArea: serviceArea.trim(),
        workingArea: serviceArea.trim(),
        role: 'technician',
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), payload, { merge: true });
      await setDoc(doc(db, 'technicians', uid), payload, { merge: true });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        router.push('/technician');
      }, 1500);
    } catch (err: unknown) {
      console.error('Firebase save error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
      
      {loading && (
        <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Fetching Firebase Profile...</span>
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#0A2540] mb-8 font-heading">
        Technician Profile & Skill Settings
      </h1>

      {savedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile saved & synced dynamically to Firebase Cloud Firestore! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        <div>
          <label className="font-medium text-xs text-slate-700">Full Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className="w-full border rounded-xl pl-10 p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="font-medium text-xs text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 32"
              className="w-full mt-1 border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-xs text-slate-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-medium text-xs text-slate-700">Email Address</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full border rounded-xl pl-10 p-3 text-xs font-semibold bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs text-slate-700">Mobile Phone Number</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full border rounded-xl pl-10 p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs text-slate-700">Experience (Years)</label>
          <div className="relative mt-1">
            <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 8"
              className="w-full border rounded-xl pl-10 p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs text-slate-700">Service Coverage Area</label>
          <input
            type="text"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            placeholder="e.g. Indiranagar & HSR Layout, Bengaluru"
            className="w-full mt-1 border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the cities or regional sectors where you provide services.
          </p>
        </div>

        <div>
          <label className="font-medium text-xs text-slate-700">Service Specializations & Skill Set</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {skillOptions.map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-3 border rounded-xl p-3 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
              >
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                  className="w-4 h-4 accent-[#0A2540]"
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0A2540] hover:bg-[#12395f] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 text-xs"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to Firebase Cloud Firestore...</span>
            </>
          ) : (
            <span>Save Profile & Skill Updates</span>
          )}
        </button>

      </form>
    </div>
  );
}
