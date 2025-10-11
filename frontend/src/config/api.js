// Configuration API pour le frontend Rubik's Cube
const API_BASE_URL = '/api';

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

// Fonctions spécifiques pour l'application
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

  const result = await apiCall(url);

  // Adapter les données du backend au format du frontend
  const adaptedLeaderboard = result.leaderboard.map((entry, index) => ({
    id: entry.participantId,
    name: entry.participantName,
    time: Math.round(entry.timeInSeconds * 1000), // Convertir en millisecondes
    cubeType: '3x3', // Par défaut, à adapter selon vos besoins
    timestamp: new Date(entry.validatedAt).getTime(),
    isValidated: true,
    validatedBy: entry.adminEmail,
    scramble: entry.scramble,
    position: entry.position
  }));

  return {
    ...result,
    leaderboard: adaptedLeaderboard
  };
};

export const clearAllRecords = async (adminEmail) => {
  return await apiCall(API_CONFIG.ENDPOINTS.CLEAR_RECORDS, {
    method: 'POST',
    body: JSON.stringify({ adminEmail })
  });
};

export default API_CONFIG;