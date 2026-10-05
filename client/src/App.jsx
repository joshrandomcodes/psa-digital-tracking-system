import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthGateway from './components/AuthGateway';
import CitizenRequestForm from './components/CitizenRequestForm';
import LiveTracker from './components/LiveTracker';
import LcroValidationPanel from './components/LcroValidationPanel';
import StaffReviewBoard from './components/StaffReviewBoard';
import { getLcroQueue, fetchAllRequests, getCitizenActiveRequest } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  const [lcroQueue, setLcroQueue] = useState([]);
  const [adminQueue, setAdminQueue] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);

const loadData = async () => {
    if (!user) return;
    try {
      if (user.role === 'citizen') {
        // Automatically load the tracker on login
        const data = await getCitizenActiveRequest(user.id);
        setActiveRequest(data);
      } else if (user.role === 'lcro') {
        const data = await getLcroQueue();
        setLcroQueue(data);
      } else if (user.role === 'admin') {
        const data = await fetchAllRequests();
        setAdminQueue(data);
      }
    } catch (error) {
      console.error("Failed to load queue data:", error);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleLogout = () => {
    setUser(null);
    setLcroQueue([]);
    setAdminQueue([]);
    setActiveRequest(null);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} w-full min-h-screen`}>
      {/* Root Background - Transition to Slate 900 in dark mode for soft contrast */}
      <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        
        <Navbar user={user} onLogout={handleLogout} />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {!user ? (
            <AuthGateway onLogin={(userData) => setUser(userData)} />
          ) : (
            <>
              {user.role === 'citizen' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <CitizenRequestForm 
                    onRequestSubmitted={(responseData) => {
                      setActiveRequest(responseData);
                      loadData();
                    }} 
                  />
                  <LiveTracker requestData={activeRequest} />
                </div>
              )}

              {user.role === 'lcro' && (
                <LcroValidationPanel data={lcroQueue} onQueueUpdate={loadData} />
              )}

              {user.role === 'admin' && (
                <StaffReviewBoard data={adminQueue} onQueueUpdate={loadData} />
              )}
            </>
          )}
        </main>

        {/* Floating Dark Mode Toggle */}
        <div className="fixed bottom-6 left-6 z-50">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="bg-psa-blue dark:bg-slate-800 text-white p-3 shadow-lg border border-transparent dark:border-slate-600 hover:bg-blue-800 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-psa-blue dark:focus:ring-offset-slate-900 transition-colors duration-300 rounded-full"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}