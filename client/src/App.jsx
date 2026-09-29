import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); 
  const [requests, setRequests] = useState([
    {
      requestId: 10421,
      citizenName: 'Juan Dela Cruz',
      philSysId: 'PH-9021-3948-2910',
      status: 'Pending LCRO Validation',
      dateFiled: '2026-09-29',
      logs: [
        { status: 'Request Submitted', time: '09:00 AM' },
        { status: 'PhilSys Identity Verified', time: '09:01 AM' }
      ]
    }
  ]);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', philSysId: '' });

  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    const newId = Math.floor(10000 + Math.random() * 90000);
    const newReq = {
      requestId: newId,
      citizenName: `${formData.firstName} ${formData.lastName}`,
      philSysId: formData.philSysId,
      status: 'Pending LCRO Validation',
      dateFiled: new Date().toISOString().split('T')[0],
      logs: [
        { status: 'Request Submitted', time: 'Just now' },
        { status: 'PhilSys Verified', time: 'Just now' }
      ]
    };
    setRequests([newReq, ...requests]);
    setFormData({ firstName: '', lastName: '', philSysId: '' });
    alert(`Request #${newId} filed and identity verified via PhilSys.`);
  };

  const handleLcroAction = (id, isValidated) => {
    setRequests(requests.map(req => {
      if (req.requestId === id) {
        const nextStatus = isValidated ? 'LCRO Validated' : 'Flagged Manually';
        return { ...req, status: nextStatus, logs: [...req.logs, { status: nextStatus, time: 'Just now' }] };
      }
      return req;
    }));
  };

  const handlePsaDecision = (id, decision) => {
    setRequests(requests.map(req => {
      if (req.requestId === id) {
        const nextStatus = decision === 'APPROVE' ? 'Document Generated' : 'Rejected';
        return { ...req, status: nextStatus, logs: [...req.logs, { status: nextStatus, time: 'Just now' }] };
      }
      return req;
    }));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #a00', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#a00' }}>PSA Digital Birth Certificate Tracking System</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('citizen')} style={{ fontWeight: activeTab === 'citizen' ? 'bold' : 'normal' }}>Citizen Portal</button>
          <button onClick={() => setActiveTab('lcro')} style={{ fontWeight: activeTab === 'lcro' ? 'bold' : 'normal' }}>LCRO Officer</button>
          <button onClick={() => setActiveTab('psa_staff')} style={{ fontWeight: activeTab === 'psa_staff' ? 'bold' : 'normal' }}>PSA Staff/Admin</button>
        </div>
      </header>

      {activeTab === 'citizen' && (
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 1 }}>
            <h2>Request Birth Certificate</h2>
            <form onSubmit={handleCitizenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input required placeholder="PhilSys ID" value={formData.philSysId} onChange={e => setFormData({...formData, philSysId: e.target.value})} />
              <input required placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input required placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              <button type="submit" style={{ backgroundColor: '#a00', color: '#fff', padding: '10px' }}>Submit Request</button>
            </form>
          </div>
          <div style={{ flex: 1 }}>
            <h2>Live Tracker</h2>
            {requests.map(req => (
              <div key={req.requestId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <strong>REQ #{req.requestId}</strong> - {req.status}
                <ul style={{ fontSize: '12px', color: '#555' }}>
                  {req.logs.map((log, i) => <li key={i}>{log.status} ({log.time})</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lcro' && (
        <div>
          <h2>LCRO Registry Validation Queue</h2>
          {requests.filter(r => r.status === 'Pending LCRO Validation').map(req => (
            <div key={req.requestId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>#{req.requestId}</strong> - {req.citizenName} ({req.philSysId})</p>
              <button onClick={() => handleLcroAction(req.requestId, true)}>Confirm Record (PhilCRIS)</button>
              <button onClick={() => handleLcroAction(req.requestId, false)}>Flag Missing</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'psa_staff' && (
        <div>
          <h2>PSA Final Approval Queue</h2>
          {requests.filter(r => r.status === 'LCRO Validated' || r.status === 'Flagged Manually').map(req => (
            <div key={req.requestId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>#{req.requestId}</strong> - {req.citizenName} - Status: {req.status}</p>
              <button onClick={() => handlePsaDecision(req.requestId, 'APPROVE')}>Approve & Generate</button>
              <button onClick={() => handlePsaDecision(req.requestId, 'REJECT')}>Reject</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
