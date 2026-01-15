# System Architecture

## Overview
The Faculty Management System is a comprehensive MERN (MongoDB, Express, React, Node.js) application designed to streamline academic administration. It features a high-performance REST API backend and a "futuristic" cursor-reactive frontend built with React, Three.js, and Tailwind CSS.

## Technology Stack

### Frontend
- **Framework**: React 19 (via Create React App)
- **Styling**: Tailwind CSS (Utility-first), CSS Variables (Theming)
- **Animation**: Framer Motion (Page transitions, Micro-interactions), GSAP (Complex sequences)
- **3D Graphics**: React Three Fiber + Drei (Background scenes, Data viz)
- **State Management**: React Context API (Auth)
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with RBAC (Role-Based Access Control)
- **Security**: Helmet (Headers), Bcrypt (Password Hashing), CORS

## Directory Structure
- `frontend/`: React application assets and source code.
    - `src/components/3d`: Three.js scenes.
    - `src/pages`: Route components (AdminDB, FacultyDB).
- `backend/`: Node.js server.
    - `models/`: Mongoose schemas.
    - `controllers/`: Business logic.
    - `routes/`: API endpoints.
    - `middleware/`: Auth and Error handling.

## Security Flow
1. User logs in via `/api/auth/login`.
2. Server verifies credentials and issues a signed JWT.
3. Frontend stores JWT in localStorage (or memory).
4. `protect` middleware intercepts subsequent requests, decoding the token to attach `req.user`.
5. `admin` middleware checks `req.user.role` for privileged actions.
