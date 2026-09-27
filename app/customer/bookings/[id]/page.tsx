'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase/firebase";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  User,
  Mail,
  FileText,
  Loader2,
  Home,
} from "lucide-react";
import { Booking } from "../../../../lib/types";

interface DetailedBooking extends Booking {
  customerAddress?: string;
  timeSlot?: string;
  duration?: string;
  extraLabour?: number;
  extraMaterial?: number;
  finalTotalBill?: number;
}

export default function BookingDetailsPage() {

  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const searchParams = useSearchParams();

  const collectionName =
    searchParams.get("collection") || "bookings";

  const [booking, setBooking] = useState<DetailedBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>  {
  if (!id) return;

  const docRef = doc(db, collectionName, id);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        setBooking({
          id: docSnap.id,
          ...(docSnap.data() as object),
        } as DetailedBooking);
      } else {
        setBooking(null);
      }

      setLoading(false);
    },
    (error) => {
      console.error("Realtime Booking Error:", error);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, [id, collectionName]);

  if (loading) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-[#0A2540]" size={40} />
      </div>
    );

  }

  if (!booking) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          Booking Not Found
        </h1>
      </div>
    );

  }

  const getStatusColor = (status?: string) => {

    switch (status) {

      case "Pending":
      case "Emergency Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Assigned":
        return "bg-blue-100 text-blue-700";
      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-indigo-100 text-indigo-700";
        case "On The Way":
        return "bg-purple-100 text-purple-700";
        case "Reached Location":
  return "bg-cyan-100 text-cyan-700";

case "Service Started":
  return "bg-indigo-100 text-indigo-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };

  
// Booking Progress Stages
const bookingStages = booking.isEmergency
  ? [
      "Pending",
      "Accepted",
      "On The Way",
      "Reached Location",
      "Service Started",
      "Completed",
    ]
  : [
      "Pending",
      "Assigned",
      "On The Way",
      "Reached Location",
      "Service Started",
      "Completed",
    ];

const getStageIndex = () => {
  switch (booking.status?.trim()) {
    case "Pending":
    case "Emergency Pending":
      return 0;

    case "Assigned":
      return 1;
    case "Accepted":
      return 1;

    case "On The Way":
      return 2;

    case "Reached Location":
      return 3;

    case "Service Started":
      return 4;

    case "Completed":
      return 5;

    default:
      return -1;
  }
};
  return (

    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="bg-[#0A2540] shadow-md sticky top-0 z-20">

  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">

    <button
          onClick={() => router.push("/customer")}
          className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-4 py-2 rounded-lg transition"
        >
          <Home size={18} />
          Home
        </button>

  </div>

</nav>
      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Header */}

          <div className="flex justify-between items-start flex-wrap gap-4">

            <div>

              <h1 className="text-3xl font-bold text-[#0A2540]">
                {booking.service}
              </h1>

              <p className="text-gray-500 mt-2">
                {booking.category}
              </p>

            </div>

            <div className="flex gap-3">

              {booking.isEmergency && (

                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2">

                  <AlertTriangle size={18} />

                  Emergency

                </span>

              )}

              <span
                className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>

            </div>

          </div>

          {/* Customer & Booking Details */}

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="border rounded-xl p-5">

              <h2 className="font-bold text-xl mb-5">
                Customer Information
              </h2>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <User />
                  {booking.customerName || "Customer"}
                </div>

                <div className="flex items-center gap-3">
                  <Mail />
                  {booking.customerEmail}
                </div>

                {booking.customerAddress && (

                  <div className="flex items-center gap-3">
                    📍 {booking.customerAddress}
                  </div>

                )}

              </div>

            </div>

            <div className="border rounded-xl p-5">

              <h2 className="font-bold text-xl mb-5">
                Booking Details
              </h2>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <Calendar />
                  {booking.date || "Immediate Service"}
                </div>

                <div className="flex items-center gap-3">
                  <Clock />
                  {booking.timeSlot || "-"}
                </div>

                <div className="flex items-center gap-3">
                  <Wrench />
                  {booking.duration}
                </div>

              </div>

            </div>

          </div>
                    {/* Description */}

          <div className="mt-8 border rounded-xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <FileText />

              <h2 className="text-xl font-bold">
                Problem Description
              </h2>

            </div>

            <p className="text-gray-600 whitespace-pre-wrap">
              {booking.description || "No description provided."}
            </p>

          </div>

          {/* Additional Notes */}

          {booking.notes && (

            <div className="mt-8 border rounded-xl p-6">

              <h2 className="font-bold text-xl mb-4">
                Additional Notes
              </h2>

              <p className="text-gray-600 whitespace-pre-wrap">
                {booking.notes}
              </p>

            </div>

          )}

          {/* Technician */}

          <div className="mt-8 border rounded-xl p-6">

            <h2 className="font-bold text-xl mb-4">
              Technician Status
            </h2>

            {booking.technicianId ? (

              <div className="space-y-2">

                <p className="text-lg text-green-700 font-semibold">
                  ✅ Technician Assigned
                </p>

                {booking.technicianName && (
                  <p>
                    <strong>Name:</strong> {booking.technicianName}
                  </p>
                )}

              </div>

            ) : (

              <p className="text-lg text-yellow-700 font-semibold">
                ⌛ Waiting for Technician Assignment
              </p>

            )}

          </div>
          {/* Billing Details */}

<div className="mt-8 border rounded-xl p-6">

  <h2 className="text-xl font-bold mb-6">
    Billing Details
  </h2>

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
        ₹{booking.finalTotalBill || booking.price || 0}
      </span>

    </div>

    {booking.extraChargesReason && (
      <>
        <hr />

        <div>
          <p className="font-semibold mb-2">
            Reason for Additional Charges
          </p>

          <p className="text-gray-600">
            {booking.extraChargesReason}
          </p>
        </div>
      </>
    )}

  </div>

</div>
          {/* Booking Progress */}

<div className="mt-8 border rounded-xl p-6">

  <h2 className="text-xl font-bold mb-8">
    Booking Progress
  </h2>

  <div className="flex flex-col md:flex-row md:justify-between gap-8">

    {bookingStages.map((stage, index) => {

      const currentIndex = getStageIndex();

      const completed = index < currentIndex;
      const current = index === currentIndex;

      return (

        <div
          key={stage}
          className="flex md:flex-col items-center flex-1 relative"
        >

          {/* Connector */}

          {index !== bookingStages.length - 1 && (

            <>
              {/* Desktop */}
              <div
                className={`hidden md:block absolute top-5 left-1/2 w-full h-1 ${
                  completed
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                style={{ transform: "translateX(20px)" }}
              />

              {/* Mobile */}
              <div
                className={`md:hidden absolute left-5 top-10 w-1 h-12 ${
                  completed
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            </>

          )}

          {/* Circle */}

          <div
            className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all ${
              completed
                ? "bg-green-600 border-green-600 text-white"
                : current
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-400"
            }`}
          >
            {completed ? "✓" : index + 1}
          </div>

          {/* Label */}

          <div className="ml-4 md:ml-0 md:mt-4 text-center">

            <h3
              className={`font-semibold ${
                current
                  ? "text-blue-700"
                  : completed
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {stage}
            </h3>

            {current && (
              <p className="text-sm text-blue-600 mt-1">
                {booking.status}
              </p>
            )}

            {completed && (
              <p className="text-sm text-green-600 mt-1">
                Completed
              </p>
            )}

            {!completed && !current && (
              <p className="text-sm text-gray-400 mt-1">
                Waiting
              </p>
            )}

          </div>

        </div>

      );

    })}

  </div>

</div>
        </div>

      </div>

    </main>

  );

}
