import React, { useState, useEffect } from 'react';

export default function Navbar({ user, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-psa-blue to-blue-800 dark:from-slate-800 dark:to-slate-950 text-white py-6 border-b-4 border-psa-gold transition-colors duration-300 shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase opacity-90 text-blue-100 dark:text-slate-400">Republic of the Philippines</p>
          <h1 className="text-3xl font-bold mt-1 tracking-tight">Philippine Statistics Authority</h1>
        </div>
        
        <div className="flex items-center gap-8 text-right">
          <div className="hidden md:block">
            <p className="text-sm font-bold opacity-90 text-blue-100 dark:text-slate-400">Philippine Standard Time:</p>
            <p className="font-mono mt-1 font-medium">
              {time.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <br />
              {time.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          {user && (
            <div className="border-l border-white/20 pl-8 flex flex-col items-end">
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-sm text-psa-gold dark:text-yellow-500 font-bold uppercase tracking-wider mb-2">
                {user.role === 'citizen' ? 'Citizen Account' : user.role === 'lcro' ? 'LCRO Officer' : 'PSA Admin'}
              </p>
              <button 
                onClick={onLogout}
                className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}