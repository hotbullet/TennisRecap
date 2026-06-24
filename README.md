# 🎾 TennisRecap

**TennisRecap** is a mobile-first planning platform built for junior tennis athletes and their families in Thailand. It helps young athletes, parents, and coaches stay aligned on daily readiness, tournament planning, investment tracking, and private reflections — all in one supportive, Thai-language interface.

🌐 [tennisrecap.com](https://tennisrecap.com)

---

## 📱 What is TennisRecap?

Raising a competitive junior tennis player involves juggling training schedules, tournament calendars, family decisions, and financial commitments. TennisRecap brings all of these into a single, calm, family-friendly app designed specifically for Thai tennis families.

The app speaks **Thai by default**, uses a warm green-and-white visual style, and treats the athlete's privacy with respect — no guilt, no pressure, just clarity and support.

---

## 🧪 Current Status — MVP (v1.0)

The current version is an **MVP (Minimum Viable Product)**. All data is static mock data. There is no backend, no login, and no database. The MVP demonstrates the full planned experience with realistic sample content so that families, coaches, and stakeholders can see how the final platform will work.

---

## 🧭 Core Tabs

The app is organized into five bottom-navigation tabs:

| Tab | Thai Label | What It Does |
|-----|-----------|--------------|
| **Today** | วันนี้ | Daily athlete readiness dashboard — mood, energy, quick check-ins ("ซ้อมดี", "ล้า", "มั่นใจ", etc.), and today's schedule |
| **14-Day Plan** | 14 วัน | Two-week timeline view showing training, matches, fitness, recovery, school, and tournaments |
| **Family Plan Room** | ครอบครัว | Tournament proposal review — family members (พ่อ, แม่, นักกีฬา, โค้ช) react, comment, and choose between Plan A / B / C |
| **Investment** | การลงทุน | Budget-vs-actual cost tracker and a "สิ่งที่ได้ลงทุน" section showing time, energy, money, and life lessons gained |
| **Private Note** | บันทึก | Athlete's private journal — write notes, tag them, and control visibility (private, share with parents, share with coach) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| Font | [Sarabun](https://fonts.google.com/specimen/Sarabun) (Google Fonts, Thai + Latin) |
| Data | **Mock data only** (no API, no database) |
| Linting | [ESLint](https://eslint.org/) with TypeScript + React plugins |

---

## 🚀 How to Run Locally

You need [Node.js](https://nodejs.org/) (version 18 or newer) installed on your computer.

```bash
# 1. Clone the repository
git clone https://github.com/hotbullet/TennisRecap.git
cd TennisRecap

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. The app is designed to look best at mobile screen widths (max-width 448px / max-w-md), which you can simulate using your browser's device toolbar.

---

## ✅ How to Verify Everything Works

Run these three commands to check that the code is clean, type-safe, and builds correctly:

```bash
# Lint check — catches code quality issues
npm run lint

# Type check — ensures TypeScript types are correct
npx tsc --noEmit

# Build check — confirms the app can be built for production
npm run build
```

All three should pass without errors. If any fail, there is likely an issue in the code (not your setup).

---

## ⚠️ Current MVP Boundaries

This is an early-stage MVP. The following features are **not yet implemented**:

- ❌ No backend / API server
- ❌ No authentication or login
- ❌ No database (all data is hardcoded mock data)
- ❌ No AI or smart recommendations
- ❌ No video upload or media storage
- ❌ No payment or billing
- ❌ No real drag-and-drop interactions

Everything you see in the app is static sample data. Buttons like check-ins and save decisions are wired up as placeholders — they will become fully functional in future versions.

---

## ☁️ Deployment Note

TennisRecap is designed for one-click deployment to **[Vercel](https://vercel.com/)** directly from the GitHub repository. Since it uses standard Next.js with no custom server, deploying requires no additional configuration.

---

## 💚 Project Philosophy

| Principle | Meaning |
|-----------|---------|
| **Mobile-first** | Designed for phone screens first; max-width 448px container |
| **Thai UI** | All labels, buttons, and content in Thai; Sarabun font throughout |
| **Family-centered** | The Family Plan Room gives every family member a voice |
| **Supportive, not guilt-based** | The tone is warm and constructive — no shaming, no pressure |
| **Athlete privacy respected** | Private Notes have visibility controls; the athlete decides what to share |

---

## 🗺️ Next Milestones (Planned)

These are the natural next steps as the project grows beyond MVP:

1. **Deploy to Vercel** — make the MVP publicly accessible at tennisrecap.com
2. **Local editable mock state** — let users modify data in-session without a backend (React state, localStorage, or Zustand)
3. **Add Supabase** — introduce a real database, auth, and row-level security with Supabase
4. **Real family collaboration** — shared family rooms, real-time reactions, and notification system

---

## 📄 License

ISC — see [package.json](package.json).

---

Built with ❤️ for Thai junior tennis.