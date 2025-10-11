# Admin Panel System - Rubik's Cube Competition

This document explains the new admin panel system that has been implemented to enhance the automation of the Rubik's Cube competition.

## Overview

The admin panel system introduces a secure QR code-based validation process that replaces the previous email-based validation. Here's how it works:

1. **Admin Registration**: Admins enter their email address in the admin panel
2. **QR Code Generation**: A unique QR code is generated and sent to the admin's email
3. **Timer Validation**: When a participant completes their solve, they scan the admin's QR code instead of entering an email
4. **Secure Validation**: The system validates the QR code and records the admin's approval

## Features

### ✅ Admin Panel
- **Location**: `/admin` (accessible via "ADMIN PANEL" button on main page)
- **Email Input**: Admins enter their email address
- **QR Code Generation**: Automatic QR code generation and email delivery
- **Record Management**: Clear all competition records functionality

### ✅ QR Code System
- **Secure Generation**: Unique QR codes with session IDs and timestamps
- **Email Delivery**: QR codes are automatically sent to admin emails
- **Expiration**: QR codes are valid for 24 hours
- **Validation**: Real-time QR code validation during timer completion

### ✅ Enhanced Security
- **No Email Exposure**: Participant emails are no longer required during validation
- **Session Tracking**: All validations are tracked with admin session IDs
- **Time Validation**: QR codes expire after 24 hours for security

## Setup Instructions

### Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Email Settings**:
   Edit `backend/.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Note**: You'll need to:
   - Use a Gmail account
   - Enable 2-factor authentication
   - Generate an App Password for email functionality

3. **Start Backend**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

## How to Use

### For Admins:

1. **Access Admin Panel**:
   - Go to the main competition page
   - Click the "ADMIN PANEL" button

2. **Generate QR Code**:
   - Enter your email address
   - Click "GENERATE QR CODE"
   - Check your email for the QR code

3. **Validate Participants**:
   - When a participant completes their solve, the validation modal will appear
   - Click "SCAN QR" to open the QR scanner
   - Scan your QR code to validate the time

### For Participants:

1. **Normal Competition Flow**:
   - Select your cube type
   - Generate participant ID
   - Start and complete your solve

2. **Validation Process**:
   - When you stop the timer, wait for the validation modal
   - An admin will scan their QR code to validate your time
   - Your time will be added to the leaderboard upon successful validation

## Security Features

- **QR Code Expiration**: Codes expire after 24 hours
- **Session Tracking**: All validations are logged with session IDs
- **Email Verification**: QR codes are tied to specific email addresses
- **No Email Exposure**: Participant emails are never exposed during validation

## API Endpoints

### Admin Endpoints

- `POST /api/admin/generate-qr` - Generate and email QR code
- `POST /api/admin/validate-qr` - Validate QR code during timer completion
- `POST /api/admin/clear-records` - Clear all competition records

### Request/Response Examples

**Generate QR Code**:
```json
POST /api/admin/generate-qr
{
  "email": "admin@example.com",
  "qrData": {
    "type": "admin_session",
    "email": "admin@example.com",
    "sessionId": "admin_1234567890_abc123",
    "timestamp": 1640995200000
  }
}
```

**Validate QR Code**:
```json
POST /api/admin/validate-qr
{
  "qrData": {
    "type": "admin_session",
    "email": "admin@example.com",
    "sessionId": "admin_1234567890_abc123",
    "timestamp": 1640995200000
  },
  "participantId": "P001",
  "time": 45000
}
```

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Admin.jsx          # Admin panel component
│   │   └── Index.jsx          # Main competition page
│   ├── components/
│   │   ├── QRScanner.jsx      # QR code scanning component
│   │   └── AdminValidationModal.jsx # Updated validation modal
│   └── App.jsx                # Updated with routing

backend/
├── src/
│   ├── controllers/
│   │   └── adminController.js # Admin API logic
│   └── routes/
│       └── admin.js           # Admin routes
├── .env                       # Environment configuration
└── server.js                  # Updated with admin routes
```

## Troubleshooting

### Common Issues:

1. **QR Code Not Generating**:
   - Check email configuration in `.env`
   - Ensure Gmail app password is correct
   - Verify email address is valid

2. **QR Scanner Not Working**:
   - Allow camera permissions in browser
   - Ensure good lighting for QR code scanning
   - Check if using HTTPS (required for camera access)

3. **Validation Failing**:
   - Ensure QR code hasn't expired (24-hour limit)
   - Verify QR code data structure
   - Check network connectivity

### Browser Compatibility:

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Limited camera support on iOS

## Future Enhancements

- Database integration for persistent records
- Admin authentication system
- Multiple admin support
- QR code analytics and reporting
- Mobile app for easier QR scanning

---

**Note**: This system significantly enhances the security and automation of the Rubik's Cube competition by eliminating the need for email exposure during validation while maintaining a robust audit trail through QR code sessions.