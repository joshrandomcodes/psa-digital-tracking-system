import React from 'react';

export default function LiveTracker({ requestData }) {
  if (!requestData) {
    return (
      <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-psa-blue dark:text-blue-300 border-b-2 border-psa-gold pb-2">Live Tracker</h2>
        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
          Submit a request via the portal to track its live system status.
        </div>
      </section>
    );
  }

  // Format the ID into a professional government tracking code (e.g., PSA-2026-0002)
  const formattedReqId = `PSA-${new Date(requestData.DateFiled || Date.now()).getFullYear()}-${String(requestData.RequestID).padStart(4, '0')}`;

  // Define the workflow stages
  const status = requestData.RequestStatus;
  
  const steps = [
    { title: 'Request Submitted', desc: 'Verified via PhilSys Identity Gateway' },
    { title: 'LCRO Validation', desc: 'Local Civil Registry Office Review' },
    { title: 'PSA Final Review', desc: 'Central Processing & Authentication' },
    { title: 'Document Ready', desc: 'SECPA Generation & Dispatch' }
  ];

  // Determine current active step index based on database status
  let activeStepIndex = 0;
  if (status === 'Pending LCRO Validation' || status === 'Pending') {
    activeStepIndex = 1;
  } else if (status === 'Under Review' || status === 'Pending PSA Final Approval') {
    activeStepIndex = 2;
  } else if (status === 'Approved' || status === 'Completed') {
    activeStepIndex = 3;
  }

  return (
    <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 border-b-2 border-psa-gold pb-2">
        <h2 className="text-2xl font-bold text-psa-blue dark:text-blue-300">Live Tracker</h2>
        <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-900 px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          {formattedReqId}
        </span>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 flex justify-between items-center text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Document Type</p>
          <p className="font-bold text-slate-900 dark:text-white">{requestData.DocumentType || 'Birth Certificate (SECPA)'}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Current Status</p>
          <p className="font-bold text-psa-blue dark:text-blue-400">{status}</p>
        </div>
      </div>

      {/* Progress Steps List */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {steps.map((step, index) => {
          const isComplete = index < activeStepIndex;
          const isCurrent = index === activeStepIndex;

          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Dot Indicator */}
              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                isComplete 
                  ? 'bg-psa-blue border-psa-blue dark:bg-blue-600 dark:border-blue-600' 
                  : isCurrent 
                  ? 'bg-psa-gold border-psa-gold animate-pulse' 
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
              }`}>
                {isComplete && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div>
                <p className={`font-bold text-sm ${isCurrent ? 'text-psa-blue dark:text-blue-400 font-extrabold' : isComplete ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}