# DentAI — AI-Powered Dental Management Platform

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
- [Author](#-author)

---

## Overview

DentAI is a comprehensive dental clinic management platform that bridges the gap between patients and dental professionals. It features AI-powered dental X-ray analysis, a slot-based appointment booking system, realtime in-appointment chat via Ably, and a powerful admin panel to manage the entire platform.

The system supports **three distinct user roles** — Patient, Dentist, and Admin — each running as a **separate React application** with its own dedicated frontend, while sharing a **single Node.js backend**.

---

## Features

### Patient Portal

| **Registration & Login** | JWT-based auth with HTTP-only cookies and refresh token rotation |
| **Profile Management** | Complete profile with phone, gender, age (required to access features) |
| **AI X-Ray Upload** | Upload dental X-ray images for instant AI-powered analysis |
| **View Reports** | Browse all AI-generated scan reports |
| **Find Dentists** | Browse approved dentists and view their available slots |
| **Book Appointments** | Book available time slots; already-booked slots shown as "Full" |
| **Consultation History** | Tabbed view — Booked / Completed / Cancelled with detail pages |
| **Realtime Chat** | Live chat with the dentist during the appointment time window |
| **Account Page** | View and edit profile details |

### Dentist Portal

| **Registration & Approval** | Register with specialty and licence number; account pending admin approval |
| **Dashboard** | Live stats: unique patients, appointments (booked + completed), upcoming count |
| **Today's Schedule** | View all today's time slots with Booked / Available status |
| **Patient Management** | Browse all patients with visit history and detail pages |
| **Appointment Management** | Full booking list with Booked / Completed / Cancelled tabs |
| **Slot Management** | Calendar-based slot creation with duplicate-time prevention; slot deletion |
| **Realtime Chat** | Live chat with patient during the appointment time window |
| **Account Page** | View registration details and approval status |

### Admin Panel
| Feature | Description |
|---|---|
| **Dashboard** | Platform-wide stats with progress bars and quick actions |
| **All Patients** | Full patient table with stats, search, delete capability |
| **All Dentists** | Full dentist table with status filter, search, delete capability |
| **Dentist Requests** | Approve / Reject / Reset pending dentist registrations |
| **All Reports** | Browse AI scan reports (static demo — real API integration ready) |

### Realtime Chat System
- Built on **Ably** with secure server-side token authentication
- Chat is **only active during the booked appointment time window**
- Both patient and dentist can send **text messages and files** (images, PDFs, documents)
- Images render inline; other files as clickable links
- Either party can **End Chat** via a confirmation modal — immediately notifies both sides
- Full chat history is preserved and viewable after ending

---

## Tech Stack

### Frontend (3 separate apps)
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool & dev server |
| React Router DOM | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility-first styling |
| Heroicons | 2.x | Icon library |
| Axios | 1.x | HTTP client |
| Ably | 2.x | Realtime chat (patient + dentist apps) |
| React Hot Toast | 2.x | Toast notifications |
| React Calendar | 6.x | Slot date picker (dentist app) |
| React Icons | 5.x | Additional icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | REST API server |
| MongoDB + Mongoose | 9.x | Database & ODM |
| JSON Web Token | 9.x | Authentication |
| bcryptjs | 3.x | Password hashing |
| Ably | 2.x | Realtime token generation + publish |
| Cloudinary | 1.x | File/image storage |
| Multer | 2.x | File upload middleware |
| Cookie Parser | 1.x | HTTP-only cookie handling |
| Morgan | 1.x | HTTP request logging |
| dotenv | 17.x | Environment variable management |

---

## Project Structure

```
DentAI/
├── README.md
│
├── server/                               # Node.js + Express backend (shared by all apps)
│   ├── app.js                            # Entry point, middleware, route registration
│   ├── package.json
│   ├── .env                              # Server environment variables
│   └── src/
│       ├── config/
│       │   └── cloudinary.js             # Cloudinary SDK configuration
│       ├── controllers/
│       │   ├── adminController.js        # Admin CRUD, stats
│       │   ├── aiController.js           # Forwards X-ray to AI microservice
│       │   ├── bookingController.js      # Booking CRUD, patient stats, today's schedule
│       │   ├── chatController.js         # Ably token, chat session, messages, file upload
│       │   ├── dentistController.js      # Dentist auth, approval, delete
│       │   ├── dentistSlotsController.js # Add/get/delete slots
│       │   └── patientController.js      # Patient auth, profile update, admin endpoints
│       ├── middlewares/
│       │   ├── isAdmin.js                # Role guard for admin-only routes
│       │   ├── upload.js                 # Multer + Cloudinary storage config
│       │   └── verifyToken.js            # JWT verification + refresh token rotation
│       ├── models/
│       │   ├── adminModel.js
│       │   ├── bookingModel.js
│       │   ├── chatModel.js
│       │   ├── dentistModel.js
│       │   ├── patientModel.js
│       │   └── slotsModel.js
│       └── routes/
│           ├── adminRoute.js             # /api/admin/*
│           ├── analysis.js               # /api/analysis/predict
│           ├── bookingRoutes.js          # /api/bookings/*
│           ├── chatRoutes.js             # /api/chat/*
│           ├── dentistRoute.js           # /api/dentists/*
│           ├── patientRoute.js           # /api/users/*
│           └── slotsRoute.js             # /api/slots/*
│
└── frontend/                             # Three separate React apps (npm workspaces)
    ├── package.json                      # Workspace root — one npm install for all
    │
    ├── patient-app/                      
    │   ├── .env
    │   ├── index.html
    │   ├── vite.config.js
    │   ├── package.json
    │   └── src/
    │       ├── App.jsx
    │       ├── main.jsx
    │       ├── context/AuthContext.jsx
    │       ├── components/
    │       │   ├── PatientLayout/
    │       │   ├── PatientSidebar/
    │       │   ├── PatientHeader/
    │       │   ├── MobilePatientSidebar/
    │       │   ├── Header/
    │       │   ├── Footer/
    │       │   └── ProtectedRoute/
    │       └── pages/
    │           ├── LandingPage/
    │           ├── PatientLogin/
    │           ├── PatientDashboard/
    │           ├── PatientUploadXRay/
    │           ├── PatientAllReports/
    │           ├── PatientBookConsultation/
    │           ├── PatientBookSlot/
    │           ├── PatientAllConsultations/
    │           ├── PatientConsultationDetail/
    │           ├── PatientAccount/
    │           ├── Analyze/
    │           └── Chat/
    │
    ├── dentist-app/                      
    │   ├── .env
    │   ├── index.html
    │   ├── vite.config.js
    │   ├── package.json
    │   └── src/
    │       ├── App.jsx
    │       ├── main.jsx
    │       ├── context/AuthContext.jsx
    │       ├── components/
    │       │   ├── DentistLayout/
    │       │   ├── DentistSidebar/
    │       │   ├── DentistHeader/
    │       │   └── ProtectedRoute/
    │       └── pages/
    │           ├── DentistLogin/
    │           ├── DentistDashboard/
    │           ├── DentistAllPatients/
    │           ├── DentistAllAppointments/
    │           ├── DentistAllSlots/
    │           ├── AddSlots/
    │           ├── PatientBookingPage/
    │           ├── PatientDetailPage/
    │           ├── DentistAccount/
    │           └── Chat/
    │
    └── admin-app/                        
        ├── .env
        ├── index.html
        ├── vite.config.js
        ├── package.json
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── context/AuthContext.jsx
            ├── components/
            │   ├── AdminLayout/
            │   ├── AdminSidebar/
            │   ├── AdminHeader/
            │   └── ProtectedRoute/
            └── pages/
                ├── AdminLogin/
                ├── AdminDashboard/
                ├── AdminAllPatients/
                ├── AdminDentist/
                ├── AdminDentistRequests/
                └── AdminAllReports/
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** — local install or [MongoDB Atlas](https://cloud.mongodb.com)
- A **Cloudinary** account (free tier)
- An **Ably** account with a Chat app (free tier)

---

### 1. Clone the Repository


### 2. Set Up the Server

cd server
npm install

Create `server/.env` (see [Environment Variables](#-environment-variables) below), then:

npm run dev
# Server starts at https://13.51.175.156.nip.io


### 3. Seed the First Admin (one-time only)

After the server starts, open this URL in your browser once:

This creates the default admin account. Check `adminController.js → createFirstAdmin` for the default credentials and change them after first login.


cd frontend

### 4. Run the Apps

Open **three separate terminals** from the `frontend/` folder:

# Terminal 1 — Patient App
cd frontend
cd patient-app
npm install
npm run dev

# Terminal 2 — Dentist App
cd frontend
cd dentist-app
npm install
npm run dev

# Terminal 3 — Admin App
cd frontend
cd admin-app
npm install
npm run dev


## 🔐 Environment Variables

### Server — `server/.env`

# Server
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URL="mongodb+srv://imhammadansari:hammad64@cluster0.4mdno.mongodb.net/dentAi"
# MONGODB_URL="mongodb://localhost:27017/dentAI"
JWT_TOKEN=dentAI
REFRESH_TOKEN=REFRESH_TOKEN_DentAI
CLOUD_NAME=dajsvzu0q
CLOUD_API_KEY=883238264377216
CLOUD_SECRET_KEY=vnUFxkUq5C-1nhEqnYRK6rNsRhk
ABLY_API_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE

### Patient App — `frontend/patient-app/.env`

VITE_SERVER_URL=https://13.51.175.156.nip.io
VITE_ABLY_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE

### Dentist App — `frontend/dentist-app/.env`

VITE_SERVER_URL=https://13.51.175.156.nip.io
VITE_ABLY_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE

### Admin App — `frontend/admin-app/.env`

VITE_SERVER_URL=https://13.51.175.156.nip.io
VITE_ABLY_KEY=2P53Rg.GMFRPw:NW3Iv-K_cGNFx59UCdWBQ3T5cNB6FW6sfJHdz9vHlIE


## 💬 Realtime Chat System

The chat system uses **Ably** with secure server-side token authentication.

### How it works

1. User opens chat page → frontend calls `GET /api/chat/token`
2. Server uses the **Root API key** to generate a short-lived `TokenRequest` scoped to that user's ID
3. Frontend initialises `Ably.Realtime` using this token — **root key never touches the browser**
4. Both patient and dentist subscribe to the same channel: `chat-{bookingId}`
5. Message sent → saved to MongoDB + published to Ably channel simultaneously
6. All subscribers receive it in real-time via `channel.subscribe("message", ...)`

### Chat Time Window

The Chat button is only active when:
- Booking status is `"Booked"`
- Today's date matches the booking date
- Current time is between `booking.start` and `booking.end`

### File Sharing

Files upload to Cloudinary via `POST /api/chat/:bookingId/upload`. Images render inline; PDFs and documents render as download links.

### Ending a Chat

Either party clicks **End Chat** → confirms → chat `status` set to `"ended"` in MongoDB → `"chat-ended"` event published to Ably channel → other party's UI updates instantly.


## 👨‍💻 Author

**Hammad Ansari**


## 📄 License

This project is licensed under the **ISC License**.

# AI Server Start
cd ai_service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001

## Credentials

### Admin
admin@dentai.com
Admin@123

### Dentists
farankhalil@gmail.com
123456

dusdus@gmail.com
123456

hammadansari@example.com
123456

### Patients
jhulelaal@gmail.com
123456

muaaz@gmail.com
123456