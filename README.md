# Faculty Management System

A digital portal designed to replace manual paperwork for university departments. This application allows Heads of Departments (HODs) to manage faculty tasks, monitor progress, and handle leave requests efficiently.

## 🚀 Features

*   **Role-Based Dashboards**: Distinct interfaces for HODs and Faculty members.
*   **Task Assignment**: HODs can assign tasks with specific deadlines and priorities.
*   **Smart Progress Tracking**: Faculty can update task status using an interactive, physics-based slider.
*   **Leave Management System**: Built-in validation allows faculty to request leave, which HODs can review.
*   **Dept Analytics**: Visual charts showing task completion rates and department performance.
*   **Report Generation**: One-click PDF downloads for individual faculty performance reports.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Framer Motion (Animations), Three.js (Visuals).
*   **Backend**: Node.js, Express.js.
*   **Database**: SQLite (Development) / PostgreSQL (Production ready).
*   **Auth**: JWT (JSON Web Tokens) with secure password hashing.

## 📦 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Gagansai9/Faculty-Management.git
    cd Faculty-Management
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Start the Application**
    Open two terminal windows:

    *   Terminal 1 (Backend):
        ```bash
        cd backend
        npm start
        ```
    *   Terminal 2 (Frontend):
        ```bash
        cd frontend
        npm start
        ```

4.  **Access the App**
    Go to `http://localhost:3000`

## 🔑 Default Credentials (for testing)

*   **HOD (Admin)**: `hod@gmail.com` / `password123`
*   **Faculty**: `faculty@gmail.com` / `password123`

---
*Built by Gagansai*
