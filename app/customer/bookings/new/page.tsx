'use client';

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  FileText,
  Wrench,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { auth, db } from '../../../../lib/firebase/firebase';

import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { notifyBookingCreated } from "../../../../lib/firebase/notifications";
import { doc, getDoc, orderBy } from "firebase/firestore";

interface PreviousTechnician {
  id?: string;
  name?: string;
  phone?: string;
  rating?: number;
}

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emergency = searchParams.get("emergency");
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    timeSlot: "",
    requestPreviousTechnician: false,
    isEmergency: false,
    notes: "",
  });

  useEffect(() => {
    if (emergency === "true") {
      setFormData((prev) => ({
        ...prev,
        isEmergency: true,
      }));
    }
  }, [emergency]);
  
  const category = searchParams.get('category');
  const service = searchParams.get('service');
  const price = searchParams.get('price');
  const duration = searchParams.get('duration');

  const [loading, setLoading] = useState(false);
  const [hasPreviousTechnician, setHasPreviousTechnician] = useState(false);
  const [previousTechnician, setPreviousTechnician] = useState<PreviousTechnician | null>(null);

  useEffect(() => {
    const checkPreviousTechnician = async () => {
      const user = auth.currentUser;

      if (!user || !category) return;

      try {
        const q = query(
          collection(db, "bookings"),
          where("customerId", "==", user.uid),
          where("status", "==", "Completed"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);

        console.log("Completed bookings:", snapshot.size);

        snapshot.forEach(doc => {
          console.log(doc.data().service);
        });

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();

          setHasPreviousTechnician(true);

          setPreviousTechnician({
            id: data.technicianId,
            name: data.technicianName,
            phone: data.technicianPhone,
            rating: data.technicianRating,
          });
        } else {
          setHasPreviousTechnician(false);
          setPreviousTechnician(null);
        }

      } catch (error) {
        console.error(error);
      }
    };

    checkPreviousTechnician();
  }, [category, service]);

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('Please login again.');
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    if (!formData.isEmergency) {
      if (!formData.date) {
        alert("Please select a preferred date.");
        return;
      }

      if (!formData.timeSlot) {
        alert("Please select a time slot.");
        return;
      }
    }

    setLoading(true);

    try {
      const bookingData = {
        customerId: user.uid,
        customerName: userData.name || "",
        customerEmail: user.email,
        customerAddress: userData.address,
        category,
        service,
        price,
        duration,

        description: formData.description,
        date: formData.isEmergency ? null : formData.date,
        timeSlot: formData.isEmergency ? null : formData.timeSlot,

        preferredTechnicianId:
          formData.requestPreviousTechnician
            ? previousTechnician?.id
            : null,

        preferredTechnicianName:
          formData.requestPreviousTechnician
            ? previousTechnician?.name
            : null,

        preferredTechnicianPhone:
          formData.requestPreviousTechnician
            ? previousTechnician?.phone
            : null,

        isEmergency: formData.isEmergency,

        notes: formData.notes,

        status: formData.isEmergency
          ? 'Emergency Pending'
          : 'Pending',

        technicianId: null,
        dispatcherId: null,

        createdAt: serverTimestamp(),
      };

      let docRef;

      if (formData.isEmergency) {
        docRef = await addDoc(
          collection(db, "emergencyBookings"),
          bookingData
        );
      } else {
        docRef = await addDoc(
          collection(db, "bookings"),
          bookingData
        );
      }

      await notifyBookingCreated({
        customerId: user.uid,
        bookingId: docRef.id,
        service: service || "",
      });

      alert("Booking submitted successfully.");

      router.push("/customer/bookings");
    } catch (error) {
      console.error(error);
      alert("Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

      <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
        Book Service
      </h1>

        {/* Service Details */}

        <div className="bg-slate-100 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold flex items-center gap-2 text-[#0A2540]">
            <Wrench size={22} />
            Service Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mt-5">

            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-semibold">{category}</p>
            </div>

            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-semibold">{service}</p>
            </div>

            <div>
              <p className="text-gray-500">Estimated Price</p>
              <p className="font-semibold text-green-600">
                ₹{price}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Estimated Duration</p>
              <p className="font-semibold">{duration}</p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Issue Description
          </label>

          <div className="relative">
            <FileText className="absolute top-3 left-2 text-slate-400 w-3 h-5" />

            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="     Describe the issue in detail..."
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#0A2540] outline-none"
            />
          </div>
        </div>

        {/* Preferred Date */}

        {!formData.isEmergency && (
          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">
              <Calendar size={18} />
              Preferred Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3"
            />

          </div>
        )}

        {/* Time Slots */}

        {!formData.isEmergency && (
          <div>

            <label className="font-semibold flex items-center gap-2 mb-3">
              <Clock size={18} />
              Select Time Slot
            </label>

            <div className="grid md:grid-cols-2 gap-4">

              {timeSlots.map((slot) => (

                <label
                  key={slot}
                  className={`border rounded-xl p-4 cursor-pointer transition ${
                    formData.timeSlot === slot
                      ? "border-[#0A2540] bg-blue-50"
                      : "hover:border-[#0A2540]"
                  }`}
                >

                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={formData.timeSlot === slot}
                    onChange={handleChange}
                    className="mr-3"
                  />

                  {slot}

                </label>

              ))}

            </div>

          </div>
        )}
        
        {/* Request Previous Technician */}

        {hasPreviousTechnician && previousTechnician && (
          <div className="border rounded-xl p-5 bg-blue-50 border-blue-200">

            <h3 className="font-bold text-lg text-[#0A2540] mb-4">
              Previous Technician
            </h3>

            <div className="space-y-2 mb-5">

              <p>
                <span className="font-semibold">Name:</span>{" "}
                {previousTechnician.name}
              </p>

              {previousTechnician.phone && (
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {previousTechnician.phone}
                </p>
              )}

              {previousTechnician.rating && (
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  ⭐ {previousTechnician.rating}/5
                </p>
              )}

            </div>

            <label className="flex items-start gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="requestPreviousTechnician"
                checked={formData.requestPreviousTechnician}
                onChange={handleChange}
                disabled={formData.isEmergency}
                className="mt-1 w-5 h-5 accent-[#0A2540]
                     disabled:cursor-not-allowed
                     disabled:opacity-50"
              />

              <div>
                <p className="font-semibold">
                  Request this technician
                </p>

                <p className="text-sm text-gray-600">
                  {formData.isEmergency
                    ? "Previous technician requests are unavailable for emergency bookings."
                    : "If available, we'll try to assign your previous technician."}
                </p>
              </div>

            </label>

          </div>
        )}
        {!hasPreviousTechnician && (
          <div className="border rounded-xl p-5 bg-gray-50">

            <p className="text-gray-600 text-sm">
              Previous technician requests become available after you complete at least
              one <strong>{category}</strong> service.
            </p>

          </div>
        )}

        {/* Emergency Service */}

        <div className="border border-red-300 bg-red-50 rounded-xl p-5">

          <div className="flex items-start gap-3">

            <input
              type="checkbox"
              name="isEmergency"
              checked={formData.isEmergency}
              onChange={handleChange}
              disabled={emergency === "true"}
              className="mt-1 w-5 h-5 accent-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <div>

              <div className="flex items-center gap-2">

                <AlertTriangle
                  size={20}
                  className="text-red-600"
                />

                <label className="font-semibold text-red-700">
                  Emergency Service
                </label>

              </div>

              <p className="text-sm text-red-600 mt-2">
                Emergency requests are immediately forwarded to the
                dispatcher for faster assignment.
              </p>

            </div>

          </div>

        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A2540] hover:bg-[#163B63] text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
        >

          {loading ? (
            <>
              <Loader2
                className="animate-spin"
                size={20}
              />
              Submitting Booking...
            </>
          ) : (
            'Confirm Booking'
          )}

        </button>

        </form>

      </div>

    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-10 text-center font-bold text-slate-500">Loading booking form...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}
