const API_BASE = 'http://localhost:5000/api';

export const submitDocumentRequest = async (payload) => {
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  
  // Explicitly catch backend logic errors (like the 409 Duplicate Request)
  if (!response.ok || data.status === 'Error') {
    throw new Error(data.message || data.error || 'Submission failed.');
  }
  return data;
};

export const fetchAllRequests = async () => {
  const response = await fetch(`${API_BASE}/requests`);
  return response.json();
};

export const getCitizenActiveRequest = async (citizenId) => {
  const response = await fetch(`${API_BASE}/requests/citizen/${citizenId}`);
  if (!response.ok) return null;
  return response.json();
};

export const getLcroQueue = async () => {
  const response = await fetch(`${API_BASE}/lcro/queue`);
  return response.json();
};

export const validateLcroRecord = async (requestId, isValidated, officeCode = 1) => {
  const response = await fetch(`${API_BASE}/lcro/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, isValidated, officeCode }),
  });
  return response.json();
};

export const makeStaffDecision = async (requestId, decision, staffId = 1) => {
  const response = await fetch(`${API_BASE}/staff/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, decision, staffId }),
  });
  return response.json();
};

// AUTHENTICATION
export const loginUser = async (credentials, isStaff) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...credentials, isStaff }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed. Please check your credentials.');
  }
  
  return data;
};

export const registerCitizen = async (citizenData) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citizenData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed.');
  }
  
  return data;
};