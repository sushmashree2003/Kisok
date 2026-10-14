# 🏫 Green Valley Public School — Smart Campus Kiosk & Role Portal (2026)

A modern, touch-interactive Digital Campus Kiosk and comprehensive Role-Based Portal system built for **Green Valley Public School**. Designed for physical touchscreen kiosk deployment on campus as well as cross-device web portal access.

---

## 🌟 Key Features

### 🖥️ 1. Interactive Campus Kiosk Experience (`/`)
- **Touchscreen & Kiosk-Ready**: Built-in fullscreen toggle (`Fullscreen API`) ideal for standalone campus kiosk terminals.
- **Live Clock & Announcements**: Dynamic real-time campus clock and urgent bulletin ticker.
- **Campus AI Assistant (Chatbot)**: Floating interactive virtual assistant offering instant campus navigation and answers.
- **Quick Role Switcher**: One-tap access to dedicated student, staff, admin, and alumni workspaces.
- **Campus Showcase**: Quick access to news, upcoming events, academic achievements, galleries, and campus directory.

### 👥 2. Role-Based Dashboards & Portals
- **🎓 Student Portal (`/student`)**:
  - Live attendance tracker & subject-wise breakdown
  - Daily class timetable & exam schedules
  - Homework & assignment submission tracking
  - Fee payment history & receipt download
  - Digital library book status & borrowing records
- **👨‍🏫 Staff & Faculty Portal (`/staff`)**:
  - Class attendance marking & batch management
  - Gradebook, assignment review, and marks entry
  - Staff leave balance & leave application workflow
  - Notice board publishing & teacher timetable
- **⚙️ Administrator Dashboard (`/admin`)**:
  - Campus metrics (total students, staff count, attendance percentages, fee collection stats)
  - User and role management
  - Campus-wide emergency alerts & announcement broadcasting
  - Kiosk hardware/system diagnostics and configuration
- **🤝 Alumni Portal (`/alumni`)**:
  - Alumni directory & networking
  - Mentorship program registry
  - Reunion events & campus milestone fundraisers
- **👨‍👩‍👧 Parent Access (`/parent`)**:
  - Integrated student progress monitoring and notifications

### 🔐 3. Authentication & Security (`/login`)
- Unified role-based login gateway with role switching tabs.
- Passcode & credential verification.
- Direct quick-redirect to respective dashboards upon authorization.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphic Design System |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Directory Structure

```text
Kiosk2026/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin portal route
│   │   ├── alumni/          # Alumni network route
│   │   ├── login/           # Universal authentication portal
│   │   ├── parent/          # Parent viewer route
│   │   ├── staff/           # Faculty & staff dashboard route
│   │   ├── student/         # Student portal route
│   │   ├── dashboards.css   # Role-specific dashboard themes & styles
│   │   ├── globals.css      # Core global styles, tokens, and animations
│   │   ├── layout.tsx       # Root layout configuration
│   │   └── page.tsx         # Main interactive kiosk landing screen
│   └── components/
│       ├── AdminDashboard.tsx    # Admin interface component
│       ├── AlumniDashboard.tsx   # Alumni network component
│       ├── LoginScreen.tsx       # Role authentication component
│       ├── StaffDashboard.tsx    # Staff management component
│       └── StudentDashboard.tsx  # Student portal component
├── public/                  # Static campus assets & icons
├── package.json             # Scripts & dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sushmashree2003/Kiosk2026.git
   cd Kiosk2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles and optimizes the project for production |
| `npm run start` | Starts the production server after running `build` |
| `npm run lint` | Runs ESLint to check for code style and syntax issues |

---

## 🖥️ Deploying in Kiosk Mode

To run this application on a physical touch kiosk or Raspberry Pi / Intel NUC display:

1. **Build and start production**:
   ```bash
   npm run build
   npm run start
   ```
2. **Launch Chromium in Fullscreen Kiosk Mode**:
   ```bash
   chromium-browser --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 http://localhost:3000
   ```
3. Alternatively, click the **Maximize (Fullscreen)** button on the top-right corner of the kiosk homepage.

---

## 📝 License & Attribution

Developed for **Green Valley Public School**. Built with Next.js, React, and Tailwind CSS.
