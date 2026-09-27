import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export interface CreateNotificationParams {
  userId: string;
  bookingId: string;
  bookingCollection?: string;
  title: string;
  message: string;
  type: string;
}

export interface NotifyBookingCreatedParams {
  customerId: string;
  bookingId: string;
  service: string;
}

export interface NotifyTechnicianAssignedParams {
  customerId: string;
  bookingId: string;
  technicianName: string;
}

export interface NotifyTechnicianOnTheWayParams {
  customerId: string;
  bookingId: string;
  technicianName: string;
}

export interface NotifyWorkStartedParams {
  customerId: string;
  bookingId: string;
}

export interface NotifyServiceCompletedParams {
  customerId: string;
  bookingId: string;
  bookingCollection?: string;
  service: string;
}

export interface NotifyBookingCancelledParams {
  customerId: string;
  bookingId: string;
}

/**
 * Create a notification
 */
export const createNotification = async ({
  userId,
  bookingId,
  bookingCollection,
  title,
  message,
  type,
}: CreateNotificationParams) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      bookingId,
      bookingCollection: bookingCollection || null,
      title,
      message,
      type,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
};

/* ----------------------------------------
   Booking Submitted
---------------------------------------- */

export const notifyBookingCreated = async ({
  customerId,
  bookingId,
  service,
}: NotifyBookingCreatedParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    title: "Booking Submitted",
    message: `Your ${service} booking has been submitted successfully.`,
    type: "booking_created",
  });
};

/* ----------------------------------------
   Technician Assigned
---------------------------------------- */

export const notifyTechnicianAssigned = async ({
  customerId,
  bookingId,
  technicianName,
}: NotifyTechnicianAssignedParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    title: "Technician Assigned",
    message: `${technicianName} has been assigned to your booking.`,
    type: "technician_assigned",
  });
};

/* ----------------------------------------
   Technician On The Way
---------------------------------------- */

export const notifyTechnicianOnTheWay = async ({
  customerId,
  bookingId,
  technicianName,
}: NotifyTechnicianOnTheWayParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    title: "Technician On The Way",
    message: `${technicianName} is on the way to your location.`,
    type: "technician_on_the_way",
  });
};

/* ----------------------------------------
   Work Started
---------------------------------------- */

export const notifyWorkStarted = async ({
  customerId,
  bookingId,
}: NotifyWorkStartedParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    title: "Service Started",
    message: "Your technician has started working on your service request.",
    type: "service_started",
  });
};

/* ----------------------------------------
   Work Completed
---------------------------------------- */

export const notifyServiceCompleted = async ({
  customerId,
  bookingId,
  bookingCollection,
  service,
}: NotifyServiceCompletedParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    bookingCollection,
    title: "Service Completed",
    message: `${service} has been completed successfully. Please rate your technician.`,
    type: "service_completed",
  });
};

/* ----------------------------------------
   Booking Cancelled
---------------------------------------- */

export const notifyBookingCancelled = async ({
  customerId,
  bookingId,
}: NotifyBookingCancelledParams) => {
  await createNotification({
    userId: customerId,
    bookingId,
    title: "Booking Cancelled",
    message: "Your booking has been cancelled.",
    type: "booking_cancelled",
  });
};
