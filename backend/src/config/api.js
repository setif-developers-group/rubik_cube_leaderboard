// Configuration API Frontend avec Proxy
const API_BASE_URL = '/api'; // Le proxy redirige vers http://localhost:5000/api

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    GENERATE_QR: '/admin/generate-qr',
    VALIDATE_QR: '/admin/validate-qr',
    LEADERBOARD: '/admin/leaderboard',
    CLEAR_RECORDS: '/admin/clear-records',
    TEST: '/test'
  }
};

// Fonction utilitaire pour les appels API
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call failed:', error);
    throw error;
  }
};

// Exemples d'utilisation
export const generateQRCode = async (email, qrData) => {
  return await apiCall(API_CONFIG.ENDPOINTS.GENERATE_QR, {
    method: 'POST',
    body: JSON.stringify({ email, qrData })
  });
};

export const validateParticipantTime = async (qrData, participantId, time, participantName, scramble) => {
  return await apiCall(API_CONFIG.ENDPOINTS.VALIDATE_QR, {
    method: 'POST',
    body: JSON.stringify({
      qrData,
      participantId,
      time,
      participantName,
      scramble
    })
  });
};

export const getLeaderboard = async (sessionId = null) => {
  const url = sessionId
    ? `${API_CONFIG.ENDPOINTS.LEADERBOARD}?sessionId=${sessionId}`
    : API_CONFIG.ENDPOINTS.LEADERBOARD;

  return await apiCall(url);
};

export const clearAllRecords = async (adminEmail) => {
  return await apiCall(API_CONFIG.ENDPOINTS.CLEAR_RECORDS, {
    method: 'POST',
    body: JSON.stringify({ adminEmail })
  });
};

export default API_CONFIG;