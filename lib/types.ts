import { Timestamp, FieldValue } from "firebase/firestore";

export type BookingStatus =
  | "Pending"
  | "Emergency Pending"
  | "Assigned"
  | "Accepted"
  | "On The Way"
  | "Reached Location"
  | "Service Started"
  | "Completed"
  | "Cancelled"
  | string;

export interface Booking {
  id?: string;
  bookingId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  service?: string;
  category?: string;
  serviceId?: string;
  serviceName?: string;
  address?: string;
  location?: string;
  date?: string;
  time?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  description?: string;
  status?: BookingStatus;
  lastNotifiedStatus?: BookingStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  price?: number;
  total?: number;
  estimatedCost?: number;
  finalAmount?: number;
  extraCharges?: number;
  extraChargesReason?: string;
  paymentStatus?: string;
  isEmergency?: boolean;
  rating?: number;
  review?: string;
  createdAt?: Timestamp | FieldValue | string | number | Date | null;
  updatedAt?: Timestamp | FieldValue | string | number | Date | null;
  scheduledAt?: Timestamp | FieldValue | string | number | Date | null;
  completedAt?: Timestamp | FieldValue | string | number | Date | null;
  startedAt?: Timestamp | FieldValue | string | number | Date | null;
  collectionName?: string;
}

export interface AppNotification {
  id?: string;
  userId?: string;
  bookingId?: string;
  bookingCollection?: string | null;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: Timestamp | FieldValue | string | number | Date | null;
}

export interface UserProfile {
  uid?: string;
  email?: string | null;
  role?: "customer" | "technician" | "admin" | "dispatcher" | string;
  name?: string;
  fullName?: string;
  displayName?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  avatar?: string;
  photoURL?: string;
  skills?: string[];
  specialization?: string;
  isAvailable?: boolean;
  status?: string;
  createdAt?: Timestamp | FieldValue | string | number | Date | null;
  updatedAt?: Timestamp | FieldValue | string | number | Date | null;
}

export interface Technician {
  id: string;
  uid?: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  skills?: string[];
  status?: "Available" | "Busy" | "Offline" | "On Route" | "Working" | string;
  isAvailable?: boolean;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;
  activeJobs?: number;
  latitude?: number;
  longitude?: number;
  location?: { lat: number; lng: number } | string;
  currentJobId?: string | null;
}

export interface Service {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  description?: string;
  icon?: string;
  category?: string;
  badge?: string;
  active?: boolean;
  [key: string]: any;
}

