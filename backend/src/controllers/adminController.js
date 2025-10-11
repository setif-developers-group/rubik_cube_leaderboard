import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import QRSession from '../models/QRSession.js';
import Leaderboard from '../models/Leaderboard.js';
import { Op } from 'sequelize';

// Fonction de validation des emails admin
const validateAdminEmail = (email) => {
  const adminEmails = process.env.ADMIN_EMAILS || '';
  const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
};

// Fonction pour obtenir la liste des emails admin autorisés
export const getAdminEmails = async (req, res) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS || '';
    const allowedEmails = adminEmails.split(',').map(email => email.trim()).filter(email => email.length > 0);

    res.json({
      success: true,
      adminEmails: allowedEmails,
      count: allowedEmails.length
    });
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    res.status(500).json({ message: 'Failed to fetch admin emails' });
  }
};

// Create email transporter - Version simplifiée pour les tests
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true,
  tls: {
    rejectUnauthorized: false
  }
});

export const generateQR = async (req, res) => {
    try {
      const { email, qrData } = req.body;

      if (!email || !qrData) {
        return res.status(400).json({ message: 'Email and QR data are required' });
      }

      // Validate admin email
      if (!validateAdminEmail(email)) {
        return res.status(403).json({
          message: 'Unauthorized: Email not authorized for admin access',
          allowedEmails: process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : []
        });
      }

     // Generate unique session ID if not provided
     const sessionId = qrData.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`;

     // Update qrData with generated sessionId
     const finalQrData = {
       ...qrData,
       sessionId: sessionId,
       timestamp: qrData.timestamp || Date.now()
     };

     // Calculate expiration date (24 hours from now)
     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

     // Save QR session to database
     const qrSession = await QRSession.create({
       sessionId: sessionId,
       adminEmail: email,
       qrData: finalQrData,
       expiresAt: expiresAt
     });

     // Generate QR code as base64 image
     const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(finalQrData), {
       width: 200,
       margin: 2,
       color: {
         dark: '#000000',  // Noir pour les données
         light: '#FFFFFF'  // Blanc pour le fond
       }
     });

     console.log('Generated QR Data:', JSON.stringify(finalQrData));
     console.log('QR Code DataURL length:', qrCodeDataURL.length);

     // Email options avec image en pièce jointe ET en base64
     const mailOptions = {
       from: process.env.EMAIL_USER,
       to: email,
       subject: 'Your Admin QR Code - Rubik\'s Cube Competition',
       html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
           <h1 style="color: #00FFFF; text-align: center; font-family: 'Orbitron', monospace;">ADMIN QR CODE</h1>
           <p style="text-align: center; color: #cccccc;">Your admin validation QR code for the Rubik's Cube competition</p>

           <div style="text-align: center; margin: 30px 0;">
             <!-- Image en base64 -->
             <img src="data:image/png;base64,${qrCodeDataURL.split(',')[1]}" alt="Admin QR Code" style="width: 200px; height: 200px; background: white; padding: 10px; border-radius: 10px;" />

             <!-- Alternative: image en pièce jointe -->
             <div style="margin-top: 10px;">
               <p style="color: #cccccc; font-size: 12px;">If the QR code is not visible above, check the attachment below.</p>
             </div>
           </div>

           <div style="background-color: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
             <h3 style="color: #00FFFF; margin-top: 0;">Session Details:</h3>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Session ID:</strong> ${sessionId}</p>
             <p><strong>Generated:</strong> ${new Date(finalQrData.timestamp).toLocaleString()}</p>
             <p><strong>Expires:</strong> ${expiresAt.toLocaleString()}</p>
           </div>

           <div style="background-color: #2a2a2a; padding: 15px; border-radius: 5px; margin: 20px 0;">
             <p style="margin: 0; color: #ffaa00;"><strong>Instructions:</strong></p>
             <p style="margin: 5px 0 0 0; color: #cccccc;">Use this QR code to validate participant times during the competition. Scan this code when prompted during the validation process.</p>
           </div>

           <p style="text-align: center; color: #888888; font-size: 12px; margin-top: 30px;">
             This QR code is valid for this competition session only.
           </p>
         </div>
       `,
       attachments: [
         {
           filename: 'qrcode.png',
           content: qrCodeDataURL.split(',')[1],
           encoding: 'base64',
           contentType: 'image/png'
         }
       ]
     };

     // Send email with QR code
     try {
       console.log('🔄 Attempting to send email to:', email);
       console.log('📊 QR Data length:', JSON.stringify(finalQrData).length);
       console.log('🖼️ Image size:', Math.round(qrCodeDataURL.length / 1024), 'KB');

       await transporter.sendMail(mailOptions);

       console.log('✅ Email sent successfully to:', email);
       console.log('🎯 QR Code generated successfully for session:', sessionId);

       res.json({
         success: true,
         message: 'QR code generated and sent successfully!',
         sessionId: sessionId,
         qrData: finalQrData,
         qrCodeImage: qrCodeDataURL,
         emailSent: true
       });

     } catch (emailError) {
       console.error('❌ Email failed:', emailError.message);
       console.log('⚠️ QR Code generated but email failed - continuing with QR code display');

       res.json({
         success: true,
         message: 'QR code generated successfully but email failed to send',
         sessionId: sessionId,
         qrData: finalQrData,
         qrCodeImage: qrCodeDataURL,
         emailSent: false,
         emailError: emailError.message,
         note: 'QR code is still valid and can be used - check email settings if needed'
       });
     }

   } catch (error) {
     console.error('Error generating QR code:', error);
     res.status(500).json({ message: 'Failed to generate QR code' });
   }
 };

