'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import ProtectedRoute from '../../components/ProtectedRoute';
import TechHeader from '../../components/technician/TechHeader';
import TechDashboard from '../../components/technician/TechDashboard';
import TechJobList from '../../components/technician/TechJobList';
import TechJobDetail from '../../components/technician/TechJobDetail';
import TechProfile from '../../components/technician/TechProfile';
import TechPerformance from '../../components/technician/TechPerformance';
import TechEmergencyModal, { EmergencyJob } from '../../components/technician/TechEmergencyModal';
import TechExtraChargesModal from '../../components/technician/TechExtraChargesModal';
import TechDelayModal from '../../components/technician/TechDelayModal';
import TechAuthModal from '../../components/technician/TechAuthModal';
import { Info } from 'lucide-react';

interface TechUserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: string;
  workingArea: string;
  avatarUrl?: string;
  status: string;
}

interface JobRecord {
  id: string;
  title: string;
  service?: string;
  tag: string;
  category: string;
  timeSlot: string;
  time: string;
  duration?: string;
  location: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone: string;
  price: number;
  status: string;
  cancellationReason?: string;
  description: string;
  extraCharges?: number;
  extraChargesReason?: string;
  isEmergency: boolean;
  images?: string[];
  assignedTechName?: string;
  timestamps?: Record<string, string>;
  updatedAt?: string;
  extraLabour?: number;
  extraMaterial?: number;
}

interface EmergencyBroadcastItem {
  id: string;
  title: string;
  category: string;
  location: string;
  customerName: string;
  customerPhone: string;
  price: number;
  description: string;
  distance: string;
  isEmergency: boolean;
  status: string;
}

interface RatingRecord {
  id: string;
  bookingId: string;
  rating: number;
  review: string;
  customerName: string;
  service: string;
  date: string;
}

interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  type?: string;
}

