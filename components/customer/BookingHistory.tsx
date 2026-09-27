'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase/firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Star,
  ArrowRight,
} from 'lucide-react';

import { Booking } from "../../lib/types";

export interface HistoryBookingItem extends Booking {
  source?: string;
  isRated?: boolean;
}

export default function BookingHistory() {
  
  const router = useRouter();
  const [history, setHistory] = useState<HistoryBookingItem[]>([]);
  useEffect(() => {
  const user = auth.currentUser;

  if (!user) return;

  const normalQuery = query(
    collection(db, "bookings"),
    where("customerId", "==", user.uid)
  );

  const emergencyQuery = query(
    collection(db, "emergencyBookings"),
    where("customerId", "==", user.uid)
  );

  let normalBookings: HistoryBookingItem[] = [];
  let emergencyBookings: HistoryBookingItem[] = [];

  const updateHistory = () => {
    const merged = [...normalBookings, ...emergencyBookings]
      .filter(
        (booking) =>
          booking.status === "Completed" ||
          booking.status === "Cancelled"
      )
      .sort((a, b) => {
        const dateA = typeof a.createdAt === 'object' && a.createdAt && 'seconds' in a.createdAt ? (a.createdAt as { seconds: number }).seconds : 0;
        const dateB = typeof b.createdAt === 'object' && b.createdAt && 'seconds' in b.createdAt ? (b.createdAt as { seconds: number }).seconds : 0;
        return dateB - dateA;
      });

    setHistory(merged);
  };

  const unsubscribeNormal = onSnapshot(normalQuery, (snapshot) => {
    normalBookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      source: "bookings",
      ...(doc.data() as object),
    } as HistoryBookingItem));

    updateHistory();
  });

  const unsubscribeEmergency = onSnapshot(emergencyQuery, (snapshot) => {
    emergencyBookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      source: "emergencyBookings",
      ...(doc.data() as object),
    } as HistoryBookingItem));

    updateHistory();
  });

  return () => {
    unsubscribeNormal();
    unsubscribeEmergency();
  };
}, []);
  return (
    <section>
      <div className="space-y-5">
        {history.length === 0 ? (
  <div className="bg-white rounded-xl p-8 text-center">
    <h3 className="text-xl font-semibold">No Booking History</h3>
    <p className="text-slate-500 mt-2">
      Completed and cancelled bookings will appear here.
    </p>
  </div>
) :  (
  history.map((booking) => (
    <div
      key={booking.id}
      className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            {booking.status === "Completed" ? (
              <CheckCircle2 size={24} className="text-green-600" />
            ) : (
              <XCircle size={24} className="text-red-500" />
            )}

            <h3 className="text-xl font-bold text-[#0A2540]">
              {booking.service}
            </h3>
          </div>

          <div className="mt-4 space-y-2 text-slate-600">
            <p>
              <strong>Booking ID:</strong>{" "}
              {booking.bookingId || booking.id}
            </p>

            <p>
              <strong>Technician:</strong>{" "}
              {booking.technicianName || "Not Assigned"}
            </p>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{booking.date || "Emergency Booking"}</span>
            </div>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                booking.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {booking.status === "Completed" && !booking.isRated && (
  <button
    onClick={() =>
      router.push(
        `/customer/ratings?bookingId=${booking.id}&collection=${booking.source}`
      )
    }
    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl transition font-semibold"
  >
    <Star size={18} />
    Rate Service
  </button>
)}

          <button
            onClick={() =>
              router.push(
                `/customer/bookings/${booking.id}?collection=${booking.source}`
              )
            }
            className="flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-5 py-3 rounded-xl transition font-semibold"
          >
            View Details
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  ))
)}
        
      </div>
    </section>
  );
}