export const clearRecords = async (req, res) => {
    try {
      const { adminEmail } = req.body;

      if (!adminEmail) {
        return res.status(400).json({ message: 'Admin email is required' });
      }

      // Validate admin email
      if (!validateAdminEmail(adminEmail)) {
        return res.status(403).json({
          message: 'Unauthorized: Email not authorized for admin access'
        });
      }

     // Clear leaderboard entries for this admin's sessions
     const deletedEntries = await Leaderboard.destroy({
       where: { adminEmail: adminEmail }
     });

     // Deactivate all QR sessions for this admin
     const deactivatedSessions = await QRSession.update(
       { isActive: false },
       { where: { adminEmail: adminEmail } }
     );

     res.json({
       success: true,
       message: 'Records cleared successfully',
       details: {
         leaderboardEntriesRemoved: deletedEntries,
         sessionsDeactivated: deactivatedSessions
       }
     });

   } catch (error) {
     console.error('Error clearing records:', error);
     res.status(500).json({ message: 'Failed to clear records' });
   }
 };

export const validateQR = async (req, res) => {
   try {
     const { qrData, participantId, time, participantName, scramble } = req.body;

     if (!qrData || !participantId || !time) {
       return res.status(400).json({ message: 'QR data, participant ID, and time are required' });
     }

     // Verify the QR code data
     if (qrData.type !== 'admin_session') {
       return res.status(400).json({ message: 'Invalid QR code type' });
     }

     // Check if QR session exists in database and is still valid
     const qrSession = await QRSession.findOne({
       where: {
         sessionId: qrData.sessionId,
         isActive: true
       }
     });

     if (!qrSession) {
       return res.status(400).json({ message: 'Invalid or inactive QR session' });
     }

     // Check if session is expired
     if (new Date() > qrSession.expiresAt) {
       // Mark session as inactive
       await qrSession.update({ isActive: false });
       return res.status(400).json({ message: 'QR session has expired' });
     }

     // Save participant time to leaderboard
     const leaderboardEntry = await Leaderboard.create({
       participantName: participantName || `Participant ${participantId}`,
       participantId: participantId,
       timeInSeconds: parseFloat(time),
       sessionId: qrData.sessionId,
       adminEmail: qrData.email,
       scramble: scramble || null
     });

     // If all checks pass, validate the participant
     res.json({
       success: true,
       message: 'QR code validated successfully and time recorded',
       adminEmail: qrData.email,
       sessionId: qrData.sessionId,
       leaderboardEntry: {
         id: leaderboardEntry.id,
         participantName: leaderboardEntry.participantName,
         timeInSeconds: leaderboardEntry.timeInSeconds,
         position: 'To be calculated' // Will be updated when fetching leaderboard
       }
     });

   } catch (error) {
     console.error('Error validating QR code:', error);
     res.status(500).json({ message: 'Failed to validate QR code' });
   }
 };

// Get leaderboard for all sessions or specific session
export const getLeaderboard = async (req, res) => {
  try {
    const { sessionId, adminEmail } = req.query;

    let whereCondition = {};
    if (sessionId) {
      whereCondition.sessionId = sessionId;
    }
    if (adminEmail) {
      whereCondition.adminEmail = adminEmail;
    }

    const leaderboard = await Leaderboard.findAll({
      where: whereCondition,
      order: [['timeInSeconds', 'ASC']], // Order by best times first
      limit: 100 // Limit to top 100 results
    });

    // Add position ranking
    const leaderboardWithPositions = leaderboard.map((entry, index) => ({
      ...entry.toJSON(),
      position: index + 1
    }));

    res.json({
      success: true,
      leaderboard: leaderboardWithPositions,
      totalEntries: leaderboard.length
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

// Get active QR sessions for an admin
export const getActiveSessions = async (req, res) => {
   try {
     const { adminEmail } = req.params;

     if (!adminEmail) {
       return res.status(400).json({ message: 'Admin email is required' });
     }

     // Validate admin email
     if (!validateAdminEmail(adminEmail)) {
       return res.status(403).json({
         message: 'Unauthorized: Email not authorized for admin access'
       });
     }

    const activeSessions = await QRSession.findAll({
      where: {
        adminEmail: adminEmail,
        isActive: true,
        expiresAt: {
          [Op.gt]: new Date() // Not expired
        }
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      sessions: activeSessions
    });

  } catch (error) {
    console.error('Error fetching active sessions:', error);
    res.status(500).json({ message: 'Failed to fetch active sessions' });
  }
};

// Deactivate a specific QR session
export const deactivateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const [updatedRows] = await QRSession.update(
      { isActive: false },
      { where: { sessionId: sessionId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      message: 'Session deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating session:', error);
    res.status(500).json({ message: 'Failed to deactivate session' });
  }
};