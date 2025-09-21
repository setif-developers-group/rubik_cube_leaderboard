# Rubik Cube Leaderboard 🧩

Rubik Cube Leaderboard for the **Open Day Event** 🎉  

This project will track participants’ Rubik’s Cube solving times, validate them using **team validator QR codes**, and display a live leaderboard.  

---

## 📌 Overview

The system has **two main parts**:
- **Backend**: APIs for validator QR codes, validation, and leaderboard management.
- **Frontend**: Leaderboard page, stopwatch interface, and QR scanning flow.

---

## ⚙️ Backend

### Features

1. **Validator QR Code Generation API**
   - Input: `validator_name`, `validator_email` (created via admin panel).
   - Process: Encrypts validator info (id, name, email, optional expiry) and generates a QR code.
   - Output: QR code (download or sent by email to the validator).
   - Use: These QR codes are held by team members (validators) to approve solves.

2. **QR Code Validation API**
   - Input: Encrypted token from scanned validator QR + participant name + solving time.
   - Process: 
     - Decrypt and verify token.
     - Check validator is active.
     - If valid → accept solving attempt.
   - Output: Return validator details (name/id) and success/failure.
   - On success → store attempt in DB and update leaderboard.

3. **Admin Panel / Auth**
   - Login for admins.
   - Manage validators (create and send by email) info : name, email.
   - Generate validator QR codes.

4. **Database (suggested schema)**
   - `attempts` (id, participant_name , time_ms, name, validated_at)

---

## 🎨 Frontend

### Pages & Flow

1. **Leaderboard Page**
   - Displays all participants and their best solving times.
   - Updates live or on refresh.

2. **Start New Trial Page**
   - Start a stopwatch for the participant.
   - After solve → request validator approval.
   - Camera scans validator’s QR code.
   - Send: participant name + solving time + scanned token to backend.
   - If validated → result stored in DB → leaderboard updated.

---

## 🚀 Tech Stack (Proposed)(team choice)

- **Backend**: Python (FastAPI / Django)
- **Database**: SQLite
- **Frontend**: React or Vue



## 📂 Project Structure
rubik_cube_leaderboard/
│── backend/
│
│── frontend/
│
│── README.md

## ✅ To-Do (Team Tasks)

- [ ] Set up backend project with APIs.
- [ ] Implement encryption & validator QR code generation.
- [ ] Build admin panel with login to manage validators.
- [ ] Implement QR code scanning & validation.
- [ ] Design DB schema (`attempts`).
- [ ] Build leaderboard frontend.
- [ ] Build stopwatch and trial validation flow.