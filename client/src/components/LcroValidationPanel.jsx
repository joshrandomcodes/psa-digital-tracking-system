import React from 'react';
import { validateLcroRecord } from '../services/api';

export default function LcroValidationPanel({ data, onQueueUpdate }) {
  const queueData = data && data.length > 0 ? data : [];

  const handleValidation = async (requestId, isValidated) => {
    try {
      await validateLcroRecord(requestId, isValidated);
      if (onQueueUpdate) onQueueUpdate();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-5 transition-colors duration-200">
        <h2 className="text-xl font-bold text-psa-blue dark:text-blue-300">LCRO Registry Validation Queue</h2>
      </div>
      
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {queueData.length === 0 ? (
          <li className="p-5 text-slate-500 dark:text-slate-400 font-medium">No pending validation requests.</li>
        ) : (
          queueData.map((record) => (
            <li key={record.RequestID} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="font-mono text-lg font-bold text-slate-400 dark:text-slate-500">#{record.RequestID}</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{record.FirstName} {record.LastName}</p>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-0.5">{record.PhilSysID}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleValidation(record.RequestID, false)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-psa-blue dark:focus:ring-offset-slate-800 transition-colors duration-200"
                >
                  Flag Missing
                </button>
                <button 
                  onClick={() => handleValidation(record.RequestID, true)}
                  className="px-4 py-2 bg-psa-blue dark:bg-blue-600 text-white font-bold text-sm hover:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-psa-blue focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors duration-200"
                >
                  Confirm Record (PhilCRIS)
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}