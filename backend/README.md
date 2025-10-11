# 🚀 Système de Compétition Rubik's Cube

## Backend API + Frontend avec Proxy

### ✅ Configuration Terminée

Votre backend est **100% fonctionnel** avec PostgreSQL et votre frontend peut maintenant communiquer via un proxy.

---

## 🎯 **Configuration du Proxy**

### **1. Proxy Vite configuré**
- ✅ `vite.config.js` créé avec proxy automatique
- ✅ Redirige `/api/*` vers `http://localhost:5000/api/*`
- ✅ CORS configuré pour accepter votre frontend

### **2. Configuration API Frontend**
- ✅ `src/config/api.js` - Configuration centralisée
- ✅ `src/components/ApiExample.jsx` - Exemple d'utilisation

---

## 🚀 **Démarrage**

### **1. Backend (Terminal 1)**
```bash
cd backend
npm run dev
```
✅ Tourne sur `http://localhost:5000`

### **2. Frontend (Terminal 2)**
```bash
cd frontend  # (votre projet frontend)
npm run dev
```
✅ Tourne sur `http://localhost:5173`
✅ Proxy actif vers le backend

---

## 🔗 **URLs de l'API**

| Action | URL Frontend | URL Backend |
|--------|--------------|-------------|
| **Générer QR** | `POST /api/admin/generate-qr` | `POST http://localhost:5000/api/admin/generate-qr` |
| **Valider temps** | `POST /api/admin/validate-qr` | `POST http://localhost:5000/api/admin/validate-qr` |
| **Leaderboard** | `GET /api/admin/leaderboard` | `GET http://localhost:5000/api/admin/leaderboard` |
| **Vider données** | `POST /api/admin/clear-records` | `POST http://localhost:5000/api/admin/clear-records` |

---

## 🧪 **Tests**

### **Test 1: Vérifier la connexion**
```bash
# Dans le terminal backend
curl http://localhost:5000/api/test
```

### **Test 2: Générer un QR code**
```bash
curl -X POST http://localhost:5000/api/admin/generate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "qrData": {
      "type": "admin_session",
      "timestamp": 1695825600000
    }
  }'
```

### **Test 3: Valider un temps**
```bash
curl -X POST http://localhost:5000/api/admin/validate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": {
      "sessionId": "session_xxx",
      "type": "admin_session",
      "email": "admin@test.com"
    },
    "participantId": "player001",
    "participantName": "Alice",
    "time": "45.67"
  }'
```

### **Test 4: Voir le leaderboard**
```bash
curl http://localhost:5000/api/admin/leaderboard
```

---

## 💡 **Utilisation dans le Frontend**

### **Exemple simple :**
```javascript
import { generateQRCode, getLeaderboard } from './config/api.js';

// Générer QR code
const qrResult = await generateQRCode('admin@test.com', {
  type: 'admin_session'
});

// Récupérer leaderboard
const leaderboard = await getLeaderboard();
```

### **Exemple avec gestion d'erreurs :**
```javascript
try {
  const result = await generateQRCode(email, qrData);
  console.log('Session ID:', result.sessionId);
} catch (error) {
  console.error('Erreur API:', error.message);
}
```

---

## 🔧 **Configuration**

### **Backend (.env)**
```env
# Email
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rubiks_cube
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe-postgresql

# Server
PORT=5000
```

### **Frontend (vite.config.js)**
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🎉 **Fonctionnalités**

- ✅ **Génération automatique** de QR codes admin
- ✅ **Validation des temps** avec sauvegarde automatique
- ✅ **Leaderboard** avec classement par temps
- ✅ **Base de données** PostgreSQL
- ✅ **Proxy configuré** pour le frontend
- ✅ **CORS activé** pour éviter les erreurs
- ✅ **Gestion d'erreurs** complète

---

## 🚨 **Résolution des problèmes**

### **Problème: 404 Not Found**
- ✅ **Solution**: Le proxy est configuré - vérifiez que votre serveur backend tourne

### **Problème: CORS Error**
- ✅ **Solution**: CORS configuré - vérifiez les origins autorisées

### **Problème: Base de données**
- ✅ **Solution**: PostgreSQL configuré avec votre mot de passe

---

## 🎯 **Prochaines étapes**

1. **Testez l'API** avec les commandes curl ci-dessus
2. **Utilisez les exemples** dans `src/components/ApiExample.jsx`
3. **Intégrez l'API** dans vos composants frontend
4. **Personnalisez** la configuration selon vos besoins

**Votre système est maintenant prêt pour l'intégration frontend !** 🚀