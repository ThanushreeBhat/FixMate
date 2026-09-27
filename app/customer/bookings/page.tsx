'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../lib/firebase/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  Eye,
  Home,
} from 'lucide-react';
import { Booking } from '../../../lib/types';

interface CustomerBookingItem extends Booking {
  source: string;
  timeSlot?: string;
  extraLabour?: number;
  extraMaterial?: number;
  finalTotalBill?: number;
}

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<CustomerBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const normalQuery = query(
      collection(db, 'bookings'),
      where('customerId', '==', user.uid)
    );

    const emergencyQuery = query(
      collection(db, 'emergencyBookings'),
      where('customerId', '==', user.uid)
    );

    let normalBookings: CustomerBookingItem[] = [];
    let emergencyBookings: CustomerBookingItem[] = [];

    const updateBookings = () => {
      const allBookings = [
        ...normalBookings,
        ...emergencyBookings,
      ];

      allBookings.sort((a, b) => {
        const aTime =
          typeof a.createdAt === 'object' && a.createdAt && 'seconds' in a.createdAt
            ? (a.createdAt as { seconds: number }).seconds
            : 0;

        const bTime =
          typeof b.createdAt === 'object' && b.createdAt && 'seconds' in b.createdAt
            ? (b.createdAt as { seconds: number }).seconds
            : 0;

        return bTime - aTime;
      });

      setBookings(allBookings);
      setLoading(false);
    };

    const unsubscribeNormal = onSnapshot(
      normalQuery,
      (snapshot) => {
        normalBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          source: 'bookings',
          ...(doc.data() as object),
        } as CustomerBookingItem));

        updateBookings();
      }
    );

    const unsubscribeEmergency = onSnapshot(
      emergencyQuery,
      (snapshot) => {
        emergencyBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          source: 'emergencyBookings',
          ...(doc.data() as object),
        } as CustomerBookingItem));

        updateBookings();
      }
    );

    return () => {
      unsubscribeNormal();
      unsubscribeEmergency();
    };
  }, []);

  const filteredBookings =
    filter === 'All'
      ? bookings
      : bookings.filter(
          (booking) => booking.status === filter
        );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pending':
      case 'Emergency Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'Assigned':
        return 'bg-blue-100 text-blue-700';

      case 'In Progress':
        return 'bg-indigo-100 text-indigo-700';

      case 'Completed':
        return 'bg-green-100 text-green-700';

      case 'Cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const cancelBooking = async (booking: CustomerBookingItem) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await updateDoc(
        doc(db, booking.source, booking.id as string),
        {
          status: "Cancelled",
        }
      );

      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <>
    {/* Navbar */}
    <nav className="bg-[#0A2540] shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/customer")}
          className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition"
        >
          <Home size={20} />
          Home
        </button>
      </div>
    </nav>

  <main className="min-h-screen bg-slate-50 py-10">
    <div className="max-w-6xl mx-auto px-4">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <h1 className="text-3xl font-bold text-[#0A2540]">
          My Bookings
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Emergency Pending</option>
          <option>Assigned</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      {loading ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-xl font-semibold">
            Loading bookings...
          </h2>

        </div>

      ) : filteredBookings.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Bookings Found
          </h2>

          <p className="text-gray-500 mt-3">
            Book your first service to get started.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {filteredBookings.map((booking) => (

            <div
              key={`${booking.source}-${booking.id}`}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              {/* Top */}

              <div className="flex flex-col md:flex-row justify-between gap-5">

                <div>

                  <h2 className="text-2xl font-bold text-[#0A2540]">
                    {booking.service}
                  </h2>

                  <p className="text-gray-500">
                    {booking.category}
                  </p>

                </div>

                <div className="flex flex-wrap gap-2">

                  {booking.isEmergency && (

                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-2 text-sm">

                      <AlertTriangle size={16} />

                      Emergency

                    </span>

                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

              </div>

              {/* Booking Info */}

              <div className="grid md:grid-cols-3 gap-5 mt-6">

                <div className="flex items-center gap-3">

                  <Calendar size={18} />

                  <div>

                    <p className="text-gray-500 text-sm">
                      Date
                    </p>

                    <p>{booking.date}</p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Clock size={18} />

                  <div>

                    <p className="text-gray-500 text-sm">
                      Time
                    </p>

                    <p>{booking.timeSlot}</p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Wrench size={18} />

                  <div>

                    <p className="text-gray-500 text-sm">
                      Technician
                    </p>

                    <p>
                      {booking.technicianId
                        ? "Assigned"
                        : "Waiting"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Description */}

              <div className="mt-6">

                <h3 className="font-semibold">
                  Problem Description
                </h3>

                <p className="text-gray-600 mt-2">
                  {booking.description}
                </p>

              </div>

              {/* Price Details */}

<div className="mt-6 border rounded-xl p-6">

  <h3 className="text-lg font-bold mb-5">
    Price Details
  </h3>

  <div className="space-y-4">

    <div className="flex justify-between">
      <span className="text-gray-600">
        Estimated Price
      </span>

      <span className="font-semibold text-blue-600">
        ₹{booking.price || 0}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        Extra Labour Charges
      </span>

      <span className="font-semibold text-orange-600">
        ₹{booking.extraLabour || 0}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        Extra Material Charges
      </span>

      <span className="font-semibold text-orange-600">
        ₹{booking.extraMaterial || 0}
      </span>
    </div>

    <hr />

    <div className="flex justify-between text-lg">

      <span className="font-bold">
        Final Price
      </span>

      <span className="font-bold text-green-600">
        ₹
        {booking.finalTotalBill ||
          (
            Number(booking.price || 0) +
            Number(booking.extraLabour || 0) +
            Number(booking.extraMaterial || 0)
          )}
      </span>

    </div>

  </div>

</div>
{booking.extraChargesReason && (
  <div className="mt-6 border rounded-xl p-6">
    <h3 className="font-bold mb-2">
      Reason for Additional Charges
    </h3>

    <p className="text-gray-600">
      {booking.extraChargesReason}
    </p>
  </div>
)}
              {/* Buttons */}

              <div className="mt-8 flex flex-wrap gap-4">

                <button
                  onClick={() =>
                    router.push(
                      `/customer/bookings/${booking.id}?collection=${booking.source}`
                    )
                  }
                  className="bg-[#0A2540] hover:bg-[#163B63] text-white px-5 py-3 rounded-lg flex items-center gap-2"
                >
                  <Eye size={18} />

                  View Details
                </button>

                {(booking.status === "Pending" ||
                  booking.status === "Emergency Pending") && (

                  <button
  onClick={() => cancelBooking(booking)}
  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
>
  Cancel Booking
</button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  </main>
  </>
);
}
