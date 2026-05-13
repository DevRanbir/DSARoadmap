<!-- PROJECT IMAGE / BANNER -->
<p align="center">
  <img width="200" alt="DSA Study Plan Logo" src="public/logo.svg" />
</p>

# 🚀 DSARoadmap

> A premium, AI-enhanced 60-day DSA study plan and progress tracker designed to make you interview-ready with zero friction.

---

## 📖 Description

DSARoadmap is a comprehensive platform built to streamline your technical interview preparation. It provides a structured 60-day curriculum covering everything from basic arrays to advanced dynamic programming and graph algorithms, with curated problems from **LeetCode**, **GeeksforGeeks**, and **Codeforces**.

What makes it unique:
- **Curated 60-Day Plan** – No more wondering "what to solve next".
- **Real-time Progress Tracking** – Visualize your journey with detailed stats and activity maps.
- **Premium WebGL UI** – Features a stunning, interactive liquid background powered by Three.js.
- **Social Sharing** – Share your public profile with recruiters or peers, or keep it private for focused study.
- **Modern Tech Stack** – Built with Next.js 16, TypeScript, and Tailwind CSS for a seamless experience.

---

## ✨ Features

- **Personalized Dashboard** – Track your daily goals and overall completion percentage.
- **Topic Breakdown** – Monitor your performance across 10+ core DSA categories.
- **Interactive Activity Map** – View your 60-day journey at a glance.
- **Glassmorphic Design** – State-of-the-art UI with backdrop blurs and fluid animations.
- **Firebase Auth & DB** – Secure Google login and real-time data persistence.
- **Public Profiles** – Showcase your dedication with a shareable progress URL.

---

## 🧠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Backend:** Firebase (Auth, Realtime Database)
- **Database (ORM):** Prisma
- **Visuals:** Three.js (Liquid Ether Simulation)
- **Icons:** Lucide React
- **Animations:** Framer Motion

---

## 🏗️ Architecture / Workflow

```text
User Login (Firebase Auth) → Dashboard → Select Day → Solve Curated Problems → Mark Complete → Realtime DB Update → UI Progress Re-render
```

---

## ⚙️ Installation & Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/DevRanbir/DSARoadmap.git

# Navigate to project
cd DSARoadmap

# Install dependencies
bun install # or npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in your Firebase credentials in .env.local

# Run Development Server
bun dev
```

---

## 🔐 Environment Variables / Configuration

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🧪 Usage

* **Step 1:** Sign in with Google to create your personalized profile.
* **Step 2:** Follow the 60-day syllabus, tackling the problems listed for each day.
* **Step 3:** Mark topics and problems as completed to update your progress.
* **Step 4:** Share your progress URL (`/username/progress`) with your network.

---

## 📂 Project Structure

```text
DSARoadmap/
├── src/
│   ├── app/                # Next.js App Router (Landing, Progress, MyPlan)
│   ├── components/ui/      # Reusable UI components (LiquidEther, etc.)
│   ├── contexts/           # Auth and Global State
│   ├── lib/                # Syllabus data and Firebase config
│   └── styles/             # Global CSS and Tailwind setup
├── public/                 # Static assets (logos, animations)
├── prisma/                 # Database schema and migrations
└── README.md               # Project documentation
```

---

## 🚧 Future Improvements

- [ ] Add built-in code editor for solving problems.
- [ ] Implement AI-driven problem hints.
- [ ] Add leaderboard for social competition.
- [ ] Create a dark/light mode toggle with persistence.
- [ ] Add support for custom study plans.

---

## 👥 Team / Author

* **Name:** DevRanbir
* **GitHub:** [https://github.com/DevRanbir](https://github.com/DevRanbir)

---

## 📜 License

This project is licensed under the MIT License.
