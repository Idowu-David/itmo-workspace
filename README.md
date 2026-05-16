# ITMO Workspace Booking System

A full-stack web application designed to solve the problem of abandoned or poorly managed physical workspaces on campus. It allows students to view real-time desk availability, submit booking requests, and manage their time, while giving administrators the tools to approve or reject requests.

## 🚀 Key Features

- **Live Workspace Map:** Real-time visual indicator of available (Green) and occupied (Red) desks.
- **Automated Grace Period:** Integrates a backend cron-job that automatically frees up a desk if the user does not check in within 15 minutes of admin approval.
- **Role-Based Access Control (RBAC):** Secure routing and API endpoints differentiating between `student` and `admin` privileges.
- **RESTful API:** A robust Express backend managing concurrent booking attempts to prevent race conditions.

### 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
