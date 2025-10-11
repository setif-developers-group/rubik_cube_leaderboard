import express from 'express';
import { generateQR, clearRecords, validateQR, getLeaderboard, getActiveSessions, deactivateSession, getAdminEmails } from '../controllers/adminController.js';

const router = express.Router();

// Generate QR code and send via email
router.post('/generate-qr', generateQR);

// Clear all records
router.post('/clear-records', clearRecords);

// Validate QR code for timer validation
router.post('/validate-qr', validateQR);

// Get leaderboard (all or filtered by session/admin)
router.get('/leaderboard', getLeaderboard);

// Get active QR sessions for an admin
router.get('/sessions/:adminEmail', getActiveSessions);

// Deactivate a specific QR session
router.put('/sessions/:sessionId/deactivate', deactivateSession);

// Get list of authorized admin emails
router.get('/admin-emails', getAdminEmails);

export default router;