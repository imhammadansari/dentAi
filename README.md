# DentAI — AI-Powered Dental Management Platform

<div align="center">

![DentAI Banner](https://img.shields.io/badge/DentAI-Dental%20Platform-emerald?style=for-the-badge&logo=tooth&logoColor=white)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205.x-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.x-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Ably](https://img.shields.io/badge/Ably-Realtime%20Chat-FF5416?style=flat-square&logo=ably)](https://ably.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

A full-stack dental clinic management system with AI-powered X-Ray analysis, realtime patient-dentist chat, appointment booking, and a complete admin control panel.

</div>


## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles & Flows](#-user-roles--flows)
- [Database Models](#-database-models)
- [Realtime Chat System](#-realtime-chat-system)
- [AI X-Ray Analysis](#-ai-x-ray-analysis)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## Overview

DentAI is a comprehensive dental clinic management platform that bridges the gap between patients and dental professionals. It features AI-powered dental X-ray analysis, a slot-based appointment booking system, realtime in-appointment chat via Ably, and a powerful admin panel to manage the entire platform.

The system supports **three distinct user roles** — Patient, Dentist, and Admin — each with a dedicated dashboard, sidebar, and protected routes.


## Features

### Patient Portal

**Registration & Login** JWT-based auth with HTTP-only cookies and refresh token rotation 
**Profile Management** Complete profile with phone, gender, age (required to access features) 
**AI X-Ray Upload** Upload dental X-ray images for instant AI-powered analysis 
**View Reports** Browse all AI-generated scan reports 
**Find Dentists** Browse approved dentists and view their available slots 
**Book Appointments** Book available time slots; already-booked slots shown as "Full" 
**Consultation History** Tabbed view — Booked / Completed / Cancelled with detail pages 
**Realtime Chat** Live chat with the dentist during the appointment time window 
**Account Page** View and edit profile details 

### Dentist Portal

**Registration & Approval** Register with specialty and licence number; account pending admin approval 
**Dashboard** Live stats: unique patients, appointments (booked + completed), upcoming count 
**Today's Schedule** View all today's time slots with Booked / Available status 
**Patient Management** Browse all patients with visit history and detail pages 
**Appointment Management** Full booking list with Booked / Completed / Cancelled tabs 
**Slot Management** Calendar-based slot creation with duplicate-time prevention; slot deletion 
**Realtime Chat** Live chat with patient during the appointment time window 
**Account Page** View registration details and approval status 

### Admin Panel

**Dashboard** Platform-wide stats with progress bars and quick actions 
**All Patients** Full patient table with stats, search, delete capability 
**All Dentists** Full dentist table with status filter, search, delete capability 
**Dentist Requests** Approve / Reject / Reset pending dentist registrations 
**All Reports** Browse AI scan reports (static demo — real API integration ready) 

### Realtime Chat System
- Built on **Ably** with secure server-side token authentication
- Chat is **only active during the booked appointment time window**
- Both patient and dentist can send **text messages and files** (images, PDFs, documents)
- Images render inline; other files as clickable links
- Either party can **End Chat** via a confirmation modal — immediately notifies both sides
- Full chat history is preserved and viewable after ending

## Tech Stack

### Frontend

React 19.x UI framework 
Vite 7.x Build tool & dev server 
React Router DOM 7.x Client-side routing 
Tailwind CSS 4.x Utility-first styling 
Heroicons 2.x Icon library 
Axios 1.x HTTP client 
Ably 2.x Realtime chat (client) 
React Hot Toast 2.x Toast notifications 
React Calendar 6.x Slot date picker 
React Icons 5.x Additional icons 

### Backend

Node.js + Express 5.x REST API server 
MongoDB + Mongoose 9.x Database & ODM 
JSON Web Token 9.x Authentication 
bcryptjs 3.x Password hashing 
Ably 2.x Realtime token generation + publish 
Cloudinary 1.x File/image storage 
Multer 2.x File upload middleware 
Cookie Parser 1.x HTTP-only cookie handling 
Morgan 1.x HTTP request logging 
dotenv 17.x Environment variable management 

## Project Structure

Dent AI/
├── server/                          # Node.js + Express backend
│   ├── app.js                       # Entry point, middleware, route registration
│   ├── package.json
│   ├── .env                         # Environment variables (see below)
│   └── src/
│       ├── config/
│       │   └── cloudinary.js        # Cloudinary SDK configuration
│       ├── controllers/
│       │   ├── adminController.js   # Admin CRUD, stats
│       │   ├── aiController.js      # Forwards X-ray to AI microservice
│       │   ├── bookingController.js # Booking CRUD, patient stats, today's schedule
│       │   ├── chatController.js    # Ably token, chat session, messages, file upload
│       │   ├── dentistController.js # Dentist auth, approval, delete
│       │   ├── dentistSlotsController.js # Add/get/delete slots
│       │   └── patientController.js # Patient auth, profile update, admin endpoints
│       ├── middlewares/
│       │   ├── isAdmin.js           # Role guard for admin-only routes
│       │   ├── upload.js            # Multer + Cloudinary storage config
│       │   └── verifyToken.js       # JWT verification + refresh token rotation
│       ├── models/
│       │   ├── adminModel.js        # Admin schema
│       │   ├── bookingModel.js      # Appointment/booking schema
│       │   ├── chatModel.js         # Chat session + messages schema
│       │   ├── dentistModel.js      # Dentist schema with approvalStatus
│       │   ├── patientModel.js      # Patient schema with phone/gender/age
│       │   └── slotsModel.js        # Time slot schema
│       └── routes/
│           ├── adminRoute.js        # /api/admin/*
│           ├── analysis.js          # /api/analysis/predict
│           ├── bookingRoutes.js     # /api/bookings/*
│           ├── chatRoutes.js        # /api/chat/*
│           ├── dentistRoute.js      # /api/dentists/*
│           ├── patientRoute.js      # /api/users/*
│           └── slotsRoute.js        # /api/slots/*
│
└── dentist/                         # React + Vite frontend (all portals)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env                         # Frontend environment variables
    └── src/
        ├── App.jsx                  # Root router with all protected routes
        ├── main.jsx
        ├── context/
        │   └── AuthContext.jsx      # Global auth state, login/logout helpers
        ├── Components/
        │   ├── AdminLayout/         # Admin shell (sidebar + header + outlet)
        │   ├── AdminSidebar/        # Admin navigation
        │   ├── DentistHeader/       # Dentist top bar with account dropdown
        │   ├── DentistLayout/       # Dentist shell
        │   ├── DentistSidebar/      # Dentist navigation
        │   ├── PatientHeader/       # Patient top bar with account dropdown
        │   ├── PatientLayout/       # Patient shell
        │   ├── PatientSidebar/      # Patient navigation
        │   └── ProtectedRoute/      # Role-based route guard
        └── pages/
            ├── LandingPage/         # Public home page
            ├── PatientLogin/        # Patient sign in / register
            ├── DentistLogin/        # Dentist sign in / register
            ├── AdminLogin/          # Admin sign in
            │
            ├── PatientDashboard/    # Patient home overview
            ├── PatientUploadXRay/   # Upload X-ray for AI analysis
            ├── PatientAllReports/   # View AI scan reports
            ├── PatientBookConsultation/ # Browse dentists to book
            ├── PatientBookSlot/     # Select slot (Full/Available)
            ├── PatientAllConsultations/ # Booked/Completed/Cancelled tabs
            ├── PatientConsultationDetail/ # Single booking detail view
            ├── PatientAccount/      # Profile completion (phone/gender/age)
            │
            ├── DentistDashboard/    # Dentist stats + today's schedule
            ├── DentistAllPatients/  # Patient list with visit history
            ├── DentistAllAppointments/ # All appointments with status tabs
            ├── PatientBookingPage/  # Patient's bookings (dentist view)
            ├── PatientDetailPage/   # Single patient detail
            ├── AddSlots/            # Calendar + time grid slot creator
            ├── DentistAllSlots/     # Manage all slots with delete
            ├── DentistAccount/      # Dentist profile viewer
            │
            ├── AdminDashboard/      # Platform-wide stats
            ├── AdminAllPatients/    # Patient management table
            ├── AdminDentist/        # Dentist management table
            ├── AdminDentistRequests/ # Approve/Reject dentist requests
            ├── AdminAllReports/     # Report browser (static demo)
            │
            ├── ChatPage/            # Realtime chat (shared by patient + dentist)
            └── Analyze/             # AI analysis result display
```

## Getting Started

### 1. Clone the Repository

### 2. Set Up the Server

cd server
npm install

Create a `.env` file in the `server/` directory (see [Environment Variables](#-environment-variables) below), then:

npm run dev
# Server starts at http://localhost:8000


### 3. Set Up the Frontend

cd ../dentist
npm install

Create a `.env` file in the `dentist/` directory (see [Environment Variables](#-environment-variables) below), then:


npm run dev
# Frontend starts at http://localhost:5173


## 🔐 Environment Variables

### Server — `server/.env`

# Server
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URL="mongodb://localhost:27017/dentAI"
JWT_TOKEN=dentAI
REFRESH_TOKEN=REFRESH_TOKEN_DentAI
CLOUD_NAME=dajsvzu0q
CLOUD_API_KEY=883238264377216
CLOUD_SECRET_KEY=vnUFxkUq5C-1nhEqnYRK6rNsRhk
ABLY_API_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE

### Frontend — `dentist/.env`

VITE_SERVER_URL=http://localhost:8000
VITE_ABLY_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE

## 👥 User Roles & Flows

### Patient Flow

```
Register → Login → Complete Profile (phone/gender/age required)
    → Upload X-Ray → Get AI Analysis Report
    → Browse Dentists → Select Slot → Book Appointment
    → During Appointment Time → Chat with Dentist
    → View Consultation History (Booked/Completed/Cancelled)
```

### Dentist Flow

```
Register → Wait for Admin Approval → Login
    → Add Time Slots (calendar + time grid, duplicates prevented)
    → View Patients who booked
    → During Appointment Time → Chat with Patient
    → Mark appointments as Completed
    → View Dashboard stats + Today's Schedule
```

### Admin Flow

```
Seed Admin Account (one-time) → Login
    → Review Pending Dentist Registrations → Approve / Reject
    → Monitor Platform Stats (patients, dentists, appointments)
    → Manage Patients (view details, delete)
    → Manage Dentists (view details, filter by status, delete)
    → Browse Reports
```


## 💬 Realtime Chat System

The chat system uses **Ably** with secure server-side token authentication.

### How it works

1. When a user opens the chat page, the frontend calls `GET /api/chat/token`
2. The server uses the **Root API key** to generate a short-lived `TokenRequest` (Ably v2 Promise API) scoped to that user's ID
3. The frontend initialises `Ably.Realtime` using this token — **the root key never touches the browser**
4. Both patient and dentist subscribe to the same channel: `chat-{bookingId}`
5. When a message is sent, it's saved to MongoDB via `POST /api/chat/:bookingId/message` and simultaneously published to the Ably channel via the server's `Ably.Rest` instance
6. All subscribers receive the message in real-time via their `channel.subscribe("message", ...)` listener

### Chat Time Window

The **Chat button** is only enabled when:
- The booking status is `"Booked"`
- Today's date matches the booking date
- The current time is between `booking.start` and `booking.end`

Outside this window, the button is rendered but visually disabled with a tooltip.

### File Sharing

Files are uploaded to **Cloudinary** via `POST /api/chat/:bookingId/upload` using Multer's memory storage. The returned `fileUrl` is then sent as a message. Images render inline; PDFs and other files render as a download link.

### Ending a Chat

Either party can click **End Chat**, confirm in the modal, then:
- The chat's `status` is set to `"ended"` in MongoDB
- A `"chat-ended"` event is published to the Ably channel
- The other party's UI updates instantly via their subscription — no polling required

## Author

**Hammad Ansari**

Built with ❤️ using React, Node.js, MongoDB, Ably, and Cloudinary.

## 📄 License

This project is licensed under the **ISC License**.