export default function TechnicianModulePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [availability, setAvailability] = useState('Available');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const DISPATCHER_EMAIL = 'dispatcher@fixmate.com';
  const MANGALURU_REGION = 'Mangaluru, Karnataka';

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({ isOpen: false, mode: 'login' });
  const [currentUser, setCurrentUser] = useState<TechUserData | null>(null);

  const normalizeTechName = (str?: string | null) => {
    if (!str) return '';
    return String(str).toLowerCase().replace(/[\._\-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const resolveCustomerName = (data: Record<string, unknown>) => {
    if (!data) return 'Customer';
    const cName = (data.customerName || data.customer) as string;
    if (cName && cName !== 'Customer' && cName !== 'customer' && String(cName).trim() !== '') {
      return cName;
    }
    if (data.customerEmail && String(data.customerEmail).trim() !== '') return data.customerEmail as string;
    if (data.email && String(data.email).trim() !== '') return data.email as string;
    return cName || 'Customer';
  };

  const resolveJobTime = (data: Record<string, unknown>, isEmg: boolean) => {
    if (!data) return '09:30 AM';

    if (isEmg && data.createdAt) {
      try {
        const createdAt = data.createdAt as { seconds?: number };
        if (typeof createdAt === 'object' && createdAt.seconds) {
          return new Date(createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (typeof data.createdAt === 'string' && data.createdAt.trim() !== '') {
          const d = new Date(data.createdAt);
          if (!isNaN(d.getTime())) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
      } catch(e) {}
    }

    if (data.timeSlot && data.timeSlot !== 'null' && data.timeSlot !== 'Just now') return data.timeSlot as string;
    if (data.time && data.time !== 'null' && data.time !== 'Just now') return data.time as string;
    if (data.scheduledTime && data.scheduledTime !== 'null') return data.scheduledTime as string;

    if (data.createdAt) {
      try {
        const createdAt = data.createdAt as { seconds?: number };
        if (typeof createdAt === 'object' && createdAt.seconds) {
          return new Date(createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (typeof data.createdAt === 'string' && data.createdAt.trim() !== '') {
          const d = new Date(data.createdAt);
          if (!isNaN(d.getTime())) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
      } catch(e) {}
    }

    return '09:30 AM';
  };

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;
    let unsubscribeTechDoc: (() => void) | null = null;

    try {
      const cached = localStorage.getItem('fixmate_tech_availability');
      if (cached) setAvailability(cached);
    } catch(e) {}

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setJobs([]);
      setSelectedJob(null);
      setRatingsList([]);

      if (!user) {
        setCurrentUser(null);
        return;
      }

      const targetUid = user.uid;
      const defaultDerivedName = user.displayName || (user.email ? user.email.split('@')[0].replace(/[\._\-]/g, ' ') : 'Technician');
      const formattedName = defaultDerivedName.replace(/\b\w/g, c => c.toUpperCase());

      setCurrentUser({
        uid: targetUid,
        name: formattedName,
        email: user.email || '',
        phone: user.phoneNumber || '',
        specialization: 'Technician',
        experienceYears: '5',
        workingArea: 'Mangaluru Region',
        status: 'Available'
      });

      const userDocRef = doc(db, 'users', targetUid);
      const techDocRef = doc(db, 'technicians', targetUid);

      const updateTechProfileFromDb = (data: Record<string, unknown> | undefined) => {
        if (!data) return;
        const dbName = (data.name || data.fullName || data.displayName) as string;
        const dbStatus = (data.availability || data.status) as string;

        if (dbStatus) {
          setAvailability(dbStatus);
          try {
            localStorage.setItem('fixmate_tech_availability', dbStatus);
            localStorage.setItem(`fixmate_tech_availability_${targetUid}`, dbStatus);
          } catch(e) {}
        }

        setCurrentUser(prev => ({
          uid: targetUid,
          name: dbName || prev?.name || user?.displayName || 'Technician',
          email: (data.email as string) || user?.email || prev?.email || '',
          phone: (data.phone || data.mobile || data.phoneNumber) as string || prev?.phone || '',
          specialization: (data.specialization as string) || (Array.isArray(data.skills) ? data.skills.join(', ') : '') || prev?.specialization || 'General Services',
          experienceYears: String(data.experienceYears || data.experience || prev?.experienceYears || '5'),
          workingArea: (data.workingArea || data.serviceArea) as string || 'Mangaluru Region',
          avatarUrl: (data.avatarUrl as string) || prev?.avatarUrl || '',
          status: dbStatus || prev?.status || 'Available'
        }));
      };

      unsubscribeTechDoc = onSnapshot(techDocRef, (docSnap) => {
        if (docSnap.exists()) {
          updateTechProfileFromDb(docSnap.data());
        }
      }, (err) => console.warn('Tech doc snapshot warning:', err));

      unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          updateTechProfileFromDb(docSnap.data());
        }
      }, (err) => console.warn('User doc snapshot warning:', err));

      try {
        const jobsColRef = collection(db, 'jobs');
        const bookingsColRef = collection(db, 'bookings');

        const syncAssignedJobs = (snapshotDocs: import('firebase/firestore').DocumentSnapshot[]) => {
          const techName = (currentUser?.name || user?.displayName || '').toLowerCase().trim();
          const techUid = user?.uid || currentUser?.uid;
          const techEmail = (currentUser?.email || user?.email || '').toLowerCase().trim();

          if (!techUid && !techName && !techEmail) return;

          snapshotDocs.forEach(docSnap => {
            const data = (docSnap.data() || {}) as Record<string, unknown>;

            const docTechId = data.assignedTechId || data.technicianId || data.acceptedByTechId || data.techId;
            const docTechName = String(data.technicianName || data.assignedTechName || data.assignedTo || data.assignedTechnician || data.recommendedTech || data.technician || '').toLowerCase().trim();
            const docTechEmail = String(data.technicianEmail || data.assignedTechEmail || data.techEmail || '').toLowerCase().trim();

            if (docTechId && techUid && docTechId !== techUid) return;
            if (docTechName && techName && docTechName !== techName && !docTechName.includes(techName) && !techName.includes(docTechName)) return;
            if (docTechEmail && techEmail && docTechEmail !== techEmail) return;

            const isAssignedToMe = Boolean(
              (techUid && docTechId && docTechId === techUid) ||
              (techName && docTechName && (docTechName === techName || docTechName.includes(techName) || techName.includes(docTechName))) ||
              (techEmail && docTechEmail && docTechEmail === techEmail)
            );

            if (!isAssignedToMe) return;

            const isEmg = Boolean(
              data.isEmergency === true ||
              data.isEmergency === 'true' ||
              data.isEmergency === 'TRUE' ||
              (typeof data.tag === 'string' && data.tag.toLowerCase().includes('emerg')) ||
              (typeof data.category === 'string' && data.category.toLowerCase().includes('emerg')) ||
              (typeof data.type === 'string' && data.type.toLowerCase().includes('emerg')) ||
              (typeof data.serviceCategory === 'string' && data.serviceCategory.toLowerCase().includes('emerg')) ||
              (typeof data.title === 'string' && data.title.toLowerCase().includes('emerg'))
            );

            if (isAssignedToMe && (data.id || docSnap.id)) {
              const formattedJob: JobRecord = {
                id: docSnap.id || (data.id as string) || (data.jobId as string),
                title: (data.title || data.serviceName || data.category || 'Service Request') as string,
                service: (data.service || data.serviceName || data.category || 'Service Request') as string,
                tag: isEmg ? 'EMERGENCY' : ((data.tag as string) || 'STANDARD'),
                category: (data.category || data.serviceCategory || 'Plumbing') as string,
                timeSlot: resolveJobTime(data, isEmg),
                time: resolveJobTime(data, isEmg),
                duration: (data.duration || data.estimatedDuration || '1 hour') as string,
                location: (data.customerAddress || data.address || data.location || 'Adyar, Mangaluru') as string,
                customerName: resolveCustomerName(data),
                customerAvatar: (data.customerAvatar || data.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80') as string,
                customerPhone: (data.customerPhone || data.phone || data.mobile || '+91 98123 45678') as string,
                price: Number(data.price || data.cost || 499),
                status: (
                  data.status === 'Cancelled' || 
                  data.status === 'CANCELLED' || 
                  data.status === 'cancelled' || 
                  (typeof data.status === 'string' && data.status.toLowerCase().includes('cancel'))
                ) ? 'Cancelled' : ((data.status as string) || 'Assigned'),
                cancellationReason: (
                  data.status === 'Cancelled' || 
                  data.status === 'CANCELLED' || 
                  data.status === 'cancelled' || 
                  (typeof data.status === 'string' && data.status.toLowerCase().includes('cancel'))
                ) ? ((data.cancellationReason as string) || '') : '',
                description: (data.description || data.notes || data.customerNote || 'Customer reported issue requiring on-site technician inspection.') as string,
                extraCharges: Number(data.extraCharges || 0),
                extraChargesReason: (data.extraChargesReason as string) || '',
                isEmergency: isEmg,
                images: (data.images as string[]) || (data.imageUrl ? [data.imageUrl as string] : []),
                assignedTechName: (data.assignedTechName as string) || techName,
                extraLabour: Number(data.extraLabour || 0),
                extraMaterial: Number(data.extraMaterial || 0)
              };

              setJobs(prev => {
                const isCancelledByAlert = (() => {
                  try {
                    const alerts = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
                    return alerts.some((a: { jobId?: string; id?: string; category?: string; status?: string; type?: string }) => (a.jobId === formattedJob.id || a.id === formattedJob.id) && (a.category === 'CANCELLATION' || a.status === 'Cancelled' || a.type === 'CANCELLATION'));
                  } catch(e) { return false; }
                })();

                if (isCancelledByAlert) {
                  formattedJob.status = 'Cancelled';
                  if (!formattedJob.cancellationReason) {
                    formattedJob.cancellationReason = 'Mid-Service Assignment Cancelled';
                  }
                }

                const index = prev.findIndex(j => j.id === formattedJob.id);
                if (index !== -1) {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], ...formattedJob };
                  return updated;
                }
                return [formattedJob, ...prev];
              });

              setSelectedJob(prev => (prev && prev.id === formattedJob.id) ? { ...prev, ...formattedJob } : prev);
            }
          });
        };

        onSnapshot(jobsColRef, (snap) => {
          if (!snap.empty) syncAssignedJobs(snap.docs);
        }, (err) => console.warn('Jobs collection snapshot warning:', err));

        onSnapshot(bookingsColRef, (snap) => {
          if (!snap.empty) syncAssignedJobs(snap.docs);
        }, (err) => console.warn('Bookings collection snapshot warning:', err));

        const syncEmergencyBroadcasts = (snapshotDocs: import('firebase/firestore').DocumentSnapshot[]) => {
          const list: EmergencyBroadcastItem[] = [];
          snapshotDocs.forEach(docSnap => {
            const data = (docSnap.data() || {}) as Record<string, unknown>;
            const isEmg = Boolean(data.isEmergency || data.category === 'Emergency' || data.tag === 'EMERGENCY' || data.type === 'EMERGENCY');
            
            const isUnaccepted = 
              data.status !== 'Accepted' && 
              data.status !== 'Completed' && 
              data.status !== 'Cancelled' && 
              !data.acceptedByTechId &&
              !data.assignedTechId &&
              !data.technicianId;

            if (isEmg && isUnaccepted) {
              const docIdStr = docSnap.id || (data.id as string) || '1';
              const charSum = docIdStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
              const dynamicDist = `${((charSum % 28) / 10 + 0.8).toFixed(1)} km away`;

              list.push({
                id: docSnap.id || (data.id as string),
                title: (data.title || data.serviceName || data.category || 'Emergency Service Request') as string,
                category: (data.category || data.serviceCategory || 'Emergency Plumbing') as string,
                location: (data.customerAddress || data.address || data.location || 'Adyar, Mangaluru') as string,
                customerName: resolveCustomerName(data),
                customerPhone: (data.customerPhone || data.phone || '+91 98123 45678') as string,
                price: Number(data.price || data.cost || 1499),
                description: (data.description || data.notes || data.customerNote || 'Urgent emergency repair required.') as string,
                distance: (data.distance as string) || dynamicDist,
                isEmergency: true,
                status: 'Assigned'
              });
            }
          });
          setEmergencyList(list);
        };

        onSnapshot(collection(db, 'emergencyBookings'), (snap) => {
          if (!snap.empty) syncEmergencyBroadcasts(snap.docs);
          else setEmergencyList([]);
        }, (err) => console.warn('Emergency bookings snapshot warning:', err));

        onSnapshot(collection(db, 'ratings'), (snap) => {
          if (!snap.empty) {
            const list: RatingRecord[] = [];
            const myUid = auth.currentUser?.uid || currentUser?.uid;
            const myNameNorm = normalizeTechName(currentUser?.name || user?.displayName);
            const myEmailNorm = (currentUser?.email || user?.email || '').toLowerCase().trim();

            const myJobIds = new Set(jobs.map(j => j.id).filter(Boolean));

            snap.docs.forEach(docSnap => {
              const data = docSnap.data();
              const docTechId = data.technicianId || data.techId;
              const docNameNorm = normalizeTechName(data.technicianName || data.assignedTechName);
              const docEmailNorm = (data.technicianEmail || data.assignedTechEmail || '').toLowerCase().trim();
              const ratingBookingId = data.bookingId;

              const isBookingMatch = Boolean(ratingBookingId && myJobIds.has(ratingBookingId));
              const isNameMatch = Boolean(myNameNorm && docNameNorm && (docNameNorm === myNameNorm || docNameNorm.includes(myNameNorm) || myNameNorm.includes(docNameNorm)));
              const isEmailMatch = Boolean(myEmailNorm && docEmailNorm && docEmailNorm === myEmailNorm);
              const isIdMatch = Boolean(myUid && docTechId && docTechId === myUid);

              if (!isBookingMatch) {
                if (!docTechId && !docNameNorm && !docEmailNorm) return;
                if (docNameNorm && myNameNorm && docNameNorm !== myNameNorm && !docNameNorm.includes(myNameNorm) && !myNameNorm.includes(docNameNorm)) return;
                if (docEmailNorm && myEmailNorm && docEmailNorm !== myEmailNorm) return;
                if (docTechId && myUid && docTechId !== myUid && !isNameMatch) return;
              }

              if (isNameMatch || isEmailMatch || isIdMatch || isBookingMatch) {
                list.push({
                  id: docSnap.id,
                  bookingId: data.bookingId || docSnap.id,
                  rating: Number(data.rating || 5),
                  review: data.review || data.comment || '',
                  customerName: data.customerName || data.customer || 'Customer',
                  service: data.service || data.category || 'Service Request',
                  date: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Today') : 'Just now'
                });
              }
            });

            setRatingsList(list);
          } else {
            setRatingsList([]);
          }
        }, (err) => console.warn('Ratings snapshot warning:', err));

        const syncLocalAssignedJobs = () => {
          try {
            const localAssigned = JSON.parse(localStorage.getItem('fixmate_assigned_jobs') || '[]');

            localAssigned.forEach((data: Record<string, unknown>) => {
              const techName = (currentUser?.name || user?.displayName || '').toLowerCase().trim();
              const techUid = user?.uid || currentUser?.uid;

              const docTechId = data.assignedTechId || data.technicianId || data.acceptedByTechId || data.techId;
              const docTechName = String(data.technicianName || data.assignedTechName || data.assignedTo || '').toLowerCase().trim();

              if (docTechId && techUid && docTechId !== techUid) return;
              if (docTechName && techName && docTechName !== techName && !docTechName.includes(techName) && !techName.includes(docTechName)) return;

              const isAssignedToMe = Boolean(
                (techUid && docTechId && docTechId === techUid) ||
                (techName && docTechName && (docTechName === techName || docTechName.includes(techName) || techName.includes(docTechName)))
              );

              if (isAssignedToMe && data.id) {
                const formattedJob: JobRecord = {
                  id: (data.id || data.jobId) as string,
                  title: (data.title || data.serviceName || data.category || 'Service Request') as string,
                  tag: data.isEmergency ? 'EMERGENCY' : ((data.tag as string) || 'STANDARD'),
                  category: (data.category || data.serviceCategory || 'Plumbing') as string,
                  timeSlot: resolveJobTime(data, Boolean(data.isEmergency)),
                  time: resolveJobTime(data, Boolean(data.isEmergency)),
                  location: (data.customerAddress || data.address || data.location || 'Adyar, Mangaluru') as string,
                  customerName: resolveCustomerName(data),
                  customerAvatar: (data.customerAvatar || data.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80') as string,
                  customerPhone: (data.customerPhone || data.phone || data.mobile || '+91 98123 45678') as string,
                  price: Number(data.price || data.cost || 499),
                  status: (data.status === 'Cancelled' || data.status === 'CANCELLED' || data.status === 'cancelled') ? 'Cancelled' : ((data.status as string) || 'Assigned'),
                  cancellationReason: (data.status === 'Cancelled' || data.status === 'CANCELLED' || data.status === 'cancelled') ? ((data.cancellationReason as string) || '') : '',
                  description: (data.description || data.notes || data.customerNote || 'Customer reported issue requiring on-site technician inspection.') as string,
                  extraCharges: Number(data.extraCharges || 0),
                  extraChargesReason: (data.extraChargesReason as string) || '',
                  isEmergency: Boolean(data.isEmergency),
                  images: (data.images as string[]) || (data.imageUrl ? [data.imageUrl as string] : []),
                  assignedTechName: (data.assignedTechName as string) || techName
                };

                setJobs(prev => {
                  const index = prev.findIndex(j => j.id === formattedJob.id);
                  if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], ...formattedJob };
                    return updated;
                  }
                  return [formattedJob, ...prev];
                });
              }
            });
          } catch(e) {}
        };

        syncLocalAssignedJobs();
        window.addEventListener('fixmate_job_assigned', syncLocalAssignedJobs);
        window.addEventListener('fixmate_dispatch_updated', syncLocalAssignedJobs);

      } catch(e) {
        console.warn('Firestore jobs live fetch error:', e);
      }
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (unsubscribeTechDoc) unsubscribeTechDoc();
      unsubscribeAuth();
    };
  }, []);

  const MAX_DAILY_CAPACITY = 6;

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [extraChargesModalOpen, setExtraChargesModalOpen] = useState(false);
  const [delayModalOpen, setDelayModalOpen] = useState(false);

  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [emergencyList, setEmergencyList] = useState<EmergencyBroadcastItem[]>([]);
  const [ratingsList, setRatingsList] = useState<RatingRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const isCancelledJob = (j: JobRecord) => 
      j.status === 'Cancelled' || 
      j.status === 'CANCELLED' || 
      j.status === 'cancelled' || 
      (typeof j.status === 'string' && j.status.toLowerCase().includes('cancel'));

    const emgNotifs: NotificationItem[] = emergencyList.map(e => ({
      id: `emg-${e.id}`,
      title: 'Emergency Service Call',
      message: `Emergency request for "${e.title || 'Service'}" in ${e.location || 'your area'}`,
      time: 'Live Broadcast',
      type: 'EMERGENCY'
    }));

    const ratingNotifs: NotificationItem[] = ratingsList.map(r => ({
      id: `rating-${r.id}`,
      title: `${r.rating}/5 Star Rating`,
      message: `${r.customerName || 'Customer'} rated ${r.rating} stars for "${r.service}": "${r.review}"`,
      time: r.date,
      type: 'RATING'
    }));

    const assignedNotifs: NotificationItem[] = jobs.filter(j => (j.status === 'Assigned' || j.status === 'Accepted') && !isCancelledJob(j)).map(j => ({
      id: `assign-${j.id}`,
      title: 'New Job Assigned',
      message: `"${j.title || j.service || 'Service'}" in ${j.location || 'your area'} • ${j.timeSlot || j.time || 'Scheduled'}`,
      time: j.timeSlot || j.time || 'Today',
      type: 'ASSIGNMENT'
    }));

    const cancelledNotifs: NotificationItem[] = jobs.filter(j => isCancelledJob(j)).map(j => {
      const cleanReason = j.cancellationReason 
        ? j.cancellationReason.replace(/^Cancel Assignment:\s*/i, '').trim()
        : 'Mid-Duty Cancellation';
      const serviceName = j.title || j.service || j.category || 'Service Request';

      return {
        id: `cancel-${j.id}`,
        title: 'Service Cancelled',
        message: `"${serviceName}" was cancelled. Reason: ${cleanReason}`,
        time: 'Cancelled',
        type: 'CANCELLATION'
      };
    });

    setNotifications([...emgNotifs, ...ratingNotifs, ...assignedNotifs, ...cancelledNotifs]);
  }, [emergencyList, jobs, ratingsList]);

  const totalRatingSum = ratingsList.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = ratingsList.length > 0 ? (totalRatingSum / ratingsList.length).toFixed(2) : '0.00';
  const positiveCount = ratingsList.filter(r => r.rating >= 4).length;
  const positivePercentage = ratingsList.length > 0 ? Math.round((positiveCount / ratingsList.length) * 100) : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleAvailability = async (forcedStatus?: string) => {
    let nextStatus = 'Available';
    if (typeof forcedStatus === 'string') {
      nextStatus = (forcedStatus === 'ONLINE' || forcedStatus === 'Available') ? 'Available' : (forcedStatus === 'BUSY' || forcedStatus === 'Busy') ? 'Busy' : 'Offline';
    } else {
      nextStatus = availability === 'Available' ? 'Busy' : availability === 'Busy' ? 'Offline' : 'Available';
    }

    setAvailability(nextStatus);
    const techName = currentUser?.name || 'Rajesh Kumar';
    const techUid = auth.currentUser?.uid || currentUser?.uid || 'tech_rajesh_kumar';

    const techPayload = {
      id: techUid,
      uid: techUid,
      name: techName,
      status: nextStatus,
      availability: nextStatus,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('fixmate_tech_availability', nextStatus);
    } catch(e) {}

    try {
      await setDoc(doc(db, 'technicians', techUid), techPayload, { merge: true });
      await setDoc(doc(db, 'users', techUid), techPayload, { merge: true });
    } catch (err) {
      console.warn('Firestore availability update error:', err);
    }

    fetch(`http://localhost:5000/api/technicians/${techUid}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, availability: nextStatus })
    }).catch(err => console.warn('Express API status update error:', err));

    try {
      localStorage.setItem(`fixmate_tech_availability_${techUid}`, nextStatus);
      window.dispatchEvent(new CustomEvent('fixmate_tech_status_updated', { detail: techPayload }));
    } catch(e) {}

    showToast(`🟢 Duty Status: Updated to "${nextStatus}" (Synced with ${DISPATCHER_EMAIL})`);
  };

  const handleUpdateStatus = async (jobId: string, nextStatus: string) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentTimestamps = targetJob?.timestamps || {};
    const updatedTimestamps = { ...currentTimestamps, [nextStatus]: currentTimeStr };

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus, timestamps: updatedTimestamps, updatedAt: new Date().toISOString() } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? ({ ...prev, status: nextStatus, timestamps: updatedTimestamps, updatedAt: new Date().toISOString() }) : null);
    }

    const jobPayload = {
      id: jobId,
      jobId: jobId,
      status: nextStatus,
      technicianName: currentUser?.name || 'Rajesh Kumar',
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      title: targetJob?.title || 'Service Request',
      customerName: targetJob?.customerName || 'Customer',
      location: targetJob?.location || 'Kodialbail & Hampankatta, Mangaluru',
      updatedAt: new Date().toISOString(),
      timestamps: updatedTimestamps,
      syncMessage: `Status updated to "${nextStatus}" at ${currentTimeStr} by ${currentUser?.name || 'Rajesh Kumar'}`
    };

    try {
      await setDoc(doc(db, 'jobs', jobId), jobPayload, { merge: true });
      await setDoc(doc(db, 'bookings', jobId), jobPayload, { merge: true });
      await setDoc(doc(db, 'emergencyBookings', jobId), jobPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Job #${jobId} checklist status updated to "${nextStatus}" by ${currentUser?.name || 'Rajesh Kumar'}`,
        user: currentUser?.name || 'Rajesh Kumar',
        role: 'technician',
        jobId: jobId,
        status: nextStatus,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore real-time status write warning:', err);
    }

    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobPayload)
    }).catch(err => console.warn('Express API booking status sync error:', err));

    try {
      localStorage.setItem(`fixmate_job_status_${jobId}`, nextStatus);
      localStorage.setItem('fixmate_last_job_status_update', JSON.stringify(jobPayload));
      window.dispatchEvent(new CustomEvent('fixmate_job_status_updated', { detail: jobPayload }));
    } catch(e) {}

    const newNotif: NotificationItem = {
      id: Date.now(),
      title: 'Status Synchronized Real-Time',
      message: `Job #${jobId} updated to "${nextStatus}". Synced with Customer, Dispatcher (${DISPATCHER_EMAIL}) & Admin.`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Status updated to "${nextStatus}"`);
  };

  const handleAcceptEmergency = async (emgJob: EmergencyJob) => {
    const activeCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Cancelled').length;

    if (activeCount >= MAX_DAILY_CAPACITY) {
      showToast(`⚠️ Daily Capacity Limit Reached (${MAX_DAILY_CAPACITY} Jobs Max). Complete existing jobs first!`);
      return;
    }

    const techName = currentUser?.name || 'Rajesh Kumar';
    const techUid = auth.currentUser?.uid || currentUser?.uid || 'tech_rajesh_kumar';

    const acceptPayload = {
      id: emgJob.id,
      jobId: emgJob.id,
      status: 'Accepted',
      isEmergency: true,
      tag: 'EMERGENCY',
      category: emgJob.category || 'Emergency Plumbing',
      assignedTechId: techUid,
      assignedTechName: techName,
      technicianName: techName,
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      acceptedByTechId: techUid,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newJob: JobRecord = {
      ...acceptPayload,
      title: emgJob.title || 'Emergency Request',
      location: emgJob.location || 'Adyar, Mangaluru',
      customerName: emgJob.customerName || 'Customer',
      customerPhone: emgJob.customerPhone || '+91 98123 45678',
      price: Number(emgJob.price || 1499),
      description: emgJob.description || 'Urgent emergency repair required.',
      timeSlot: 'Immediate',
      time: 'Immediate',
      extraCharges: 0,
      extraChargesReason: '',
    };

    try {
      await setDoc(doc(db, 'emergencyBookings', emgJob.id), acceptPayload, { merge: true });
      await setDoc(doc(db, 'jobs', emgJob.id), acceptPayload, { merge: true });
      await setDoc(doc(db, 'bookings', emgJob.id), acceptPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `🚨 Emergency Job #${emgJob.id} ACCEPTED & LOCKED by ${techName}`,
        user: techName,
        role: 'technician',
        jobId: emgJob.id,
        status: 'Accepted',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore emergency accept error:', err);
    }

    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptPayload)
    }).catch(err => console.warn('Express API emergency accept sync error:', err));

    setJobs(prev => [newJob, ...prev.filter(j => j.id !== emgJob.id)]);
    setEmergencyList(prev => prev.filter(e => e.id !== emgJob.id));
    setEmergencyModalOpen(false);
    setSelectedJob(newJob);

    showToast(`🚨 Emergency Job #${emgJob.id} Accepted & Locked! Synced with Dispatcher (${DISPATCHER_EMAIL}).`);
  };

  const handleAddExtraCharges = async (jobId: string, totalExtra: number, reason: string, extraLabour = 0, extraMaterial = 0) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const basePrice = targetJob?.price || 0;
    const currentExtra = targetJob?.extraCharges || 0;
    const updatedExtra = currentExtra + totalExtra;
    const finalTotalBill = basePrice + updatedExtra;

    const extraChargesPayload = {
      id: jobId,
      jobId: jobId,
      price: basePrice,
      extraCharges: updatedExtra,
      extraLabour: (targetJob?.extraLabour || 0) + extraLabour,
      extraMaterial: (targetJob?.extraMaterial || 0) + extraMaterial,
      extraChargesReason: reason,
      finalTotalBill: finalTotalBill,
      updatedAt: new Date().toISOString()
    };

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...extraChargesPayload } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? ({ ...prev, ...extraChargesPayload }) : null);
    }

    try {
      await setDoc(doc(db, 'jobs', jobId), extraChargesPayload, { merge: true });
      await setDoc(doc(db, 'bookings', jobId), extraChargesPayload, { merge: true });
      await setDoc(doc(db, 'emergencyBookings', jobId), extraChargesPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Extra charges of +₹${totalExtra.toFixed(2)} added to Job #${jobId} (Final Bill: ₹${finalTotalBill.toFixed(2)}). Justification: "${reason}"`,
        user: currentUser?.name || 'Rajesh Kumar',
        role: 'technician',
        jobId: jobId,
        extraCharges: updatedExtra,
        finalTotal: finalTotalBill,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore extra charges update error:', err);
    }

    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraChargesPayload)
    }).catch(err => console.warn('Express API extra charges sync error:', err));

    showToast(`⚡ Real-Time Bill Updated: +₹${totalExtra.toFixed(2)} added to #${jobId} (Final Total: ₹${finalTotalBill.toFixed(2)})`);
  };

  const handleReportDelay = (jobId: string, reasonType: string, notes: string) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const cancellationReasonStr = notes ? `${reasonType} — ${notes}` : reasonType;

    const updatedJobState = {
      status: 'Cancelled',
      cancellationReason: cancellationReasonStr,
      cancelledBy: currentUser?.name || 'Rajesh Kumar',
      updatedAt: new Date().toISOString()
    };

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updatedJobState } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? ({ ...prev, ...updatedJobState }) : null);
    }
    setDelayModalOpen(false);

    showToast(`Job cancelled successfully`);

    const alertId = `DISP-ALERT-${Date.now()}`;
    const alertItem = {
      id: alertId,
      jobId: jobId,
      title: `🚨 MID-SERVICE CANCELLATION REQUEST - #${jobId}`,
      time: 'Just now',
      address: targetJob?.location || '104 MG Road, Kodialbail, Mangaluru',
      priority: 'Priority Level 10',
      category: 'CANCELLATION',
      type: 'URGENT',
      icon: '🚫',
      colorClass: 'bg-rose-50 border-rose-200 hover:border-rose-400',
      iconBg: 'bg-rose-100 text-rose-700 font-bold',
      customerName: targetJob?.customerName || 'Customer',
      customerPhone: targetJob?.customerPhone || '',
      technicianName: currentUser?.name || 'Rajesh Kumar',
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      targetDispatcher: DISPATCHER_EMAIL,
      region: MANGALURU_REGION,
      reasonType: reasonType,
      notes: cancellationReasonStr,
      price: targetJob?.price ? `${targetJob.price.toFixed(2)}` : '499.00',
      createdAt: new Date().toISOString()
    };

    try {
      const localData = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify([alertItem, ...localData]));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));
      window.dispatchEvent(new CustomEvent('fixmate_job_status_updated', { detail: { jobId, status: 'Cancelled', cancellationReason: cancellationReasonStr } }));
    } catch(e) {}

    const cancelPayload = {
      id: jobId,
      jobId: jobId,
      status: 'Cancelled',
      cancellationReason: cancellationReasonStr,
      cancelledBy: currentUser?.name || 'Rajesh Kumar',
      updatedAt: new Date().toISOString()
    };

    const logId = `LOG-${Date.now()}`;
    const auditPayload = {
      id: logId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: `🚨 MID-SERVICE CANCELLATION REQUEST for Job #${jobId} by ${currentUser?.name || 'Rajesh Kumar'}. Reason: "${cancellationReasonStr}"`,
      user: currentUser?.name || 'Rajesh Kumar',
      role: 'technician',
      jobId: jobId,
      priority: 'URGENT',
      createdAt: new Date().toISOString()
    };

    Promise.allSettled([
      setDoc(doc(db, 'dispatches', alertId), alertItem, { merge: true }),
      setDoc(doc(db, 'dispatcher_alerts', alertId), alertItem, { merge: true }),
      setDoc(doc(db, 'jobs', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'bookings', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'emergencyBookings', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'audit_logs', logId), auditPayload, { merge: true }),
      fetch('http://localhost:5000/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertItem)
      })
    ]).catch(err => console.warn('Background cancellation sync error:', err));
  };

  const handleAuthSuccess = (userData: TechUserData, message: string) => {
    setCurrentUser(userData);
    showToast(message);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }

    try {
      localStorage.removeItem('fixmate_user');
      localStorage.removeItem('fixmate_tech_availability');
      localStorage.removeItem('fixmate_assigned_jobs');
      localStorage.removeItem('fixmate_urgent_dispatches');
    } catch (e) {}

    setJobs([]);
    setSelectedJob(null);
    setEmergencyList([]);
    setRatingsList([]);
    setNotifications([]);
    setCurrentUser(null);

    showToast('🔒 Logged out successfully! Account state cleared.');

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const getPageTitle = () => {
    if (selectedJob) return `Job Details: #${selectedJob.id}`;
    switch (activeTab) {
      case 'dashboard': return 'Technician Hub — Mangaluru Region';
      case 'jobs': return 'Assigned Jobs Hub (Mangaluru)';
      case 'emergency': return 'Emergency Requests (Mangaluru)';
      case 'performance': return 'Performance & Analytics';
      case 'profile': return 'Technician Profile & Settings';
      default: return 'Technician Portal — Mangaluru';
    }
  };

  return (
    <ProtectedRoute allowedRole="technician">
      <div className="min-h-screen bg-[#EEF4ED] text-[#0B2545] font-sans flex flex-col antialiased selection:bg-[#134074] selection:text-white">
        
        <TechHeader 
          title={getPageTitle()}
          availability={availability}
          onToggleAvailability={handleToggleAvailability}
          notifications={notifications}
          onTriggerEmergency={() => setEmergencyModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode: mode as 'login' | 'signup' })}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedJob(null);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {selectedJob ? (
            <div className="animate-in fade-in duration-300">
              <TechJobDetail 
                job={selectedJob}
                onBack={() => setSelectedJob(null)}
                onUpdateStatus={handleUpdateStatus}
                onOpenExtraCharges={() => setExtraChargesModalOpen(true)}
                onOpenReportDelay={() => setDelayModalOpen(true)}
              />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="animate-in fade-in duration-300">
                  <TechDashboard 
                    jobs={jobs}
                    onSelectJob={(j) => {
                      const found = jobs.find(job => job.id === j.id);
                      if (found) setSelectedJob(found);
                    }}
                    onViewAllJobs={() => setActiveTab('jobs')}
                    onTriggerEmergency={() => setEmergencyModalOpen(true)}
                    maxCapacity={MAX_DAILY_CAPACITY}
                    avgRating={avgRating}
                    positivePercentage={positivePercentage}
                  />
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="animate-in fade-in duration-300">
                  <TechJobList 
                    jobs={jobs}
                    onSelectJob={(j) => {
                      const found = jobs.find(job => job.id === j.id);
                      if (found) setSelectedJob(found);
                    }}
                  />
                </div>
              )}

              {activeTab === 'emergency' && (
                <div className="animate-in fade-in duration-300 bg-white rounded-2xl p-8 shadow-xs border border-slate-200/60 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B2545]">Emergency Requests</h3>
                      <p className="text-xs text-slate-500 font-normal mt-1">Urgent service calls and accepted emergency jobs</p>
                    </div>
                    {emergencyList.length > 0 && (
                      <button 
                        onClick={() => setEmergencyModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>View Emergency Calls ({emergencyList.length})</span>
                      </button>
                    )}
                  </div>

                  {emergencyList.length > 0 && (
                    <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <h4 className="text-sm font-bold text-rose-900">{emergencyList.length} Emergency Call{emergencyList.length > 1 ? 's' : ''} Available</h4>
                        <p className="text-xs text-rose-700 font-normal mt-0.5">Available emergency requests in your service zone.</p>
                      </div>
                      <button 
                        onClick={() => setEmergencyModalOpen(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all shrink-0"
                      >
                        View Requests
                      </button>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Assigned Emergency Jobs</h4>
                    <TechJobList 
                      jobs={jobs.filter(j => j.isEmergency || j.tag === 'EMERGENCY')}
                      onSelectJob={(j) => {
                        const found = jobs.find(job => job.id === j.id);
                        if (found) setSelectedJob(found);
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="animate-in fade-in duration-300">
                  <TechPerformance 
                    jobs={jobs}
                    currentUser={currentUser}
                    availability={availability}
                    ratingsList={ratingsList}
                    avgRating={avgRating}
                    positivePercentage={positivePercentage}
                  />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="animate-in fade-in duration-300">
                  <TechProfile 
                    availability={availability}
                    onToggleAvailability={handleToggleAvailability}
                    currentUser={currentUser}
                    onUpdateProfile={(updated) => setCurrentUser(prev => prev ? ({ ...prev, ...updated }) : null)}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </>
          )}
        </main>

        <TechAuthModal 
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          onAuthSuccess={handleAuthSuccess}
        />

        <TechEmergencyModal 
          isOpen={emergencyModalOpen}
          emergencyList={emergencyList}
          onAccept={handleAcceptEmergency}
          onDecline={() => setEmergencyModalOpen(false)}
        />

        <TechExtraChargesModal 
          isOpen={extraChargesModalOpen}
          job={selectedJob}
          onClose={() => setExtraChargesModalOpen(false)}
          onAddCharges={handleAddExtraCharges}
        />

        <TechDelayModal 
          isOpen={delayModalOpen}
          job={selectedJob}
          onClose={() => setDelayModalOpen(false)}
          onReportDelay={handleReportDelay}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[3000] bg-[#134074] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium border border-white/20 animate-in slide-in-from-bottom duration-300">
            <Info className="w-4 h-4 text-[#8DA9C4] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
