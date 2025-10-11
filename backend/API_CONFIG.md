# Configuration API Frontend

## Problème résolu

Votre backend est maintenant configuré avec CORS pour accepter les requêtes de votre frontend.

## Configuration Frontend

### 1. Configuration de base (recommandée)

Créez un fichier `src/config/api.js` dans votre frontend :

```javascript
// Configuration API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    GENERATE_QR: '/admin/generate-qr',
    VALIDATE_QR: '/admin/validate-qr',
    LEADERBOARD: '/admin/leaderboard',
    CLEAR_RECORDS: '/admin/clear-records',
    TEST: '/test'
  }
};

// Exemple d'utilisation avec fetch
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};
```

### 2. Utilisation dans vos composants

```javascript
import { apiCall, API_CONFIG } from '../config/api.js';

// Générer un QR code
const generateQR = async (email, qrData) => {
  return await apiCall(API_CONFIG.ENDPOINTS.GENERATE_QR, {
    method: 'POST',
    body: JSON.stringify({ email, qrData })
  });
};

// Récupérer le leaderboard
const getLeaderboard = async () => {
  return await apiCall(API_CONFIG.ENDPOINTS.LEADERBOARD);
};
```

### 3. Configuration Axios (alternative)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

## Test rapide

Testez votre configuration :

```bash
# Test de l'API
curl http://localhost:5000/api/test
```

Devrait retourner :
```json
{
  "success": true,
  "message": "Backend API is working!",
  "timestamp": "2025-09-27T16:04:06.120Z",
  "endpoints": {
    "generateQR": "POST /api/admin/generate-qr",
    "validateQR": "POST /api/admin/validate-qr",
    "leaderboard": "GET /api/admin/leaderboard",
    "clearRecords": "POST /api/admin/clear-records"
  }
}
```

## Résolution du problème

1. ✅ CORS configuré pour accepter votre frontend
2. ✅ Routes de test ajoutées
3. ✅ Gestion d'erreurs améliorée
4. ✅ Configuration frontend documentée

Votre API est maintenant accessible depuis `http://localhost:5000/api` ! 🎯