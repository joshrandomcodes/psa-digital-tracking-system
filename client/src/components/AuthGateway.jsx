import React, { useState } from 'react';
import PhilsysInput from './PhilsysInput';
import { loginUser, registerCitizen } from '../services/api';

export default function AuthGateway({ onLogin }) {
  const [view, setView] = useState('login-citizen'); // 'login-citizen', 'login-staff', 'register'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [philsys, setPhilsys] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleNameChange = (setter) => (e) => {
    setter(e.target.value.replace(/[^a-zA-Z\s-]/g, ''));
  };

  const handleTabSwitch = (newView) => {
    setView(newView);
    setError('');
    setPassword(''); // Clears the password field on tab switch
    setShowPassword(false); // Resets the visibility toggle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;
      if (view === 'login-citizen') {
        response = await loginUser({ email, password }, false);
      } else if (view === 'login-staff') {
        response = await loginUser({ employeeId, password }, true);
      } else if (view === 'register') {
        response = await registerCitizen({ philSysId: philsys, firstName, lastName, email, password });
      }
      
      if (response?.user) {
        onLogin(response.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      
      {/* Auth Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <button 
          type="button"
          onClick={() => handleTabSwitch('login-citizen')}
          className={`flex-1 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-psa-blue ${view === 'login-citizen' ? 'border-b-2 border-psa-blue text-psa-blue dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Citizen
        </button>
        <button 
          type="button"
          onClick={() => handleTabSwitch('login-staff')}
          className={`flex-1 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-psa-blue ${view === 'login-staff' ? 'border-b-2 border-psa-blue text-psa-blue dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          PSA Staff
        </button>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          {view === 'register' ? 'Create Citizen Account' : 'Sign In'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {view === 'login-staff' ? (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Employee ID</label>
              <input 
                type="text" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="PSA-YYYY-XXXX"
                className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-psa-blue focus:ring-1 focus:ring-psa-blue transition-colors duration-200" 
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue focus:ring-1 focus:ring-psa-blue transition-colors duration-200" 
                required
              />
            </div>
          )}

          {view === 'register' && (
            <>
              <PhilsysInput value={philsys} onChange={setPhilsys} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input type="text" value={firstName} onChange={handleNameChange(setFirstName)} className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue focus:ring-1 focus:ring-psa-blue transition-colors duration-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input type="text" value={lastName} onChange={handleNameChange(setLastName)} className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue focus:ring-1 focus:ring-psa-blue transition-colors duration-200" required />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:border-psa-blue focus:ring-1 focus:ring-psa-blue transition-colors duration-200" 
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-psa-blue text-white font-bold py-3.5 mt-4 hover:bg-blue-800 disabled:opacity-50 active:scale-[0.99] transition-transform focus:outline-none focus:ring-2 focus:ring-psa-blue focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            {isLoading ? 'Authenticating...' : view === 'register' ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {view !== 'login-staff' && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <button 
              type="button"
              onClick={() => handleTabSwitch(view === 'login-citizen' ? 'register' : 'login-citizen')}
              className="text-sm font-bold text-psa-blue dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-psa-blue"
            >
              {view === 'login-citizen' ? 'Need an account? Register here.' : 'Already have an account? Sign in.'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}