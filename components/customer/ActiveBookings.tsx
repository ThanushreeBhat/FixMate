'use client';
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase/firebase";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  ArrowRight,
} from 'lucide-react';

import { Booking } from "../../lib/types";

export interface ActiveBookingItem extends Booking {
  timeSlot?: string;
}

export default function ActiveBookings() {
  const [bookings, setBookings] = useState<ActiveBookingItem[]>([]);
  const router = useRouter();
  useEffect(() => {
  const user = auth.currentUser;

  if (!user) return;

  const q = query(
    collection(db, "bookings"),
    where("customerId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const activeBookings = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as object),
      } as ActiveBookingItem))
      .filter(
        (booking) =>
          booking.status !== "Completed" &&
          booking.status !== "Cancelled"
      );

    setBookings(activeBookings);
  });

  return () => unsubscribe();
}, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Assigned':
        return 'bg-green-100 text-green-700';

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'In Progress':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section>
      <div className="space-y-5">
        {bookings.length === 0 ? (
  <div className="bg-white rounded-xl p-8 text-center">
    <h3 className="text-xl font-semibold">
      No Active Bookings
    </h3>

    <p className="text-slate-500 mt-2">
      You don't have any active service requests.
    </p>
  </div>
) : (
  bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h3 className="text-xl font-bold text-[#0A2540]">
                    {booking.service}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span> {booking.technicianName || "Not Assigned"} </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{booking.date || "Emergency Booking"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{booking.timeSlot || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{booking.location}</span>
                  </div>
                </div>
              </div>

              <button
  onClick={() => router.push(`/customer/bookings/${booking.id}`)}
  className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-5 py-3 rounded-xl transition font-semibold"
>
  View Details
  <ArrowRight size={18} />
</button>
            </div>
          </div>
        ))
        )}
      </div>
    </section>
  );
}