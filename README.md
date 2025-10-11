# 🚀 Rubik's Cube Competition System - Complete Documentation



## 🎯 Overview

This project is a **complete Rubik's Cube competition system** with the following features:

### ✅ Main Features
- **Secure QR code generation** for administrators
- **Automatic time validation** via QR code
- **Real-time leaderboard** with positions
- **Admin session management** with automatic expiration
- **Admin authentication system** by email
- **Modern user interface** with React and Tailwind CSS

### 🛡️ Security
- **Strict admin email validation** (whitelist)
- **QR codes with expiration** (24h)
- **Traceable sessions** with unique IDs
- **CORS protection** configured
- **Secure environment variables**

---

## 🏗️ Architecture

### **Frontend (React + Vite)**
- **Modern and responsive user interface**
- **Integrated QR code scanner**
- **Precise timer management**
- **Real-time leaderboard**
- **Automatic proxy** to backend

### **Backend (Node.js + Express)**
- **Complete REST API**
- **PostgreSQL database**
- **Automatic email sending**
- **QR code generation**
- **Secure validation**

---

## 🔥 Detailed Features

### **👑 Admin System**
- **Unique QR code generation** per email
- **Automatic email sending** with attachment
- **Active session management**
- **Competition data cleanup**
- **Authorized email whitelist**

### **⏱️ Timing System**
- **Precise timers** for different cube categories
- **Automatic participant ID generation**
- **Admin QR code validation**
- **Automatic time saving**

### **🏆 Leaderboard**
- **Times sorted** in ascending order
- **Automatic positions**
- **Filtering by session** or admin
- **Complete performance history**

### **📧 Email System**
- **Gmail configuration** with App Passwords
- **Automatic QR code sending**
- **Custom HTML templates**
- **Complete error handling**

---

## 🚀 Installation

### **Prerequisites**
- **Node.js** (v16+ recommended)
- **PostgreSQL** (v13+ recommended)
- **Gmail account** for sending emails

### **Backend**
```bash
cd backend
npm install
```

### **Frontend**
```bash
cd frontend
npm install
```


---

## 🎮 Usage

### **Starting the Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### **Competition Workflow**

#### **For Administrators:**
1. **Access the admin panel** via the "ADMIN PANEL" button
2. **Enter your authorized email**
3. **Receive the QR code** by email automatically
4. **Scan the QR code** when validating times

#### **For Participants:**
1. **Select the cube type**
2. **Generate a participant ID**
3. **Complete the solve** with the timer
4. **Wait for admin validation** via QR code

---

## 🔐 Security

### **Admin Authentication**
- **Email whitelist** in `ADMIN_EMAILS`
- **Automatic validation** before QR code generation
- **Protection against unauthorized access**

### **QR Code Security**
- **Automatic expiration** after 24 hours
- **Unique session IDs** for traceability
- **Encrypted data** in the QR code

### **Best Practices**
- **Environment variables** for passwords
- **CORS configured** to prevent attacks
- **Server-side data validation**

---

## 🌐 API Endpoints

### **📊 Admin Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/generate-qr` | Generate and send a QR code |
| `POST` | `/api/admin/validate-qr` | Validate a time with QR code |
| `GET` | `/api/admin/leaderboard` | Retrieve the leaderboard |
| `POST` | `/api/admin/clear-records` | Clear the data |
| `GET` | `/api/admin/sessions/:adminEmail` | Active sessions of an admin |
| `GET` | `/api/admin/admin-emails` | List of authorized admin emails |

### **🔐 Auth Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |





---

## 📁 File Structure

```
rubiks-cube-competition/
├── 📁 backend/
│   ├── 📄 .env                    # Environment variables
│   ├── 📄 .gitignore             # Files to ignore
│   ├── 📄 server.js              # Main server
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   ├── 📄 adminController.js    # Admin logic
│   │   │   └── 📄 authController.js     # Authentication
│   │   ├── 📁 models/
│   │   │   ├── 📄 QRSession.js         # QR session model
│   │   │   ├── 📄 Leaderboard.js       # Leaderboard model
│   │   │   └── 📄 User.js              # User model
│   │   └── 📁 routes/
│   │       ├── 📄 admin.js             # Admin routes
│   │       └── 📄 auth.js              # Auth routes
│   └── 📄 package.json
│
├── 📁 frontend/
│   ├── 📄 index.html
│   ├── 📄 package.json
│   ├── 📄 vite.config.js         # Configuration with proxy
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📄 QRScanner.jsx         # QR scanner
│   │   │   ├── 📄 Timer.jsx             # Timer
│   │   │   ├── 📄 Leaderboard.jsx       # Leaderboard
│   │   │   └── 📄 Admin.jsx             # Admin panel
│   │   ├── 📁 config/
│   │   │   └── 📄 api.js                # API configuration
│   │   └── 📁 pages/
│   │       ├── 📄 Index.jsx             # Main page
│   │       └── 📄 Admin.jsx             # Admin page
│   └── 📁 public/
│
└── 📄 README.md                  # This documentation
```

---



#### **2. QR scanner not working**
- **Allow camera access** in the browser
- **Use HTTPS** in production
- **Check lighting** for scanning

#### **3. API connection error**
```bash
# Check if backend is running
curl http://localhost:5000/api/test

# Check proxy configuration
cat frontend/vite.config.js
```

#### **4. Database**
```bash
# Check PostgreSQL connection
cd backend && node -e "console.log('DB test')"
```

### **🔍 Useful Logs**
```bash
# Backend logs
cd backend && npm start

# With more details
DEBUG=* npm start
```

---

## 💻 Development

### **Available Scripts**

#### **Backend:**
```bash
npm start      # Start the server
npm run dev    # Development with nodemon
npm test       # Tests
```

#### **Frontend:**
```bash
npm run dev    # Start development
npm run build  # Build production
npm run preview # Preview production
```


---



## 🎉OverAll

This system provides a **complete and secure solution** for organizing Rubik's Cube competitions with:

✅ **Automatic QR code generation**
✅ **Secure time validation**
✅ **Real-time leaderboard**
✅ **Modern user interface**
✅ **Enhanced security**
✅ **Simple configuration**

The system is **production-ready** and can be deployed immediately! 🚀