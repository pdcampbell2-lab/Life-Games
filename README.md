# Life Games - Educational Interactive Platform

Life Games is an educational, scenario-based learning platform designed for secondary school students (grades 9–12). It helps students master real-world life skills through immersive, data-driven decision gaming.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Architecture & MVP Components

### 1. Game Engine (`/src/app/student/module/[id]`)
- **Data-Driven**: Scenario flow is managed by a structured JSON-like object.
- **State Management**: React hooks handle score, current scenario, and feedback overlays.
- **Immersive UI**: Built with Framer Motion for smooth transitions between decision points.

### 2. Role-Based Dashboards
- **Student (`/student/dashboard`)**: Visualizes learning paths, skill radar (growth), and recently assigned modules.
- **Teacher (`/teacher/dashboard`)**: Provides high-level metrics (Completion %, Avg Score) and a detailed student progress table.

### 3. Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom Design System
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Outfit (via Google Fonts)

### 4. Database Schema (Planned for Supabase)
- `Users`: Roles (Admin/Teacher/Student), School association.
- `Modules/Scenarios/Choices`: The content tree for the game engine.
- `Progress`: Tracking score, completion, and specific choices for teacher review.

## 🛠 Design Principles
- **Aesthetic**: Premium, vibrant, and clean. Uses glassmorphism and soft gradients to keep students engaged.
- **Simplicity**: No cluttered sidebars; focus is on the current learning task or metric.
- **Responsive**: Fully responsive for Chromebooks, tablets, and desktop browsers.

## 🔮 Future Expansion (V2)
- Supabase Auth integration (Email/Password & Social).
- Reflection journals for students after each module.
- AI-generated summaries for teachers on "difficult" decision trends.
- Leaderboards and custom badge systems.
