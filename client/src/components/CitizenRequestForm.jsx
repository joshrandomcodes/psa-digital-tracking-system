import React, { useState } from 'react';
import PhilsysInput from './PhilsysInput';
import { submitDocumentRequest } from '../services/api';

export default function CitizenRequestForm({ onRequestSubmitted }) {
  const [philsys, setPhilsys] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Strip anything that is not a letter, space, or dash
  const handleNameChange = (setter) => (e) => {
    setter(e.target.value.replace(/[^a-zA-Z\s-]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitDocumentRequest({ 
        philSysId: philsys, 
        firstName, 
        lastName, 
        officeCode: 1 
      });
      
      setPhilsys('');
      setFirstName('');
      setLastName('');
      if (onRequestSubmitted) onRequestSubmitted(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-psa-blue dark:text-blue-300 border-b-2 border-psa-gold pb-2">Request Birth Certificate</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-bold rounded">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <PhilsysInput value={philsys} onChange={setPhilsys} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor="fname">First Name</label>
            <input 
              id="fname" 
              type="text" 
              value={firstName}
              onChange={handleNameChange(setFirstName)}
              pattern="[A-Za-z\s\-]+"
              title="Only letters, spaces, and hyphens are allowed"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue dark:focus:border-blue-400 focus:ring-1 focus:ring-psa-blue transition-colors duration-300" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor="lname">Last Name</label>
            <input 
              id="lname" 
              type="text" 
              value={lastName}
              onChange={handleNameChange(setLastName)}
              pattern="[A-Za-z\s\-]+"
              title="Only letters, spaces, and hyphens are allowed"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue dark:focus:border-blue-400 focus:ring-1 focus:ring-psa-blue transition-colors duration-300" 
              required
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-psa-blue dark:bg-blue-600 text-white font-bold py-3.5 mt-2 hover:bg-blue-800 dark:hover:bg-blue-500 disabled:opacity-50 active:scale-[0.99] transition-transform focus:outline-none focus:ring-2 focus:ring-psa-blue focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          {isSubmitting ? 'Processing...' : 'Submit Request'}
        </button>
      </form>
    </section>
  );
}