import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, addDoc, deleteDoc, serverTimestamp, DocumentData } from 'firebase/firestore';

export interface DispatchItem {
  id: string;
  jobId?: string;
  reqId?: string;
  title: string;
  time: string;
  address: string;
  location?: string;
  priority?: string;
  category?: string;
  type?: string;
  icon?: string;
  colorClass?: string;
  iconBg?: string;
  recommendedTech?: string;
  techSpecialty?: string;
  distance?: string;
  price?: string | number;
  customerName?: string;
  targetDispatcher?: string;
  isEmergency?: boolean;
  status?: string;
  collectionName?: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  notes?: string;
  requestPreviousTechnician?: boolean;
  requestPreviousTech?: boolean;
  requestedTechName?: string;
  previousTechnicianName?: string;
  cancelledBy?: string | null;
  cancelledTechName?: string | null;
  cancelledTechs?: string[];
  technicianName?: string | null;
  [key: string]: unknown;
}

export interface RequestItem {
  id: string;
  customer: string;
  customerName?: string;
  initials: string;
  service: string;
  status: string;
  rawStatus?: string;
  location: string;
  address: string;
  customerAddress: string;
  color: string;
  icon: string;
  assignedTech?: string | null;
  cancelledBy?: string | null;
  cancelledTechName?: string | null;
  cancelledTechs?: string[];
  description: string;
  notes: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  requestPreviousTechnician: boolean;
  requestPreviousTech: boolean;
  requestedTechName: string;
  previousTechnicianName: string;
  isEmergency: boolean;
  collectionName: string;
  createdAt?: { seconds: number } | string | null;
  isCustomerDoc?: boolean;
  [key: string]: unknown;
}

export interface TechnicianItem {
  id: string;
  uid?: string;
  name: string;
  assigned: number;
  completed: number;
  travel?: number;
  status: string;
  specialty: string;
  zone: string;
  phone: string;
  assignedJobsCount?: number;
  completedJobsCount?: number;
  availability?: string;
  [key: string]: unknown;
}

export interface LiveTechnicianItem {
  id: string;
  jobId: string;
  name: string;
  phone: string;
  role: string;
  activeJobTitle: string;
  eta: string;
  destination: string;
  currentLocation: string;
  status: string;
  progress: number;
  initials: string;
  cx: number;
  cy: number;
  assignedTimeLabel: string;
  acceptedTimeLabel: string;
  onWayTimeLabel: string;
}

export type LiveTechnician = LiveTechnicianItem;
export type ServiceRequest = RequestItem;
export type TechnicianRosterItem = TechnicianItem;

export interface ActivityItem {
  id: number | string;
  text: string;
  time: string;
  meta: string;
  rating?: string;
  type: string;
  dotColor: string;
}

export interface LogItem {
  timestamp: string;
  event: string;
  user: string;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  createdAt?: unknown;
}

export interface NewRequestData {
  title: string;
  customerName: string;
  customerPhone: string;
  address: string;
  category: string;
  service: string;
  price: string;
  type: string;
  date: string;
  timeSlot: string;
  requestPreviousTechnician: boolean;
  isEmergency: boolean;
  notes: string;
}

