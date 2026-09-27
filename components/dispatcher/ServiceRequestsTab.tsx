'use client';

import React from 'react';
import type { ServiceRequest } from './useDispatcherState';

interface ServiceRequestsTabProps {
  unassignedRequestsCount: number;
  inProgressRequestsCount: number;
  completedRequestsCount: number;
  selectedServiceType: string;
  handleServiceTypeChange: (val: string) => void;
  selectedStatus: string;
  handleStatusChange: (val: string) => void;
  filteredRequests: ServiceRequest[];
  paginatedRequests: ServiceRequest[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  handleExportCSV?: () => void;
  handleOpenAssignFromTable: (req: ServiceRequest) => void;
  handleStartJob?: (id: string) => void;
  handleCompleteJob?: (id: string) => void;
  showToast?: (msg: string) => void;
}

export default function ServiceRequestsTab({
  unassignedRequestsCount,
  inProgressRequestsCount,
  completedRequestsCount,
  selectedServiceType,
  handleServiceTypeChange,
  selectedStatus,
  handleStatusChange,
  filteredRequests,
  paginatedRequests,
  currentPage,
  setCurrentPage,
  totalPages,
  handleExportCSV,
  handleOpenAssignFromTable,
  handleStartJob,
  handleCompleteJob,
  showToast
}: ServiceRequestsTabProps) {
  return (
    <div className="space-y-6 bg-slate-50 animate-in fade-in duration-300">
      
      {/* Header with Filters & Export */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-[#0A2540] tracking-tight">Service Requests</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Monitor and dispatch incoming service calls across the region.</p>
        </div>
      </div>

      {/* Metrics cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unassigned</span>
            <span className="text-3xl font-extrabold text-[#0A2540] mt-1 block">
              {unassignedRequestsCount}
            </span>
          </div>
        </div>
        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
            <span className="text-3xl font-extrabold text-[#0A2540] mt-1">{inProgressRequestsCount}</span>
          </div>
        </div>
        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed (24h)</span>
            <span className="text-3xl font-extrabold text-[#0A2540] mt-1">{completedRequestsCount}</span>
          </div>
        </div>
      </div>

      {/* Filtering bar and count */}
      <div className="bg-white border border-slate-200/80 rounded-t-2xl p-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex gap-4">
          {/* Service Type Dropdown */}
          <div className="relative">
            <select
              value={selectedServiceType}
              onChange={(e) => handleServiceTypeChange(e.target.value)}
              className="border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Service Types</option>
              <option value="Plumbing">Plumbing</option>
              <option value="AC Maintenance">AC Maintenance</option>
              <option value="Electrical">Electrical</option>
              <option value="Painting">Painting</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN-PROGRESS">In-Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredRequests.length} results
        </span>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200/80 border-t-0 rounded-b-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-semibold text-slate-600">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-6">Request ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Service Type</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                {/* REQUEST ID */}
                <td className="py-4 px-6 font-extrabold text-[#0A2540]">{req.id}</td>
                {/* CUSTOMER */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${req.color}`}>
                      {req.initials}
                    </div>
                    <span className="font-extrabold text-slate-800">{req.customer}</span>
                  </div>
                </td>
                {/* SERVICE TYPE */}
                <td className="py-4 px-6 text-slate-700">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span>{req.icon}</span>
                    <span>{req.service}</span>
                  </span>
                </td>
                {/* STATUS */}
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wider ${
                    req.status === 'UNASSIGNED' 
                      ? 'bg-rose-100 text-rose-800' 
                      : req.status === 'ASSIGNED' 
                        ? 'bg-blue-100 text-blue-800' 
                        : req.status === 'IN-PROGRESS' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                  }`}>
                    {req.status}{req.assignedTech ? ` • ${req.assignedTech}` : ''}
                  </span>
                </td>
                {/* LOCATION */}
                <td className="py-4 px-6 text-slate-500 font-semibold">{req.location}</td>
                {/* ACTIONS */}
                <td className="py-4 px-6 flex items-center gap-2">
                  {req.status === 'UNASSIGNED' && (
                    <button
                      onClick={() => handleOpenAssignFromTable(req)}
                      className="bg-[#0A2540] hover:bg-[#13395F] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      Assign Tech
                    </button>
                  )}

                  {req.status === 'COMPLETED' && (
                    <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                      ✓ Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                  No service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50 flex items-center gap-1"
          >
            &lt; Previous
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                  currentPage === idx + 1 
                    ? 'bg-[#0A2540] text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50 flex items-center gap-1"
          >
            Next &gt;
          </button>
        </div>
      )}

    </div>
  );
}
