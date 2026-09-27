'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerProfileForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    mobile: '',
    address: '',
  });

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        router.push('/');
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setFormData({
          name: data.name || '',
          age: data.age ? String(data.age) : '',
          gender: data.gender || '',
          email: data.email || user.email || '',
          mobile: data.mobile || '',
          address: data.address || '',
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Enter your name');
      return;
    }

    if (!formData.age) {
      alert('Enter your age');
      return;
    }

    if (Number(formData.age) < 18 || Number(formData.age) > 100) {
      alert('Enter a valid age');
      return;
    }

    if (!formData.gender) {
      alert('Select gender');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert('Enter a valid mobile number');
      return;
    }

    if (!formData.address.trim()) {
      alert('Enter your address');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        mobile: formData.mobile,
        address: formData.address.trim(),
      });

      alert('Profile updated successfully');

      router.push('/customer');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">

      <h1 className="text-3xl font-bold text-[#0B2545] mb-8">
        Customer Profile
      </h1>

      <div className="space-y-6">

        <div>
          <label className="font-medium">Full Name</label>

          <div className="relative mt-2">
            <User className="absolute left-3 top-3 text-gray-500" />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded-lg pl-11 p-3 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="font-medium">Age</label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 border rounded-lg p-3 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 border rounded-lg p-3 disabled:bg-gray-100"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

        </div>

        <div>
          <label className="font-medium">Email</label>

          <div className="relative mt-2">
            <Mail className="absolute left-3 top-3 text-gray-500" />

            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full border rounded-lg pl-11 p-3 bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Mobile Number</label>

          <div className="relative mt-2">
            <Phone className="absolute left-3 top-3 text-gray-500" />

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded-lg pl-11 p-3 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Address</label>

          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-3 text-gray-500" />

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded-lg pl-11 p-3 disabled:bg-gray-100"
            />
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-[#0B2545] hover:bg-[#12395f] text-white py-3 rounded-xl font-semibold"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-4">

            <button
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="w-1/2 bg-[#0B2545] hover:bg-[#12395f] text-white py-3 rounded-xl font-semibold"
            >
              Save Changes
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
