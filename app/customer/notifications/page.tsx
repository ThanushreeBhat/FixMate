'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "../../../lib/firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Bell,
  CheckCircle,
  Clock,
  Wrench,
  AlertTriangle,
  Star,
} from "lucide-react";
import { AppNotification, Booking } from "../../../lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const user = auth.currentUser;

  if (!user) {
    setLoading(false);
    return;
  }

  // Existing notifications listener
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsubscribeNotifications = onSnapshot(
    notificationsQuery,
    (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as object),
        } as AppNotification))
      );
      setLoading(false);
    }
  );

  const statusMessages: Record<string, { type: string; title: string; message: string }> = {
    Pending: {
      type: "booking_created",
      title: "Booking Created",
      message: "Your booking has been received.",
    },

    "Emergency Pending": {
      type: "booking_created",
      title: "Emergency Booking Created",
      message: "Your emergency request has been received.",
    },

    Assigned: {
      type: "technician_assigned",
      title: "Technician Assigned",
      message: "A technician has been assigned to your booking.",
    },

    Accepted: {
      type: "technician_assigned",
      title: "Booking Accepted",
      message: "Your emergency booking has been accepted.",
    },

    "On The Way": {
      type: "technician_on_the_way",
      title: "Technician On The Way",
      message: "The technician is on the way.",
    },

    "Reached Location": {
      type: "technician_arrived",
      title: "Technician Arrived",
      message: "The technician has reached your location.",
    },

    "Service Started": {
      type: "service_started",
      title: "Service Started",
      message: "The technician has started working.",
    },

    Completed: {
      type: "service_completed",
      title: "Service Completed",
      message: "Your service is complete. Please rate your technician.",
    },

    Cancelled: {
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: "Your booking has been cancelled.",
    },
  };

  const watchCollection = (collectionName: string) => {
    return onSnapshot(
      query(
        collection(db, collectionName),
        where("customerId", "==", user.uid)
      ),
      async (snapshot) => {
        for (const change of snapshot.docChanges()) {
          if (
            change.type !== "modified" &&
            change.type !== "added"
          )
            continue;

          const booking = change.doc.data() as Booking;

          if (
            booking.status === booking.lastNotifiedStatus
          )
            continue;

          const info = booking.status ? statusMessages[booking.status] : undefined;

          if (!info) continue;

          await addDoc(collection(db, "notifications"), {
            userId: user.uid,
            bookingId: change.doc.id,
            bookingCollection: collectionName,
            type: info.type,
            title: info.title,
            message: info.message,
            createdAt: serverTimestamp(),
            isRead: false,
          });

          await updateDoc(change.doc.ref, {
            lastNotifiedStatus: booking.status,
          });
        }
      }
    );
  };

  const unsubscribeBookings = watchCollection("bookings");
  const unsubscribeEmergency = watchCollection(
    "emergencyBookings"
  );

  return () => {
    unsubscribeNotifications();
    unsubscribeBookings();
    unsubscribeEmergency();
  };
}, []);

  const markAsRead = async (id?: string) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, "notifications", id), {
        isRead: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "booking_created":
        return <Bell className="text-blue-600" size={24} />;

      case "technician_assigned":
        return <Wrench className="text-green-600" size={24} />;

      case "technician_on_the_way":
        return <Clock className="text-orange-500" size={24} />;

      case "service_started":
        return <AlertTriangle className="text-yellow-500" size={24} />;

      case "service_completed":
        return <CheckCircle className="text-green-700" size={24} />;
      case "technician_arrived":
  return <AlertTriangle className="text-blue-600" size={24} />;

case "booking_cancelled":
  return <AlertTriangle className="text-red-600" size={24} />;

      default:
        return <Bell size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading notifications...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-[#0A2540] mb-8 flex items-center gap-3">
          <Bell />
          Notifications
        </h1>

        {notifications.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            No notifications yet.
          </div>

        ) : (

          <div className="space-y-5">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 cursor-pointer transition hover:shadow-lg
                  ${
                    notification.isRead
                      ? "border-gray-300"
                      : "border-blue-600 bg-blue-50"
                  }`}
              >

                <div className="flex justify-between">

                  <div className="flex gap-4">

                    {getIcon(notification.type)}

                    <div>

                      <h2 className="font-bold text-lg">
                        {notification.title}
                      </h2>

                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {notification.createdAt && typeof (notification.createdAt as any).toDate === 'function' ? (notification.createdAt as any).toDate().toLocaleString() : ''}
                      </p>

                    </div>

                  </div>

                  {!notification.isRead && (

                    <span className="h-3 w-3 rounded-full bg-blue-600 mt-2"></span>

                  )}

                </div>

                {notification.type === "service_completed" && (

                  <div className="mt-6">

                    <Link
  href={`/customer/ratings?bookingId=${notification.bookingId}&collection=${notification.bookingCollection}`}

                      className="inline-flex items-center gap-2 bg-[#0A2540] text-white px-5 py-2 rounded-lg hover:bg-[#163B63]"
                    >
                      <Star size={18} />
                      Rate Now
                    </Link>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}
