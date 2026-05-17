# 🏠 PG Management System

A full-stack web platform built to digitalize and streamline day-to-day operations of Paying Guest (PG) accommodations and hostels — from complaint tracking to leave approvals.

---

## 💡 Motivation

While living in a hostel, I noticed that tenants had to raise complaints through a manual Google Form, with zero visibility on status or resolution. There was no structured way to manage maintenance, communicate notices, or handle leave requests. I built this platform to replace that fragmented experience with a centralized, role-based system that works for both owners and tenants.

---

## 🚀 Live Demo

🔗 [your-deployment-url.vercel.app](#) <!-- Replace with your actual URL -->

---

## ✨ Features

### 👤 Tenant Portal
- **Complaint Management** — Raise and track complaints with real-time status updates
- **Maintenance Requests** — Submit requests for room or facility repairs
- **Leave Requests** — Apply for leave with automatic parent approval workflow
- **Notices** — View announcements and updates from the admin

### 🛠️ Admin Dashboard
- **Tenant & Room Management** — Add, update, and manage tenant profiles and room allocations
- **Complaint & Maintenance Tracker** — View, assign, and resolve incoming requests
- **Notice Board** — Broadcast notices to all tenants instantly
- **Leave Approval Panel** — Review and act on leave applications

### 🔔 Leave Request with Parent Approval
A unique workflow where tenant leave requests are sent to parents for approval before reaching the admin — bringing accountability and structure to the process.

---

## 🧱 Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | Next.js, React      |
| Styling     | Tailwind CSS        |
| Deployment  | Vercel              |

---

## 📸 Screenshots

> _Add screenshots of your dashboard, complaint form, and leave request flow here._

---

## 🗂️ Project Structure

```
├── app/                  # Next.js app directory
│   ├── admin/            # Admin dashboard pages
│   ├── tenant/           # Tenant portal pages
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                  # Utilities and helpers
└── public/               # Static assets
```

---

## 🏃 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/pg-management-system.git

# Navigate into the project
cd pg-management-system

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔮 Roadmap

- [ ] Email/SMS notifications for complaint updates
- [ ] Rent payment tracking and reminders
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard for owners

---

## 🙋 About

Built by Hamza Shabbir — feel free to connect on [https://www.linkedin.com/in/hamza0704/](#) or check out my other projects on [https://github.com/hamza0704?tab=repositories](#).

> *This project was born out of a real problem I faced as a hostel tenant. Sometimes the best ideas come from the most mundane frustrations.*