export default function useDispatcherState() {
  const router = useRouter();
  
  const DISPATCHER_EMAIL = 'dispatcher@fixmate.com';
  
  const [dispatcherStatus, setDispatcherStatus] = useState('Online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTabState] = useState('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab');
      const savedTab = localStorage.getItem('fixmate_dispatcher_active_tab');
      const validTabs = ['dashboard', 'requests', 'technicians', 'map', 'logs'];
      
      const tabToUse = (urlTab && validTabs.includes(urlTab)) 
        ? urlTab 
        : (savedTab && validTabs.includes(savedTab)) 
        ? savedTab 
        : 'dashboard';

      setActiveTabState(tabToUse);
    }
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fixmate_dispatcher_active_tab', tab);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
      } catch(e) {}
    }
  };

  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [requests, setRequests] = useState<RequestItem[]>([]);

  const [dispatches, setDispatches] = useState<DispatchItem[]>([
    { 
      id: 'DISP-4820', 
      title: 'Main Pipe Burst & Floor Flooding', 
      time: '4 mins ago', 
      address: '1204 Oak Ridge Dr, Sector 4', 
      priority: 'Priority Level 10', 
      category: 'PLUMBING', 
      type: 'RESIDENTIAL', 
      icon: '💧', 
      colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300', 
      iconBg: 'bg-rose-100 text-rose-600',
      recommendedTech: 'Dave R.',
      techSpecialty: 'Plumbing',
      distance: '1.2 km away',
      price: '1499.00',
      customerName: 'Priya Sharma',
      targetDispatcher: DISPATCHER_EMAIL
    },
    { 
      id: 'DISP-4821', 
      title: 'Full Power Loss & Sparking Panel', 
      time: '12 mins ago', 
      address: '88 Skyway Ave, Suite 402', 
      priority: 'Priority Level 8', 
      category: 'ELECTRICAL', 
      type: 'URGENT', 
      icon: '⚡', 
      colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300', 
      iconBg: 'bg-blue-100 text-blue-600',
      recommendedTech: 'Sarah J.',
      techSpecialty: 'Electrical',
      distance: '2.4 km away',
      price: '1199.00',
      customerName: 'Robert Kovich',
      targetDispatcher: DISPATCHER_EMAIL
    },
    { 
      id: 'DISP-4822', 
      title: 'AC Compressor Failure & Smoke', 
      time: '18 mins ago', 
      address: '742 Bandra West, Sec 3', 
      priority: 'Priority Level 9', 
      category: 'HVAC', 
      type: 'URGENT', 
      icon: '❄️', 
      colorClass: 'bg-amber-50 border-amber-100 hover:border-amber-300', 
      iconBg: 'bg-amber-100 text-amber-600',
      recommendedTech: 'Mike T.',
      techSpecialty: 'HVAC',
      distance: '3.1 km away',
      price: '1299.00',
      customerName: 'Aarav Mehta',
      targetDispatcher: DISPATCHER_EMAIL
    }
  ]);

  useEffect(() => {
    let unsubBookings: (() => void) | null = null;
    let unsubEmergency: (() => void) | null = null;
    let unsubJobs: (() => void) | null = null;
    
    let bookingsList: import('firebase/firestore').DocumentSnapshot<DocumentData>[] = [];
    let emergencyList: import('firebase/firestore').DocumentSnapshot<DocumentData>[] = [];
    let jobsList: import('firebase/firestore').DocumentSnapshot<DocumentData>[] = [];
    
    const getServiceType = (docCategory?: string, docService?: string) => {
      const cat = (docCategory || docService || '').toLowerCase();
      if (cat.includes('plumb')) return 'Plumbing';
      if (cat.includes('elect')) return 'Electrical';
      if (cat.includes('ac_') || cat.includes('ac ') || cat.includes('hvac') || cat.includes('air conditioning')) return 'AC Maintenance';
      if (cat.includes('appliance')) return 'Appliance';
      if (cat.includes('clean')) return 'Cleaning';
      if (cat.includes('carpen')) return 'Carpentry';
      if (cat.includes('paint')) return 'Painting';
      if (cat.includes('pest')) return 'Pest Control';
      return docService || docCategory || 'Other';
    };

    const getServiceIcon = (_serviceType: string) => {
      return '';
    };

    const getServiceColor = (serviceType: string) => {
      const s = serviceType.toLowerCase();
      if (s.includes('plumb')) return 'bg-blue-100 text-blue-700';
      if (s.includes('elect')) return 'bg-yellow-100 text-yellow-800';
      if (s.includes('ac ') || s.includes('ac_') || s.includes('hvac') || s.includes('air conditioning') || s.includes('maintenance')) return 'bg-indigo-100 text-indigo-800';
      if (s.includes('appliance')) return 'bg-slate-200 text-slate-800';
      if (s.includes('clean')) return 'bg-emerald-100 text-emerald-800';
      if (s.includes('carpen')) return 'bg-amber-100 text-amber-800';
      if (s.includes('paint')) return 'bg-purple-100 text-purple-800';
      if (s.includes('pest')) return 'bg-red-100 text-red-800';
      return 'bg-slate-100 text-slate-700';
    };

    const processLists = () => {
      const mapItem = (d: import('firebase/firestore').DocumentSnapshot<DocumentData>, isEmergency: boolean): RequestItem => {
        const data = (d.data() || {}) as Record<string, unknown>;
        const rawStatus = (data.status as string) || (isEmergency ? 'Emergency Pending' : 'Pending');
        
        let status = 'UNASSIGNED';
        const s = rawStatus.toUpperCase();
        const cancelledByWho = (data.cancelledBy || data.cancelledTechName) as string;
        const currentAssigned = (data.assignedTech || data.technicianName || data.assignedTechName || data.assignedTo) as string;
        const isCancelledWithoutNewTech = cancelledByWho && (!currentAssigned || currentAssigned === cancelledByWho);

        if (s.includes('PENDING') || s === 'UNASSIGNED') {
          status = 'UNASSIGNED';
        } else if (s.includes('COMPLETED') || s.includes('FINISHED') || s.includes('DONE')) {
          status = 'COMPLETED';
        } else if (s.includes('CANCEL') || isCancelledWithoutNewTech) {
          status = 'CANCELLED';
        } else if (s.includes('WAY') || s.includes('REACHED') || s.includes('START') || s.includes('PROGRESS') || s.includes('ACTIVE') || s.includes('TRANSIT')) {
          status = 'IN-PROGRESS';
        } else {
          status = 'ASSIGNED';
        }
        
        const serviceType = getServiceType(data.category as string, data.service as string);
        const rawTech = String(data.technicianName || data.assignedTechName || data.assignedTech || data.assignedTo || '');
        let customer = (data.customerName || data.customer || '') as string;

        if (customer && rawTech && customer.trim().toLowerCase() === rawTech.trim().toLowerCase()) {
          customer = (data.customerEmail || data.customerPhone || data.phone || 'Customer') as string;
        }
        if (!customer) {
          customer = (data.customerEmail || 'Customer') as string;
        }

        const initials = customer.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CU';
        
        return {
          id: d.id,
          customer,
          initials,
          service: serviceType,
          status,
          rawStatus,
          location: (data.customerAddress || data.address || data.location || data.siteAddress || 'Mangaluru') as string,
          address: (data.customerAddress || data.address || data.location || data.siteAddress || 'Mangaluru') as string,
          customerAddress: (data.customerAddress || data.address || data.location || data.siteAddress || 'Mangaluru') as string,
          color: getServiceColor(serviceType),
          icon: getServiceIcon(serviceType),
          assignedTech: (data.status && ((data.status as string).toUpperCase() === 'UNASSIGNED' || (data.status as string).toUpperCase().includes('PENDING'))) ? null : ((data.technicianName || data.assignedTechName || data.assignedTech || data.assignedTo || null) as string | null),
          cancelledBy: (data.cancelledBy || data.cancelledTechName || null) as string | null,
          cancelledTechName: (data.cancelledTechName || data.cancelledBy || null) as string | null,
          cancelledTechs: Array.isArray(data.cancelledTechs) ? (data.cancelledTechs as string[]) : (data.cancelledBy || data.cancelledTechName ? [String(data.cancelledBy || data.cancelledTechName)] : []),
          description: (data.description || data.notes || '') as string,
          notes: (data.notes || '') as string,
          customerId: (data.customerId || '') as string,
          customerEmail: (data.customerEmail || '') as string,
          customerPhone: (data.customerPhone || data.phone || '') as string,
          requestPreviousTechnician: Boolean(data.requestPreviousTechnician || data.requestPreviousTech),
          requestPreviousTech: Boolean(data.requestPreviousTechnician || data.requestPreviousTech),
          requestedTechName: (data.requestedTechName || data.requestedTech || data.requestedTechnician || data.requestedTechnicianName || data.previousTechnicianName || data.previousTechnician || data.previousTechName || data.previousTech || data.preferredTechnician || data.preferredTech || '') as string,
          previousTechnicianName: (data.previousTechnicianName || data.previousTechnician || data.previousTechName || data.previousTech || '') as string,
          isEmergency,
          collectionName: isEmergency ? 'emergencyBookings' : 'bookings',
          createdAt: data.createdAt as { seconds: number } | string | null
        };
      };
      
      const itemMap = new Map<string, RequestItem>();

      const processDoc = (d: import('firebase/firestore').DocumentSnapshot<DocumentData>, isEmergency: boolean, isFromCustomerCollection = false) => {
        const item = mapItem(d, isEmergency);
        if (!itemMap.has(item.id)) {
          itemMap.set(item.id, { ...item, isCustomerDoc: isFromCustomerCollection });
        } else {
          const existing = itemMap.get(item.id)!;
          
          const preserveCustomer = (existing.isCustomerDoc && existing.customer && existing.customer !== 'Customer') 
            ? existing.customer 
            : (isFromCustomerCollection && item.customer && item.customer !== 'Customer') 
              ? item.customer 
              : (existing.customer && existing.customer !== 'Customer' ? existing.customer : item.customer);

          const preserveEmail = existing.isCustomerDoc ? (existing.customerEmail || item.customerEmail) : (item.customerEmail || existing.customerEmail);
          const preservePhone = existing.isCustomerDoc ? (existing.customerPhone || item.customerPhone) : (item.customerPhone || existing.customerPhone);
          const preserveInitials = preserveCustomer.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CU';

          itemMap.set(item.id, {
            ...existing,
            ...item,
            customer: preserveCustomer,
            customerName: preserveCustomer,
            customerEmail: preserveEmail,
            customerPhone: preservePhone,
            initials: preserveInitials,
            assignedTech: item.assignedTech || existing.assignedTech || null,
            status: item.status || existing.status || 'UNASSIGNED',
            rawStatus: item.rawStatus || existing.rawStatus,
            isCustomerDoc: existing.isCustomerDoc || isFromCustomerCollection
          });
        }
      };

      bookingsList.forEach(item => processDoc(item, false, true));
      emergencyList.forEach(item => processDoc(item, true, true));
      jobsList.forEach(item => processDoc(item, false, false));

      const combined = Array.from(itemMap.values());
      
      combined.sort((a, b) => {
        const tA = (a.createdAt && typeof a.createdAt === 'object' && 'seconds' in a.createdAt) ? a.createdAt.seconds : 0;
        const tB = (b.createdAt && typeof b.createdAt === 'object' && 'seconds' in b.createdAt) ? b.createdAt.seconds : 0;
        return tB - tA;
      });
      
      setRequests(combined);
    };

    try {
      const bookingsRef = collection(db, 'bookings');
      unsubBookings = onSnapshot(bookingsRef, (snapshot) => {
        bookingsList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Bookings subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to bookings:', e);
    }

    try {
      const emergencyRef = collection(db, 'emergencyBookings');
      unsubEmergency = onSnapshot(emergencyRef, (snapshot) => {
        emergencyList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Emergency bookings subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to emergency bookings:', e);
    }

    try {
      const jobsRef = collection(db, 'jobs');
      unsubJobs = onSnapshot(jobsRef, (snapshot) => {
        jobsList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Jobs subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to jobs:', e);
    }

    const handleStatusUpdateEvent = (e: Event | StorageEvent | CustomEvent) => {
      let detail = (e as CustomEvent)?.detail;
      if (!detail && (e as StorageEvent)?.key === 'fixmate_last_job_status_update' && (e as StorageEvent)?.newValue) {
        try { detail = JSON.parse((e as StorageEvent).newValue!); } catch(err) {}
      }
      if (!detail) {
        try {
          const raw = localStorage.getItem('fixmate_last_job_status_update');
          if (raw) detail = JSON.parse(raw);
        } catch(err) {}
      }

      const targetJobId = detail?.id || detail?.jobId;
      const targetStatus = detail?.status;
      const targetTech = detail?.technicianName || detail?.assignedTechName || detail?.assignedTech || detail?.techName;

      if (targetStatus && (targetJobId || targetTech)) {
        setRequests(prev => prev.map(r => {
          const isTarget = (targetJobId && r.id === targetJobId) || 
            (targetTech && r.assignedTech && (
              r.assignedTech.toLowerCase() === targetTech.toLowerCase() ||
              targetTech.toLowerCase().includes(r.assignedTech.toLowerCase()) ||
              r.assignedTech.toLowerCase().includes(targetTech.toLowerCase())
            ));

          if (isTarget) {
            const rawStatus = targetStatus;
            let normStatus = 'IN-PROGRESS';
            const s = (targetStatus as string).toUpperCase();
            if (s.includes('COMPLET') || s.includes('DONE')) normStatus = 'COMPLETED';
            else if (s.includes('CANCEL')) normStatus = 'CANCELLED';
            else if (s.includes('UNASSIGN')) normStatus = 'UNASSIGNED';
            else if (s.includes('ASSIGN') || s.includes('ACCEPT')) normStatus = 'ASSIGNED';

            return {
              ...r,
              rawStatus,
              status: normStatus
            };
          }
          return r;
        }));
      }
    };

    window.addEventListener('fixmate_job_status_updated', handleStatusUpdateEvent as EventListener);
    window.addEventListener('storage', handleStatusUpdateEvent as EventListener);

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubEmergency) unsubEmergency();
      if (unsubJobs) unsubJobs();
      window.removeEventListener('fixmate_job_status_updated', handleStatusUpdateEvent as EventListener);
      window.removeEventListener('storage', handleStatusUpdateEvent as EventListener);
    };
  }, []);

  const unassignedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'UNASSIGNED').length;
  }, [requests]);

  const inProgressRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length;
  }, [requests]);

  const completedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'COMPLETED').length;
  }, [requests]);
  
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const activeJobsCount = useMemo(() => {
    return requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length;
  }, [requests]);

  const totalRequestsCount = useMemo(() => {
    return requests.length;
  }, [requests]);

  const pendingEmergenciesCount = useMemo(() => {
    const unassignedEmergencyRequests = requests.filter(r => r.isEmergency && r.status === 'UNASSIGNED');
    const emergencyDispatchItems = dispatches.filter(d => 
      (d.priority && (d.priority.includes('10') || d.priority.includes('9') || d.priority.includes('8'))) ||
      d.type === 'URGENT' || 
      d.category === 'CANCELLATION' ||
      d.isEmergency
    );

    const uniqueEmergencyIds = new Set([
      ...unassignedEmergencyRequests.map(r => r.id),
      ...emergencyDispatchItems.map(d => d.id || d.jobId)
    ]);

    return uniqueEmergencyIds.size;
  }, [requests, dispatches]);

  const emergencyRequests = useMemo(() => {
    return requests.filter(r => r.isEmergency && r.status === 'UNASSIGNED');
  }, [requests]);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let unsubAlerts: (() => void) | null = null;
    try {
      const alertsRef = collection(db, 'dispatcher_alerts');
      unsubAlerts = onSnapshot(alertsRef, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let formattedTime = data.time as string;
            if (!formattedTime || formattedTime === 'Just now') {
              if (data.createdAt) {
                const dateObj = data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(data.createdAt);
                formattedTime = isNaN(dateObj.getTime()) ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else {
                formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            }
            return {
              id: docSnap.id,
              title: (data.title || 'System Alert') as string,
              message: (data.notes || data.message || 'No additional details.') as string,
              time: formattedTime,
              createdAt: data.createdAt
            };
          });
          
          list.sort((a, b) => {
            const tA = new Date(a.createdAt as string).getTime() || 0;
            const tB = new Date(b.createdAt as string).getTime() || 0;
            return tB - tA;
          });
          setNotifications(list);
        } else {
          setNotifications([]);
        }
      }, (err) => console.warn('Alerts subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to dispatcher alerts:', e);
    }
    return () => {
      if (unsubAlerts) unsubAlerts();
    };
  }, []);

  useEffect(() => {
    let unsubDispatches: (() => void) | null = null;
    let unsubEmergencyBookings: (() => void) | null = null;

    let firestoreDispatches: DispatchItem[] = [];
    let firestoreEmergencyBookings: import('firebase/firestore').DocumentSnapshot<DocumentData>[] = [];

    const syncDispatchesFeed = () => {
      const activeFirestoreDispatches = firestoreDispatches.filter(d => {
        const s = (d.status || '').toUpperCase();
        return s !== 'ASSIGNED' && !s.includes('ASSIGN') && !s.includes('COMPLET');
      });

      const emgItems = firestoreEmergencyBookings.map(d => {
        const data = (d.data() || {}) as Record<string, unknown>;
        const isUnassigned = !data.status || (data.status as string).toUpperCase().includes('PENDING') || data.status === 'UNASSIGNED';
        if (!isUnassigned) return null;

        const combinedText = `${data.title || ''} ${data.serviceName || ''} ${data.service || ''} ${data.category || ''}`.toLowerCase();
        let determinedTrade = '';
        if (combinedText.includes('carpen')) determinedTrade = 'Carpentry';
        else if (combinedText.includes('plumb')) determinedTrade = 'Plumbing';
        else if (combinedText.includes('elect')) determinedTrade = 'Electrical';
        else if (combinedText.includes('ac ') || combinedText.includes('ac_') || combinedText.includes('hvac') || combinedText.includes('air conditioning') || combinedText.includes('maintenance')) determinedTrade = 'AC Maintenance';
        else if (combinedText.includes('clean')) determinedTrade = 'Cleaning';
        else if (combinedText.includes('appliance') || combinedText.includes('microwave') || combinedText.includes('fridge') || combinedText.includes('washing')) determinedTrade = 'Appliance Repair';
        else if (combinedText.includes('paint')) determinedTrade = 'Painting';
        else if (combinedText.includes('pest')) determinedTrade = 'Pest Control';
        else determinedTrade = (data.service || data.category || 'Emergency') as string;

        return {
          id: d.id,
          title: determinedTrade,
          time: (data.time || 'Live Broadcast') as string,
          address: (data.customerAddress || data.address || data.location || data.siteAddress || 'Mangaluru') as string,
          priority: 'Priority Level 10',
          category: determinedTrade.toUpperCase(),
          type: 'URGENT',
          icon: '⚡',
          colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300',
          iconBg: 'bg-rose-100 text-rose-600',
          recommendedTech: (data.recommendedTech || data.assignedTech || 'Rajesh Kumar') as string,
          techSpecialty: (data.category || 'Emergency') as string,
          distance: (data.distance || '1.2 km away') as string,
          price: data.price ? String(data.price) : '1499.00',
          customerName: (data.customerName || data.customer || 'Customer') as string,
          targetDispatcher: DISPATCHER_EMAIL,
          isEmergency: true
        } as DispatchItem;
      }).filter(Boolean) as DispatchItem[];

      const localData = (() => {
        try {
          const list = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
          return list.filter((d: DispatchItem) => {
            const s = (d.status || '').toUpperCase();
            return s !== 'ASSIGNED' && !s.includes('ASSIGN') && !s.includes('COMPLET');
          });
        } catch(e) { return []; }
      })();

      const combined = [...activeFirestoreDispatches, ...emgItems, ...localData];
      const uniqueMap = new Map<string, DispatchItem>();
      combined.forEach(item => {
        if (!item) return;
        const key = (item.jobId || item.reqId || item.id) as string;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        } else {
          const existing = uniqueMap.get(key)!;
          uniqueMap.set(key, { ...existing, ...item });
        }
      });
      setDispatches(Array.from(uniqueMap.values()));
    };

    try {
      const dispatchesRef = collection(db, 'dispatches');
      unsubDispatches = onSnapshot(dispatchesRef, (snapshot) => {
        firestoreDispatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DispatchItem));
        syncDispatchesFeed();
      }, (err) => console.warn('Dispatches subscription warning:', err));
    } catch(err) {
      console.warn('Dispatches error:', err);
    }

    try {
      const emgRef = collection(db, 'emergencyBookings');
      unsubEmergencyBookings = onSnapshot(emgRef, (snapshot) => {
        firestoreEmergencyBookings = snapshot.docs;
        syncDispatchesFeed();
      }, (err) => console.warn('Emergency bookings subscription warning:', err));
    } catch(err) {
      console.warn('Emergency bookings error:', err);
    }

    const handleSync = () => syncDispatchesFeed();
    window.addEventListener('storage', handleSync);
    window.addEventListener('fixmate_dispatch_updated', handleSync);

    return () => {
      if (unsubDispatches) unsubDispatches();
      if (unsubEmergencyBookings) unsubEmergencyBookings();
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fixmate_dispatch_updated', handleSync);
    };
  }, []);

  const [technicians, setTechnicians] = useState<TechnicianItem[]>([]);

  useEffect(() => {
    let unsubTechs: (() => void) | null = null;
    try {
      const techsRef = collection(db, 'technicians');
      unsubTechs = onSnapshot(techsRef, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreTechs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const rawStatus = (data.availability || data.status || 'Available') as string;
            const formattedStatus = rawStatus === 'ONLINE' ? 'Available' : rawStatus === 'BUSY' ? 'Busy' : rawStatus;
            return {
              id: docSnap.id,
              name: (data.name || data.fullName || 'Rajesh Kumar') as string,
              assigned: Math.min(6, Number(data.assignedJobsCount || 0)),
              completed: Number(data.completedJobsCount || data.completed || 0),
              travel: 1,
              status: formattedStatus,
              specialty: (data.specialization || (Array.isArray(data.skills) ? data.skills.join(', ') : data.specialty) || 'Plumbing') as string,
              zone: (data.workingArea || data.serviceArea || data.zone || 'Kodialbail & Hampankatta, Mangaluru') as string,
              phone: (data.phone || data.mobile || '+91 98765 43210') as string
            };
          });

          setTechnicians(firestoreTechs);
        } else {
          setTechnicians([]);
        }
      }, (err) => console.warn('Technicians subscription warning:', err));
    } catch(err) {
      console.warn('Firestore error:', err);
    }

    return () => {
      if (unsubTechs) unsubTechs();
    };
  }, []);

  const liveTechnicians = useMemo(() => {
    const knownCoords: Record<string, { x: number; y: number }> = {
      kodialbail: { x: 260, y: 240 },
      hampankatta: { x: 320, y: 280 },
      kadri: { x: 420, y: 210 },
      bejai: { x: 380, y: 180 },
      lalbagh: { x: 330, y: 200 },
      padil: { x: 540, y: 320 },
      kavoor: { x: 450, y: 130 },
      urwa: { x: 220, y: 170 },
      attavar: { x: 280, y: 340 },
      surathkal: { x: 180, y: 120 },
      kulshekar: { x: 500, y: 250 },
      falnir: { x: 310, y: 310 }
    };

    const hashStr = (str?: string) => {
      let hash = 0;
      for (let i = 0; i < (str || '').length; i++) {
        hash = (str || '').charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const assignedRequests = requests.filter(r => {
      if (!r) return false;
      const statusUpper = (r.status || '').toUpperCase();
      if (statusUpper === 'UNASSIGNED' || statusUpper === 'CANCELLED' || statusUpper === 'COMPLETED') return false;

      if (r.category === 'CANCELLATION' || (typeof r.title === 'string' && r.title.toUpperCase().includes('CANCELLATION'))) return false;

      const raw = ((r.rawStatus as string) || r.status || '').toLowerCase();
      if (raw.includes('cancel')) return false;

      const hasTech = Boolean(r.assignedTech || r.technicianName || r.assignedTechName || r.assignedTo);
      const isActiveStatus = ['assigned', 'accepted', 'on the way', 'in transit', 'enroute', 'reached location', 'reached', 'service started', 'in-progress', 'in progress', 'busy'].some(s => raw.includes(s));
      return hasTech && isActiveStatus;
    });

    assignedRequests.sort((a, b) => {
      const aSec = (a.createdAt && typeof a.createdAt === 'object' && 'seconds' in a.createdAt) ? a.createdAt.seconds : 0;
      const bSec = (b.createdAt && typeof b.createdAt === 'object' && 'seconds' in b.createdAt) ? b.createdAt.seconds : 0;
      return bSec - aSec;
    });

    const activeList: LiveTechnicianItem[] = [];
    const processedTechNames = new Set<string>();

    assignedRequests.forEach(req => {
      const techName = String(req.assignedTech || req.technicianName || req.assignedTechName || req.assignedTo || 'Technician');
      const techKey = techName.toLowerCase().trim();

      const cancelledList = [
        req.cancelledBy,
        req.cancelledTechName,
        req.cancelledByTechName,
        ...(Array.isArray(req.cancelledTechs) ? req.cancelledTechs : []),
        ...(Array.isArray(req.cancelledByList) ? (req.cancelledByList as string[]) : [])
      ].filter(Boolean).map(s => String(s).toLowerCase().trim());

      if (cancelledList.some(c => c === techKey || techKey.includes(c) || c.includes(techKey))) {
        return;
      }
      
      if (processedTechNames.has(techKey)) return;
      processedTechNames.add(techKey);

      const techObj = technicians.find(t => 
        t.name.toLowerCase() === techKey ||
        techKey.includes(t.name.toLowerCase()) ||
        t.name.toLowerCase().includes(techKey)
      );

      const techId = techObj?.id || `tech_${hashStr(techName)}`;

      const lastStatusUpdate = (() => {
        if (typeof window === 'undefined') return null;
        try {
          const raw = localStorage.getItem('fixmate_last_job_status_update');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.status) {
              const targetTech = parsed.technicianName || parsed.assignedTechName || parsed.assignedTech || parsed.techName;
              const targetJobId = parsed.jobId || parsed.id;
              if (req.id === targetJobId || (targetTech && targetTech.toLowerCase() === techKey)) {
                return parsed.status as string;
              }
            }
          }
        } catch(e) {}

        try {
          const jobSpecific = localStorage.getItem(`fixmate_job_status_${req.id}`);
          if (jobSpecific) return jobSpecific;
        } catch(e) {}
        return null;
      })();

      const currentStatus = lastStatusUpdate || (req.rawStatus as string) || req.status || 'Assigned';
      if (currentStatus.toLowerCase().includes('complete') || currentStatus.toLowerCase().includes('cancel')) {
        return;
      }
      const dbLoc = req.location || req.address || techObj?.zone || 'Mangaluru';

      const locKey = Object.keys(knownCoords).find(k => dbLoc.toLowerCase().includes(k));
      let baseCx = 350;
      let baseCy = 250;
      if (locKey) {
        baseCx = knownCoords[locKey].x;
        baseCy = knownCoords[locKey].y;
      } else {
        const h = hashStr(dbLoc);
        baseCx = 180 + (h % 440);
        baseCy = 140 + ((h >> 3) % 280);
      }

      const reqHash = hashStr(req.id || techName);
      const offsetX = ((reqHash % 9) - 4) * 16;
      const offsetY = (((reqHash >> 2) % 9) - 4) * 16;
      const cx = Math.max(120, Math.min(680, baseCx + offsetX));
      const cy = Math.max(100, Math.min(460, baseCy + offsetY));

      const initials = techName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'TK';

      const assignedMinAgo = Math.max(5, (reqHash % 40) + 10);
      const acceptedMinAgo = Math.max(2, Math.floor(assignedMinAgo * 0.6));
      const onWayMinAgo = Math.max(1, Math.floor(assignedMinAgo * 0.3));

      activeList.push({
        id: techId,
        jobId: req.id,
        name: techName,
        phone: techObj?.phone || '+91 98765 43210',
        role: req.service || (req.title as string) || techObj?.specialty || 'Technician',
        activeJobTitle: req.service || (req.title as string) || 'Service Request',
        eta: `${5 + (reqHash % 15)} MIN`,
        destination: dbLoc,
        currentLocation: dbLoc,
        status: currentStatus,
        progress: currentStatus.toLowerCase().includes('start') ? 75 : currentStatus.toLowerCase().includes('reach') ? 50 : 25,
        initials,
        cx,
        cy,
        assignedTimeLabel: `${assignedMinAgo}m ago`,
        acceptedTimeLabel: `${acceptedMinAgo}m ago`,
        onWayTimeLabel: `${onWayMinAgo}m ago`
      });
    });

    return activeList;
  }, [technicians, requests]);

  const [selectedTechForStatus, setSelectedTechForStatus] = useState<string | null>(null);

  const handleTechStatusChange = async (techId: string, newStatus: string) => {
    let dbStatus = 'ONLINE';
    if (newStatus === 'Service Started' || newStatus === 'Busy') {
      dbStatus = 'BUSY';
    } else if (newStatus === 'Offline') {
      dbStatus = 'OFFLINE';
    }

    try {
      const techRef = doc(db, 'technicians', techId);
      await updateDoc(techRef, { availability: dbStatus, status: dbStatus });
      showToast(`Status of technician updated to ${newStatus} in database.`);
    } catch (err) {
      console.error("Error updating technician status in database:", err);
      showToast("❌ Failed to update technician status.");
    }
    setSelectedTechForStatus(null);
  };

  const [activities, setActivities] = useState<ActivityItem[]>([
    { 
      id: 1, 
      text: 'Job #4829 completed by Mike T.', 
      time: '2 mins ago', 
      meta: 'HVAC Maintenance', 
      rating: '5.0', 
      type: 'success', 
      dotColor: 'bg-emerald-500' 
    },
    { 
      id: 2, 
      text: 'Sarah J. arrived at location', 
      time: '15 mins ago', 
      meta: 'Kitchen Leak Fix', 
      type: 'info', 
      dotColor: 'bg-blue-500' 
    },
    { 
      id: 3, 
      text: 'New emergency plumbing request from Sector 4', 
      time: '35 mins ago', 
      meta: 'Unassigned', 
      type: 'warning', 
      dotColor: 'bg-rose-500' 
    }
  ]);

  const [logs, setLogs] = useState<LogItem[]>([
    { timestamp: '14:05', event: 'Main Pipe Burst broadcast created', user: 'System' },
    { timestamp: '13:58', event: 'Job #4829 completed successfully', user: 'Mike T.' },
    { timestamp: '13:50', event: 'Full Power Loss broadcast created', user: 'System' },
    { timestamp: '13:45', event: 'Sarah J. dispatched to Kitchen Leak Fix', user: 'Alex Dispatch' },
    { timestamp: '13:00', event: 'Technician James L. set status to Offline', user: 'James L.' }
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState<NewRequestData>({
    title: '',
    customerName: '',
    customerPhone: '',
    address: '',
    category: 'PLUMBING',
    service: '',
    price: '',
    type: 'RESIDENTIAL',
    date: '',
    timeSlot: '',
    requestPreviousTechnician: false,
    isEmergency: false,
    notes: ''
  });
  
  const [assigningDispatch, setAssigningDispatch] = useState<DispatchItem | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities;
    return activities.filter(act => 
      act.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.meta.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  const enrichedTechnicians = useMemo(() => {
    return technicians.map(tech => {
      const techNameNorm = (tech.name || '').toLowerCase().trim();
      const techIdNorm = (tech.id || '').toLowerCase().trim();

      const techRequests = requests.filter(r => {
        if (!r || r.status === 'UNASSIGNED' || r.status === 'CANCELLED') return false;
        const rTech = String(r.assignedTech || r.technicianName || r.assignedTechName || r.assignedTo || '').toLowerCase().trim();
        if (!rTech) return false;

        return rTech === techNameNorm || 
               rTech === techIdNorm || 
               (techNameNorm && (rTech.includes(techNameNorm) || techNameNorm.includes(rTech)));
      });

      const activeJobsCount = techRequests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length;
      const completedFromRequests = techRequests.filter(r => r.status === 'COMPLETED').length;

      const finalCompleted = Math.min(6, completedFromRequests > 0 ? completedFromRequests : (tech.completed || 0));

      const remainingCapacity = Math.max(0, 6 - finalCompleted);
      const finalAssigned = Math.min(remainingCapacity, activeJobsCount);

      return {
        ...tech,
        assigned: finalAssigned,
        completed: finalCompleted
      };
    });
  }, [technicians, requests]);

  const filteredTechnicians = useMemo(() => {
    if (!searchQuery) return enrichedTechnicians;
    return enrichedTechnicians.filter(tech => 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enrichedTechnicians, searchQuery]);

  const filteredRequests = useMemo(() => {
    const statusPriority: Record<string, number> = { 'UNASSIGNED': 1, 'ASSIGNED': 2, 'IN-PROGRESS': 3, 'COMPLETED': 4 };
    return requests
      .filter(req => {
        if (selectedServiceType !== 'All' && req.service !== selectedServiceType) {
          return false;
        }
        if (selectedStatus !== 'All' && req.status !== selectedStatus) {
          return false;
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesId = req.id.toLowerCase().includes(query);
          const matchesCustomer = req.customer.toLowerCase().includes(query);
          const matchesLocation = req.location.toLowerCase().includes(query);
          if (!matchesId && !matchesCustomer && !matchesLocation) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5));
  }, [requests, selectedServiceType, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const handleServiceTypeChange = (val: string) => {
    setSelectedServiceType(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleOpenAssignFromTable = (req: RequestItem) => {
    setAssigningDispatch({
      id: req.id,
      reqId: req.id,
      title: `${req.service} request`,
      time: 'Just now',
      address: req.customerAddress || req.address || req.location,
      priority: req.isEmergency ? 'Priority Level 10' : 'Priority Level 8',
      category: req.service.toUpperCase(),
      type: req.isEmergency ? 'URGENT' : 'RESIDENTIAL',
      icon: req.icon,
      isEmergency: req.isEmergency,
      collectionName: req.collectionName,
      customerName: req.customer,
      customerId: req.customerId,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone,
      description: req.description,
      notes: req.notes,
      requestPreviousTechnician: Boolean(req.requestPreviousTechnician || req.requestPreviousTech),
      requestPreviousTech: Boolean(req.requestPreviousTechnician || req.requestPreviousTech),
      requestedTechName: req.requestedTechName || req.requestedTech as string || req.previousTechnicianName || req.previousTech as string || '',
      previousTechnicianName: req.previousTechnicianName || req.previousTech as string || '',
      techSpecialty: req.service,
      cancelledBy: req.cancelledBy,
      cancelledTechName: req.cancelledTechName,
      cancelledTechs: req.cancelledTechs,
      technicianName: (req.assignedTech || req.cancelledTechName || req.cancelledBy) as string
    });
  };

  const handleStartJob = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const colName = req.collectionName || (req.isEmergency ? 'emergencyBookings' : 'bookings');
    const updatePayload = {
      status: 'In Progress',
      updatedAt: new Date().toISOString()
    };
    
    try {
      await updateDoc(doc(db, colName, id), updatePayload);
      await setDoc(doc(db, 'jobs', id), { id, status: 'In Progress', updatedAt: new Date().toISOString() }, { merge: true });
      showToast(`⚡ Job ${id} is now IN-PROGRESS.`);
      
      setActivities(prev => [
        { id: Date.now(), text: `Job ${id} started`, time: 'Just now', meta: 'Status updated to IN-PROGRESS', type: 'info', dotColor: 'bg-blue-500' },
        ...prev
      ]);
    } catch (err) {
      console.error("Error starting job in Firestore:", err);
      showToast("❌ Failed to start job.");
    }
  };

  const handleCompleteJob = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const colName = req.collectionName || (req.isEmergency ? 'emergencyBookings' : 'bookings');
    const updatePayload = {
      status: 'Completed',
      updatedAt: new Date().toISOString()
    };
    
    try {
      await updateDoc(doc(db, colName, id), updatePayload);
      await setDoc(doc(db, 'jobs', id), { id, status: 'Completed', updatedAt: new Date().toISOString() }, { merge: true });

      const assignedTechName = req.assignedTech;
      if (assignedTechName) {
        const assignedTechObj = technicians.find(t => 
          t.name.toLowerCase() === assignedTechName.toLowerCase() ||
          t.name.toLowerCase().includes(assignedTechName.toLowerCase()) ||
          assignedTechName.toLowerCase().includes(t.name.toLowerCase())
        );
        if (assignedTechObj && assignedTechObj.id) {
          const techRef = doc(db, 'technicians', assignedTechObj.id);
          const newAssigned = Math.max(0, (assignedTechObj.assigned || 1) - 1);
          const newCompleted = (assignedTechObj.completed || 0) + 1;
          await setDoc(techRef, {
            assignedJobsCount: newAssigned,
            completedJobsCount: newCompleted
          }, { merge: true }).catch(() => {});
        }
      }

      showToast(`✅ Job ${id} marked as COMPLETED.`);
      
      setActivities(prev => [
        { id: Date.now(), text: `Job ${id} completed`, time: 'Just now', meta: 'Status updated to COMPLETED', type: 'success', dotColor: 'bg-emerald-500' },
        ...prev
      ]);
    } catch (err) {
      console.error("Error completing job in Firestore:", err);
      showToast("❌ Failed to complete job.");
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Request ID', 'Customer', 'Service Type', 'Status', 'Location'],
      ...filteredRequests.map(r => [r.id, r.customer, r.service, r.status, r.location])
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `service_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported requests to CSV successfully!');
  };

  const handleOpenAssign = (dispatch: DispatchItem) => {
    setAssigningDispatch(dispatch);
  };

  const handleConfirmAssignment = (techName: string) => {
    const targetDispatch = assigningDispatch || ({} as Partial<DispatchItem>);
    if (!targetDispatch) return;

    setAssigningDispatch(null);
    showToast(`Successfully assigned ${techName}!`);

    const dispatchId = targetDispatch.id;
    const targetJobId = targetDispatch.jobId || targetDispatch.reqId || dispatchId;

    if (dispatchId) {
      setDispatches(prev => prev.filter(d => d.id !== dispatchId && d.id !== targetJobId && d.jobId !== dispatchId && d.jobId !== targetJobId));
      
      deleteDoc(doc(db, 'dispatches', dispatchId)).catch(() => {});
      deleteDoc(doc(db, 'dispatcher_alerts', dispatchId)).catch(() => {});
      if (targetJobId && targetJobId !== dispatchId) {
        deleteDoc(doc(db, 'dispatches', targetJobId)).catch(() => {});
        deleteDoc(doc(db, 'dispatcher_alerts', targetJobId)).catch(() => {});
      }

      fetch(`http://localhost:5000/api/dispatches/${dispatchId}`, { method: 'DELETE' }).catch(() => {});
      try {
        const local = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
        const updated = local.filter((d: DispatchItem) => d.id !== dispatchId && d.jobId !== dispatchId && d.id !== targetJobId && d.jobId !== targetJobId);
        localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify(updated));
        window.dispatchEvent(new Event('fixmate_dispatch_updated'));
      } catch(e) {}
    }

    const requestItem = requests.find(r => (targetDispatch.id && r.id === targetDispatch.id) || (targetDispatch.reqId && r.id === targetDispatch.reqId));
    const selectedTech = technicians.find(t => t.name === techName);
    const targetId = requestItem?.id || targetDispatch.id || `JOB-${Date.now()}`;

    const existingCancelled = Array.isArray(targetDispatch.cancelledTechs) 
      ? targetDispatch.cancelledTechs 
      : (requestItem && Array.isArray(requestItem.cancelledTechs)) 
        ? requestItem.cancelledTechs 
        : [];
    const prevCanceller = targetDispatch.cancelledBy || targetDispatch.cancelledTechName || targetDispatch.technicianName;
    const mergedCancelledTechs = Array.from(new Set([...existingCancelled, prevCanceller].filter(Boolean))) as string[];

    const descriptionToKeep = (requestItem?.description || targetDispatch.description || targetDispatch.notes || requestItem?.notes || 'Customer reported issue requiring on-site technician inspection.') as string;
    const notesToKeep = (requestItem?.notes || targetDispatch.notes || 'Assigned by Dispatcher') as string;

    const combinedText = `${targetDispatch.title || ''} ${targetDispatch.category || ''} ${targetDispatch.service || ''} ${requestItem?.service || ''} ${requestItem?.category || ''}`.toLowerCase();
    let determinedTrade = '';
    if (combinedText.includes('carpen')) determinedTrade = 'Carpentry';
    else if (combinedText.includes('plumb')) determinedTrade = 'Plumbing';
    else if (combinedText.includes('elect')) determinedTrade = 'Electrical';
    else if (combinedText.includes('ac ') || combinedText.includes('ac_') || combinedText.includes('hvac') || combinedText.includes('air conditioning') || combinedText.includes('maintenance')) determinedTrade = 'AC Maintenance';
    else if (combinedText.includes('clean')) determinedTrade = 'Cleaning';
    else if (combinedText.includes('appliance') || combinedText.includes('microwave') || combinedText.includes('fridge') || combinedText.includes('washing')) determinedTrade = 'Appliance Repair';
    else if (combinedText.includes('paint')) determinedTrade = 'Painting';
    else if (combinedText.includes('pest')) determinedTrade = 'Pest Control';
    else {
      determinedTrade = (targetDispatch.category || requestItem?.category || targetDispatch.title || requestItem?.service || 'Plumbing') as string;
      determinedTrade = determinedTrade
        .replace(/MID-SERVICE CANCELLATION REQUEST/gi, '')
        .replace(/CANCELLATION REQUEST/gi, '')
        .replace(/EMERGENCY/gi, '')
        .replace(/URGENT/gi, '')
        .replace(/Service Request/gi, '')
        .replace(/-?\s*#[A-Za-z0-9]+/g, '')
        .replace(/[-–—🚨⚡]/g, '')
        .trim() || 'Plumbing';
    }

    let resolvedCustomerName = requestItem?.customer || targetDispatch.customerName;
    if (!resolvedCustomerName || (techName && resolvedCustomerName.trim().toLowerCase() === techName.trim().toLowerCase())) {
      resolvedCustomerName = requestItem?.customerEmail || targetDispatch.customerEmail || 'Customer';
    }

    const jobPayload = {
      id: targetId,
      jobId: targetId,
      status: 'Assigned',
      technicianId: selectedTech?.id || selectedTech?.uid || 'tech_rajesh_kumar',
      technicianName: techName,
      assignedTechName: techName,
      technicianPhone: selectedTech?.phone || '+91 98765 43210',
      cancelledTechs: mergedCancelledTechs,
      cancelledBy: targetDispatch.cancelledBy || null,
      cancelledTechName: targetDispatch.cancelledTechName || null,
      
      customerId: requestItem?.customerId || targetDispatch.customerId || 'walk-in-dispatcher',
      customerName: resolvedCustomerName,
      customerEmail: requestItem?.customerEmail || targetDispatch.customerEmail || '',
      customerPhone: requestItem?.customerPhone || targetDispatch.customerPhone || requestItem?.phone || '+91 98123 45678',
      description: descriptionToKeep,
      notes: notesToKeep,

      title: determinedTrade,
      category: determinedTrade,
      location: (targetDispatch.address || targetDispatch.location || requestItem?.customerAddress || requestItem?.address || requestItem?.location || 'Mangaluru') as string,
      address: (targetDispatch.address || targetDispatch.location || requestItem?.customerAddress || requestItem?.address || requestItem?.location || 'Mangaluru') as string,
      price: Number(targetDispatch.price || requestItem?.price || 499),
      isEmergency: Boolean(targetDispatch.priority?.includes('10') || requestItem?.isEmergency),
      time: targetDispatch.time || '09:30 AM',
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toISOString()
    };

    (async () => {
      try {
        if (requestItem) {
          const colName = requestItem.collectionName || (requestItem.isEmergency ? 'emergencyBookings' : 'bookings');
          await setDoc(doc(db, colName, targetId), jobPayload, { merge: true });
        }
        await setDoc(doc(db, 'jobs', targetId), jobPayload, { merge: true });
        await setDoc(doc(db, 'bookings', targetId), jobPayload, { merge: true });

        const existingLocal = JSON.parse(localStorage.getItem('fixmate_assigned_jobs') || '[]');
        const updatedLocal = [jobPayload, ...existingLocal.filter((j: { id: string }) => j.id !== targetId)];
        localStorage.setItem('fixmate_assigned_jobs', JSON.stringify(updatedLocal));

        window.dispatchEvent(new CustomEvent('fixmate_job_assigned', { detail: jobPayload }));
        window.dispatchEvent(new Event('fixmate_dispatch_updated'));

        fetch('http://localhost:5000/api/bookings/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobPayload)
        }).catch(() => {});

        if (selectedTech && selectedTech.id) {
          const techRef = doc(db, 'technicians', selectedTech.id);
          await setDoc(techRef, { assignedJobsCount: (selectedTech.assigned || 0) + 1 }, { merge: true });
        }
      } catch (err) {
        console.error("Error setting assignment in Firestore/backend:", err);
      }
    })();

    setActivities(prev => [{
      id: Date.now(),
      text: `${targetDispatch.title || determinedTrade} assigned to ${techName}`,
      time: 'Just now',
      meta: `${targetDispatch.category || determinedTrade} • Assigned by Dispatcher`,
      type: 'info',
      dotColor: 'bg-blue-600'
    }, ...prev]);

    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      event: `${targetDispatch.title || determinedTrade} assigned to ${techName}`,
      user: 'Dispatcher'
    }, ...prev]);
  };

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRequestData.title || !newRequestData.address) return;

    const isEmerg = newRequestData.isEmergency;
    
    let categoryName = 'Plumbing';
    const catUpper = (newRequestData.category || '').toUpperCase();
    if (catUpper.includes('PLUMB')) categoryName = 'Plumbing';
    else if (catUpper.includes('ELECT')) categoryName = 'Electrical';
    else if (catUpper.includes('AC')) categoryName = 'AC Maintenance';
    else if (catUpper.includes('CARPEN')) categoryName = 'Carpentry';
    else if (catUpper.includes('CLEAN')) categoryName = 'Cleaning';
    else if (catUpper.includes('APPLIANCE')) categoryName = 'Appliance';
    else if (catUpper.includes('PAINT')) categoryName = 'Painting';
    else categoryName = newRequestData.category || 'Plumbing';

    const bookingData = {
      customerId: 'walk-in-dispatcher',
      customerName: newRequestData.customerName?.trim() || 'Walk-In Customer',
      customerEmail: 'dispatcher@fixmate.com',
      customerPhone: newRequestData.customerPhone?.trim() || '',

      category: categoryName,
      service: newRequestData.service?.trim() || categoryName,
      price: newRequestData.price ? Number(newRequestData.price) : (isEmerg ? 1499 : 499),
      duration: '1-2 hrs',

      description: newRequestData.title,
      address: newRequestData.address,
      location: newRequestData.address,
      date: isEmerg ? null : (newRequestData.date || null),
      timeSlot: isEmerg ? null : (newRequestData.timeSlot || null),

      requestPreviousTechnician: Boolean(newRequestData.requestPreviousTechnician),
      isEmergency: isEmerg,

      notes: newRequestData.notes?.trim() || 'Created by dispatcher',
      status: isEmerg ? 'Emergency Pending' : 'Pending',

      technicianId: null,
      dispatcherId: DISPATCHER_EMAIL,

      createdAt: serverTimestamp()
    };

    const colName = isEmerg ? 'emergencyBookings' : 'bookings';
    try {
      await addDoc(collection(db, colName), bookingData);
      showToast(`🔥 Created ${isEmerg ? 'Emergency' : 'Standard'} Request for "${newRequestData.title}" in Firestore!`);
    } catch (err) {
      console.error("Error creating request in Firestore:", err);
      showToast("❌ Failed to create request in database.");
    }

    setActivities(prev => [
      { 
        id: Date.now(), 
        text: `New dispatch requested: ${newRequestData.title}`, 
        time: 'Just now', 
        meta: `${newRequestData.address}`, 
        type: isEmerg ? 'danger' : 'info',
        dotColor: isEmerg ? 'bg-rose-500' : 'bg-blue-500' 
      },
      ...prev
    ]);

    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `New dispatch created: ${newRequestData.title}`, user: 'Sarah Jenkins' },
      ...prev
    ]);

    setIsNewRequestOpen(false);
    setNewRequestData({
      title: '',
      customerName: '',
      customerPhone: '',
      address: '',
      category: 'PLUMBING',
      service: '',
      price: '',
      type: 'RESIDENTIAL',
      date: '',
      timeSlot: '',
      requestPreviousTechnician: false,
      isEmergency: false,
      notes: ''
    });
  };

  const staggeredMenuItems = [
    { label: 'Dashboard', ariaLabel: 'Dispatcher Dashboard', onClick: () => setActiveTab('dashboard') },
    { label: 'Requests', ariaLabel: 'View service requests', onClick: () => setActiveTab('requests') },
    { label: 'Technicians', ariaLabel: 'Manage technicians', onClick: () => setActiveTab('technicians') },
    { label: 'Live Map', ariaLabel: 'Live dispatch map', onClick: () => setActiveTab('map') },
    { label: 'Home', ariaLabel: 'Return to home landing page', link: '/' }
  ];

  const socialItems = [
    { label: 'New Request', onClick: () => setIsNewRequestOpen(true) },
    { label: 'Home', link: '/' }
  ];

  return {
    router,
    dispatcherStatus,
    setDispatcherStatus,
    showStatusDropdown,
    setShowStatusDropdown,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    selectedServiceType,
    selectedStatus,
    currentPage,
    setCurrentPage,
    unassignedRequestsCount,
    inProgressRequestsCount,
    completedRequestsCount,
    toast,
    showToast,
    activeJobsCount,
    totalRequestsCount,
    pendingEmergenciesCount,
    dispatches,
    technicians,
    liveTechnicians,
    selectedTechForStatus,
    setSelectedTechForStatus,
    handleTechStatusChange,
    logs,
    setLogs,
    isNewRequestOpen,
    setIsNewRequestOpen,
    newRequestData,
    setNewRequestData,
    assigningDispatch,
    setAssigningDispatch,
    isMapExpanded,
    setIsMapExpanded,
    filteredActivities,
    filteredTechnicians,
    filteredRequests,
    totalPages,
    paginatedRequests,
    handleServiceTypeChange,
    handleStatusChange,
    handleOpenAssignFromTable,
    handleStartJob,
    handleCompleteJob,
    handleExportCSV,
    handleOpenAssign,
    handleConfirmAssignment,
    handleCreateRequest,
    staggeredMenuItems,
    socialItems,
    notifications,
    emergencyRequests
  };
}
