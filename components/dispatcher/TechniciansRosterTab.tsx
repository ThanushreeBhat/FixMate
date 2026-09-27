'use client';

import React from 'react';
import type { TechnicianRosterItem } from './useDispatcherState';

interface TechniciansRosterTabProps {
  filteredTechnicians: TechnicianRosterItem[];
  showToast?: (msg: string) => void;
}

export default function TechniciansRosterTab({
  filteredTechnicians,
  showToast
}: TechniciansRosterTabProps) {
  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-extrabold text-[#0A2540]">Technicians Roster</h3>
        <p className="text-xs text-slate-400 font-semibold">Manage, inspect workloads, and check real-time availability of operatives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => (
          <div key={tech.name} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                  {tech.name.split(' ')[0][0]}{tech.name.split(' ')[1] ? tech.name.split(' ')[1][0] : ''}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">{tech.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{tech.specialty}</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                tech.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {tech.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Assigned Tasks</span>
                <span className="font-extrabold text-[#0A2540]">{tech.assigned} Active Jobs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Tasks Completed</span>
                <span className="font-extrabold text-[#0A2540]">{tech.completed || 0} Tasks</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-[10px] text-slate-400 font-bold">📍 Grid Sector: {tech.zone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
