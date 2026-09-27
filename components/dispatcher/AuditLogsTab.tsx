'use client';

import React from 'react';
import type { LogItem } from './useDispatcherState';

interface AuditLogsTabProps {
  logs: LogItem[];
  setLogs: React.Dispatch<React.SetStateAction<LogItem[]>>;
  showToast: (msg: string) => void;
}

export default function AuditLogsTab({
  logs,
  setLogs,
  showToast
}: AuditLogsTabProps) {
  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#0A2540]">Dispatch & Event Audit Logs</h3>
          <p className="text-xs text-slate-400 font-semibold">Comprehensive historic timeline of system events and operator overrides</p>
        </div>
        <button
          onClick={() => {
            setLogs(prev => [
              { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: 'Manual log reload requested', user: 'Alex Dispatch' },
              ...prev
            ]);
            showToast('Logs refreshed.');
          }}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
        >
          Reload Logs
        </button>
      </div>

      {/* Logs chronological stream */}
      <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 whitespace-nowrap">
              🕒 {log.timestamp}
            </span>
            <span className="flex-1 font-bold text-slate-700">{log.event}</span>
            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
              User: {log.user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
