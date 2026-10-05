import React from 'react';
import { makeStaffDecision } from '../services/api';

export default function StaffReviewBoard({ data, onQueueUpdate }) {
  // Only display records that have passed LCRO validation
  const queueData = data && data.length > 0 
    ? data.filter(r => r.RequestStatus === 'Under Review') 
    : [];

  const handleDecision = async (requestId, decision) => {
    try {
      await makeStaffDecision(requestId, decision);
      if (onQueueUpdate) onQueueUpdate();
    } catch (error) {
      console.error("Decision failed:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-5 transition-colors duration-200">
        <h2 className="text-xl font-bold text-psa-blue dark:text-blue-300">PSA Final Approval Queue</h2>
      </div>
      
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {queueData.length === 0 ? (
           <li className="p-5 text-slate-500 dark:text-slate-400 font-medium">No pending approval requests.</li>
        ) : (
          queueData.map((record) => (
            <li key={record.RequestID} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="font-mono text-lg font-bold text-slate-400 dark:text-slate-500">#{record.RequestID}</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{record.FirstName} {record.LastName}</p>
                  <p className="text-sm font-bold text-psa-gold dark:text-yellow-500 mt-0.5">Status: {record.RequestStatus}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDecision(record.RequestID, 'REJECT')}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-800/60 text-red-700 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-offset-slate-800 transition-colors duration-200"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleDecision(record.RequestID, 'APPROVE')}
                  className="px-4 py-2 bg-emerald-700 dark:bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-800 dark:hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors duration-200"
                >
                  Approve & Generate
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}