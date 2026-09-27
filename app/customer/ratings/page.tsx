'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase/firebase";
import { Star, Home } from "lucide-react";
import { Booking } from "../../../lib/types";

interface RatingBooking extends Booking {
  assignedTechId?: string;
  acceptedByTechId?: string;
  techId?: string;
  assignedTechName?: string;
  assignedTechnician?: string;
  assignedTo?: string;
  technician?: string;
  technicianEmail?: string;
  assignedTechEmail?: string;
  customer?: string;
  serviceCategory?: string;
  title?: string;
}

function RatingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const collectionName = searchParams.get("collection");

  const [booking, setBooking] = useState<RatingBooking | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId || !collectionName) return;

      const docRef = doc(db, collectionName, bookingId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setBooking({
          id: snap.id,
          ...(snap.data() as object),
        } as RatingBooking);
      }

      setLoading(false);
    }

    loadBooking();
  }, [bookingId, collectionName]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (review.trim().length < 10) {
      alert("Please provide feedback (minimum 10 characters).");
      return;
    }

    if (!bookingId || !collectionName) return;

    setSubmitting(true);

    try {
      const techId = booking?.technicianId || booking?.assignedTechId || booking?.acceptedByTechId || booking?.techId || null;
      const techName = booking?.technicianName || booking?.assignedTechName || booking?.assignedTechnician || booking?.assignedTo || booking?.technician || "";
      const techEmail = booking?.technicianEmail || booking?.assignedTechEmail || "";
      const custName = booking?.customerName || booking?.customer || auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "Customer";

      // Firestore automatically creates the "ratings" collection
      await addDoc(collection(db, "ratings"), {
        bookingId,
        bookingCollection: collectionName,
        customerId: auth.currentUser?.uid || "",
        customerName: custName,
        technicianId: techId,
        technicianName: techName,
        technicianEmail: techEmail,
        service: booking?.service || booking?.serviceName || booking?.title || booking?.category || "Service Request",
        category: booking?.category || booking?.serviceCategory || "General",
        rating,
        review,
        createdAt: serverTimestamp(),
      });

      // Mark booking as rated
      await updateDoc(doc(db, collectionName, bookingId), {
        isRated: true,
      });

      alert("Thank you for your feedback!");

      router.push("/customer");
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-10">Booking not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/customer")}
            className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-4 py-2 rounded-lg transition"
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold mb-2">
            Rate Your Service
          </h1>

          <p className="text-slate-500 mb-6">
            Your feedback helps technicians improve and helps other customers choose trusted professionals.
          </p>

          <div className="mb-6">
            <p><strong>Service:</strong> {booking.service}</p>
            <p><strong>Technician:</strong> {booking.technicianName || "Not Assigned"}</p>
          </div>

          <h3 className="font-semibold mb-3">
            Overall Rating *
          </h3>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
              >
                <Star
                  size={36}
                  className={
                    value <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }
                />
              </button>
            ))}
          </div>

          <label className="block font-semibold mb-2">
            Feedback <span className="text-red-500">*</span>
          </label>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={6}
            placeholder="Tell us about your experience. Mention what the technician did well and what could be improved. (Minimum 10 characters)"
            className="w-full border rounded-xl p-4 resize-none"
          />

          <p className="text-sm text-slate-500 mt-2">
            Your feedback is mandatory and will be shared with the technician to help them improve or recognize excellent work.
          </p>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 w-full bg-[#0A2540] hover:bg-[#13395F] text-white py-3 rounded-xl font-semibold"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default function RatingPage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-slate-500">Loading rating page...</div>}>
      <RatingContent />
    </Suspense>
  );
}
