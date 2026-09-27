'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { DispatchItem, TechnicianItem, RequestItem } from './useDispatcherState';

interface AssignTechnicianModalProps {
  assigningDispatch: DispatchItem | null;
  setAssigningDispatch: (dispatch: DispatchItem | null) => void;
  technicians?: TechnicianItem[];
  handleConfirmAssignment: (techName: string) => void;
  requests?: RequestItem[];
}

export default function AssignTechnicianModal({
  assigningDispatch,
  setAssigningDispatch,
  technicians = [],
  handleConfirmAssignment,
  requests = []
}: AssignTechnicianModalProps) {
  const [dbBooking, setDbBooking] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!assigningDispatch) {
      setDbBooking(null);
      return;
    }

    const fetchBooking = async () => {
      const targetId = (assigningDispatch.id || assigningDispatch.reqId || assigningDispatch.jobId) as string;
      if (!targetId) return;

      const foundInRequests = (requests || []).find(r => 
        (r.id && r.id === targetId) || 
        (r.id && r.id === assigningDispatch.reqId) || 
        (r.id && r.id === assigningDispatch.jobId)
      );
      if (foundInRequests) {
        setDbBooking(foundInRequests);
        return;
      }

      try {
        let docRef = doc(db, 'bookings', targetId);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          docRef = doc(db, 'emergencyBookings', targetId);
          docSnap = await getDoc(docRef);
        }

        if (!docSnap.exists() && assigningDispatch.jobId) {
          docRef = doc(db, 'bookings', assigningDispatch.jobId);
          docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            docRef = doc(db, 'emergencyBookings', assigningDispatch.jobId);
            docSnap = await getDoc(docRef);
          }
        }

        if (docSnap.exists()) {
          setDbBooking({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching booking from DB:", err);
      }
    };

    fetchBooking();
  }, [assigningDispatch?.id, assigningDispatch?.reqId, assigningDispatch?.jobId, requests]);

  const resolvedService = useMemo(() => {
    if (!assigningDispatch) return 'Service';
    const sourceObj = (dbBooking || assigningDispatch) as Record<string, unknown>;
    if (!sourceObj) return 'Service';

    const category = (sourceObj.category || sourceObj.techSpecialty || '') as string;
    const service = (sourceObj.service || sourceObj.title || sourceObj.description || '') as string;

    const combined = `${category} ${service}`.toLowerCase();
    if (combined.includes('plumb')) return 'Plumbing';
    if (combined.includes('elect')) return 'Electrical';
    if (combined.includes('ac ') || combined.includes('ac_') || combined.includes('hvac') || combined.includes('air conditioning') || combined.includes('maintenance')) return 'AC Maintenance';
    if (combined.includes('clean')) return 'Cleaning';
    if (combined.includes('appliance') || combined.includes('microwave') || combined.includes('fridge') || combined.includes('washing')) return 'Appliance Repair';
    if (combined.includes('carpen')) return 'Carpentry';
    if (combined.includes('paint')) return 'Painting';
    if (combined.includes('pest')) return 'Pest Control';

    const raw = category || service;
    if (raw) {
      const clean = raw
        .replace(/MID-SERVICE CANCELLATION REQUEST/gi, '')
        .replace(/CANCELLATION REQUEST/gi, '')
        .replace(/EMERGENCY/gi, '')
        .replace(/URGENT/gi, '')
        .replace(/-?\s*#[A-Za-z0-9]+/g, '')
        .replace(/[-–—🚨⚡]/g, '')
        .trim();
      if (clean) {
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      }
    }
    return 'Service';
  }, [dbBooking, assigningDispatch]);

  const isTechnicianWhoCancelled = (techOrName: TechnicianItem | string) => {
    if (!assigningDispatch || !techOrName) return false;

    const techNameNorm = typeof techOrName === 'string' 
      ? techOrName.toLowerCase().trim() 
      : (techOrName.name || '').toLowerCase().trim();
    const techIdNorm = typeof techOrName === 'object' && techOrName.id 
      ? (techOrName.id || '').toLowerCase().trim() 
      : '';

    const cancelledRefs = [
      assigningDispatch.cancelledBy,
      assigningDispatch.cancelledTechName,
      assigningDispatch.cancelledByTechName,
      assigningDispatch.technicianName,
      assigningDispatch.technicianId,
      assigningDispatch.cancelledByTechId,
      assigningDispatch.assignedTech,
      assigningDispatch.assignedTechName,
      ...(Array.isArray(assigningDispatch.cancelledTechs) ? assigningDispatch.cancelledTechs : []),
      ...(Array.isArray(assigningDispatch.cancelledByList) ? (assigningDispatch.cancelledByList as string[]) : [])
    ].filter(Boolean);

    const isCancellationDispatch = 
      assigningDispatch.category === 'CANCELLATION' || 
      (typeof assigningDispatch.title === 'string' && assigningDispatch.title.toLowerCase().includes('cancel')) ||
      (typeof assigningDispatch.status === 'string' && assigningDispatch.status.toLowerCase().includes('cancel')) ||
      Boolean(assigningDispatch.cancelledBy || assigningDispatch.cancelledTechName);

    if (!isCancellationDispatch) return false;

    return cancelledRefs.some(ref => {
      const refNorm = String(ref).toLowerCase().trim();
      if (!refNorm) return false;

      if (techIdNorm && (techIdNorm === refNorm || refNorm.includes(techIdNorm))) return true;

      if (techNameNorm) {
        if (techNameNorm === refNorm) return true;
        if (techNameNorm.includes(refNorm) || refNorm.includes(techNameNorm)) return true;

        const techFirstName = techNameNorm.split(' ')[0];
        const refFirstName = refNorm.split(' ')[0];
        if (techFirstName && refFirstName && techFirstName.length >= 3 && refFirstName.length >= 3) {
          if (techFirstName === refFirstName) return true;
        }
      }
      return false;
    });
  };

  const getJobSpecialtyKey = (serviceName?: string) => {
    const s = (serviceName || '').toLowerCase();
    if (s.includes('plumb')) return 'plumb';
    if (s.includes('elect')) return 'elect';
    if (s.includes('ac ') || s.includes('ac_') || s.includes('hvac') || s.includes('air conditioning') || s.includes('maintenance')) return 'hvac';
    if (s.includes('clean')) return 'clean';
    if (s.includes('appliance') || s.includes('microwave') || s.includes('fridge') || s.includes('washing')) return 'appliance';
    if (s.includes('carpen')) return 'carpen';
    if (s.includes('paint')) return 'paint';
    if (s.includes('pest')) return 'pest';
    return s;
  };

  const isTechnicianMatch = (techSpecialty?: string, jobService?: string) => {
    if (!techSpecialty || !jobService) return false;
    const techKey = getJobSpecialtyKey(techSpecialty);
    const jobKey = getJobSpecialtyKey(jobService);
    return techKey === jobKey || techSpecialty.toLowerCase().includes(jobKey) || jobService.toLowerCase().includes(techKey);
  };

  const requestedTechObj = useMemo(() => {
    if (!assigningDispatch) return null;

    const targetCustId = String(dbBooking?.customerId || assigningDispatch.customerId || '').toLowerCase().trim();
    const targetCustEmail = String(dbBooking?.customerEmail || assigningDispatch.customerEmail || '').toLowerCase().trim();
    const targetCustName = String(dbBooking?.customerName || dbBooking?.customer || assigningDispatch.customerName || assigningDispatch.customer || '').toLowerCase().trim();
    const targetAddress = String(dbBooking?.customerAddress || dbBooking?.address || dbBooking?.location || assigningDispatch.address || assigningDispatch.location || '').toLowerCase().trim();
    const targetCategory = resolvedService ? resolvedService.toUpperCase() : '';

    const explicitCandidates = [
      dbBooking?.requestedTechName,
      dbBooking?.requestedTech,
      dbBooking?.requestedTechnician,
      dbBooking?.requestedTechnicianName,
      dbBooking?.previousTechnicianName,
      dbBooking?.previousTechnician,
      dbBooking?.previousTechName,
      dbBooking?.previousTech,
      dbBooking?.preferredTechnician,
      dbBooking?.preferredTechnicianName,
      dbBooking?.preferredTech,
      dbBooking?.preferredTechName,
      dbBooking?.recommendedTech,
      dbBooking?.recommendedTechName,
      assigningDispatch.requestedTechName,
      assigningDispatch.requestedTech,
      assigningDispatch.requestedTechnician,
      assigningDispatch.requestedTechnicianName,
      assigningDispatch.previousTechnicianName,
      assigningDispatch.previousTechnician,
      assigningDispatch.previousTechName,
      assigningDispatch.previousTech,
      assigningDispatch.preferredTechnician,
      assigningDispatch.preferredTechnicianName,
      assigningDispatch.preferredTech,
      assigningDispatch.preferredTechName,
      assigningDispatch.recommendedTech,
      assigningDispatch.recommendedTechName
    ].filter(Boolean) as string[];

    let selectedTechObj: TechnicianItem | null = null;

    for (const candName of explicitCandidates) {
      if (isTechnicianWhoCancelled(candName)) continue;
      const found = technicians.find(t => 
        !isTechnicianWhoCancelled(t) &&
        (t.name.toLowerCase().trim() === candName.toLowerCase().trim() ||
         t.name.toLowerCase().trim().includes(candName.toLowerCase().trim()) ||
         candName.toLowerCase().trim().includes(t.name.toLowerCase().trim()))
      );
      if (found) {
        selectedTechObj = found;
        break;
      }
    }

    if (!selectedTechObj) {
      const prevBooking = (requests || []).find(r => {
        if (!r || r.id === assigningDispatch.id || r.id === assigningDispatch.reqId || r.id === assigningDispatch.jobId) return false;

        const tech = (r.assignedTech || r.technicianName || r.assignedTechName) as string;
        if (!tech || isTechnicianWhoCancelled(tech)) return false;

        const rId = (r.customerId || '').toLowerCase().trim();
        const rEmail = (r.customerEmail || '').toLowerCase().trim();
        const rCust = (r.customer || r.customerName || '').toLowerCase().trim();
        const rAddr = (r.customerAddress || r.address || r.location || '').toLowerCase().trim();

        const matchesCustId = targetCustId && rId && targetCustId === rId && targetCustId !== 'walk-in-dispatcher';
        const matchesEmail = targetCustEmail && rEmail && targetCustEmail === rEmail;
        const matchesCustName = targetCustName && rCust && targetCustName !== 'customer' && targetCustName !== 'walk-in request' && (targetCustName === rCust || targetCustName.includes(rCust) || rCust.includes(targetCustName));
        const matchesAddr = targetAddress && rAddr && targetAddress.length >= 3 && targetAddress !== 'mangaluru' && targetAddress !== 'mangalore' && (targetAddress === rAddr || targetAddress.includes(rAddr) || rAddr.includes(targetAddress));

        return matchesCustId || matchesEmail || matchesCustName || matchesAddr;
      });

      if (prevBooking) {
        const pName = String(prevBooking.assignedTech || prevBooking.technicianName || prevBooking.assignedTechName);
        const found = technicians.find(t => 
          !isTechnicianWhoCancelled(t) &&
          (t.name.toLowerCase().trim() === pName.toLowerCase().trim() ||
           t.name.toLowerCase().trim().includes(pName.toLowerCase().trim()) ||
           pName.toLowerCase().trim().includes(t.name.toLowerCase().trim()))
        );
        if (found) selectedTechObj = found;
      }
    }

    if (!selectedTechObj) {
      const isRequestingFlag = Boolean(
        assigningDispatch?.requestPreviousTechnician || 
        assigningDispatch?.requestPreviousTech ||
        dbBooking?.requestPreviousTechnician ||
        dbBooking?.requestPreviousTech
      );

      if (isRequestingFlag) {
        const tradeAndZoneMatch = technicians.find(t => 
          !isTechnicianWhoCancelled(t) &&
          isTechnicianMatch(t.specialty, targetCategory) &&
          targetAddress && (t.zone || '').toLowerCase().includes(targetAddress.toLowerCase())
        );

        if (tradeAndZoneMatch) {
          selectedTechObj = tradeAndZoneMatch;
        } else {
          const tradeMatch = technicians.find(t => 
            !isTechnicianWhoCancelled(t) &&
            isTechnicianMatch(t.specialty, targetCategory)
          );
          if (tradeMatch) selectedTechObj = tradeMatch;
        }
      }
    }

    if (selectedTechObj && isTechnicianWhoCancelled(selectedTechObj)) return null;

    return selectedTechObj;
  }, [assigningDispatch, dbBooking, requests, technicians, resolvedService]);

  if (!assigningDispatch) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Assign Emergency Call</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Ticket: {assigningDispatch.id}</p>
          </div>
          <button 
            onClick={() => setAssigningDispatch(null)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs space-y-1">
            <p className="font-extrabold text-rose-800 text-sm">
              {resolvedService ? `${resolvedService} Request` : 'Loading Service Request...'}
            </p>
            <p className="text-rose-700 font-semibold">Address: {assigningDispatch.address}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                {resolvedService ? resolvedService.toUpperCase() : 'LOADING...'}
              </span>
              {assigningDispatch.price && <span className="text-xs font-black text-emerald-600">₹{assigningDispatch.price}</span>}
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {(() => {
              const jobCategory = resolvedService ? resolvedService.toUpperCase() : '';
              
              const validRosterTechs = technicians.filter(tech => !isTechnicianWhoCancelled(tech));
              const displayTechs = validRosterTechs.filter(tech => isTechnicianMatch(tech.specialty, jobCategory));
              const isRequestedTechFeatured = Boolean(requestedTechObj);

              const otherTechs = isRequestedTechFeatured && requestedTechObj
                ? displayTechs.filter(tech => tech.name.toLowerCase().trim() !== requestedTechObj.name.toLowerCase().trim())
                : displayTechs;

              return (
                <div className="space-y-4">
                  {isRequestedTechFeatured && requestedTechObj && (
                    <div className="space-y-2 p-3 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-xs">
                      <div className="flex items-center justify-between pb-1">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                          CUSTOMER REQUESTED TECHNICIAN
                        </h4>
                      </div>
                      {(() => {
                        const rawStatus = (requestedTechObj.status || '').toLowerCase();
                        const isBusy = rawStatus.includes('busy') || rawStatus.includes('started');
                        const isOffline = rawStatus.includes('offline');
                        const totalWorkload = (requestedTechObj.assigned || 0) + (requestedTechObj.completed || 0);
                        const isOverCapacity = totalWorkload >= 6 || (requestedTechObj.assigned || 0) >= 6;
                        const isNotAssignable = isBusy || isOffline || isOverCapacity;

                        return (
                          <button
                            key={requestedTechObj.id || requestedTechObj.name}
                            disabled={isNotAssignable}
                            onClick={() => !isNotAssignable && handleConfirmAssignment(requestedTechObj.name)}
                            className={`w-full text-left p-3.5 rounded-xl border flex justify-between items-center transition-all group ${
                              isNotAssignable
                                ? 'border-slate-200 bg-slate-100/80 opacity-75 cursor-not-allowed'
                                : 'border-slate-300 bg-white hover:bg-slate-100/60 cursor-pointer shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-sm text-slate-900 group-hover:text-blue-800">{requestedTechObj.name}</h4>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                  isOffline 
                                    ? 'bg-slate-200 text-slate-700' 
                                    : isBusy 
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {requestedTechObj.status || 'Available'}
                                </span>
                                {isNotAssignable && (
                                  <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                                    Unavailable
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">
                                {requestedTechObj.specialty || 'Specialist'} • ZONE: {requestedTechObj.zone || 'MANGALURU'}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-[#0A2540] block">{requestedTechObj.assigned || 0} / 6 jobs</span>
                              <span className="text-[9px] font-bold text-slate-500 block">{requestedTechObj.travel || 0} in transit</span>
                            </div>
                          </button>
                        );
                      })()}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Available Technicians
                    </h4>
                    <div className="space-y-2">
                      {otherTechs.length === 0 ? (
                        <div className="text-center py-8 px-4 text-xs text-rose-600 font-bold border border-dashed border-rose-200 rounded-xl bg-rose-50/50">
                          No technicians available for "{jobCategory}" (all technicians for this trade have reached 6/6 jobs capacity, are offline, or previously cancelled this job).
                        </div>
                      ) : (
                        otherTechs.map((tech) => {
                          const rawStatus = (tech.status || '').toLowerCase();
                          const isBusy = rawStatus.includes('busy') || rawStatus.includes('started');
                          const isOffline = rawStatus.includes('offline');
                          const totalWorkload = (tech.assigned || 0) + (tech.completed || 0);
                          const isOverCapacity = totalWorkload >= 6 || (tech.assigned || 0) >= 6;
                          const isNotAssignable = isBusy || isOffline || isOverCapacity;
                          
                          const isMatch = isTechnicianMatch(tech.specialty, jobCategory);

                          return (
                            <button
                              key={tech.id || tech.name}
                              disabled={isNotAssignable}
                              onClick={() => !isNotAssignable && handleConfirmAssignment(tech.name)}
                              className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all group ${
                                isNotAssignable 
                                  ? 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                                  : isMatch 
                                    ? 'border-blue-500 bg-blue-50/40 hover:bg-blue-50 cursor-pointer shadow-xs' 
                                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-700">{tech.name}</h4>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    isOffline 
                                      ? 'bg-slate-200 text-slate-600'
                                      : isBusy 
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  }`}>
                                    {tech.status}
                                  </span>
                                  {isNotAssignable && (
                                    <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                  {tech.specialty} • Zone: {tech.zone || 'Mangaluru'}
                                  {isOffline && ' • (Offline)'}
                                  {isBusy && ' • (Busy)'}
                                  {isOverCapacity && !isBusy && !isOffline && ' • (Max Capacity 6/6)'}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-extrabold text-[#0A2540] block">{tech.assigned || 0} / 6 jobs</span>
                                <span className="text-[9px] font-bold text-slate-400 block">{tech.travel || 0} in transit</span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={() => setAssigningDispatch(null)} 
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
