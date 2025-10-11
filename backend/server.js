import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';

dotenv.config();
const app = express();

// Configuration CORS améliorée
app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origin (comme les apps mobiles)
    if (!origin) return callback(null, true);

    // Liste des origins autorisées
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // React dev server
      'http://localhost:5174',  // Autre port possible
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDB();

// Route de test pour vérifier que l'API fonctionne
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      generateQR: 'POST /api/admin/generate-qr',
      validateQR: 'POST /api/admin/validate-qr',
      leaderboard: 'GET /api/admin/leaderboard',
      clearRecords: 'POST /api/admin/clear-records'
    }
  });
});

// Health check pour les services de monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: {
      test: 'GET /api/test',
      health: 'GET /health',
      admin: '/api/admin/*',
      auth: '/api/auth/*'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
});
