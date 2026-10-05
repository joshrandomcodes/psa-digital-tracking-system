import React from 'react';

export default function PhilsysInput({ value, onChange }) {
  const handleInput = (e) => {
    // Strip non-digits and hard-cap at exactly 12 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').substring(0, 12);
    // Format into groups of 4 (xxxx-xxxx-xxxx)
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1-');
    
    onChange(formatted);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor="philsys">PhilSys Number</label>
      <input 
        id="philsys"
        type="text" 
        value={value}
        onChange={handleInput}
        placeholder="0000-0000-0000" 
        minLength={14}
        maxLength={14}
        pattern="\d{4}-\d{4}-\d{4}"
        title="PhilSys ID must be exactly 12 digits in the format XXXX-XXXX-XXXX"
        className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-psa-blue dark:focus:border-blue-400 focus:ring-1 focus:ring-psa-blue dark:focus:ring-blue-400 transition-colors duration-300"
        required
      />
    </div>
  );
}