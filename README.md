# DevLingo — English for Software Engineers (Krashen $i + 1$ Input Engine)

Production-ready, modular web application for acquiring software engineering English through Stephen Krashen's Comprehensible Input hypothesis and situational developer immersion.

Built with **Angular 19+ (Signals, Standalone Components, Control Flow)**, **Tailwind CSS**, and **Supabase (Auth & Postgres Upsert Sync)**, optimized for zero-config **Vercel** deployment.

---

## 🏛️ Pedagogical & Architectural Foundation

### 1. Krashen Comprehensible Input ($i + 1$)
- **Zero Abstract Grammar Drills**: Learners acquire syntax and morphology through meaningful professional context.
- **Low Affective Filter**: Cognitive anchors (C#, .NET, Angular, SQL, Git, Cloud) eliminate fear of failure; technical comprehension acts as a bridge.
- **Tap-to-Translate (LingQ-inspired)**: Click any highlighted phrase to reveal Spanish translation, audio pronunciation, and actual industry usage context.
- **Dual-Speed Web Speech API**: Calibrate listening skills at `1.0x` (real-world natural) or `0.75x` (phonetic articulation).

### 2. SOLID & Clean Architecture in Angular
- **Single Responsibility (SRP)**:
  - `SpeechService`: Solely orchestrates browser SpeechSynthesis.
  - `AuthService`: Encapsulates Supabase Auth tokens & sessions.
  - `ProgressService`: Offline-first caching, local state calculations, and upsert synchronization.
- **Open/Closed (OCP)**:
  - `ChallengeRunnerComponent` consumes challenge types (`multiple_choice`, `fill_blank`, `decision_tree`) via dynamic polymorphism without modifying the runner.
- **Dependency Inversion (DIP)**:
  - Components depend on injectable reactive service abstractions using Angular's functional `inject()`.

---

## 📁 Project Directory Tree

```
Ingles-IA/
├── .env.example                      # Supabase environment variables template
├── angular.json                      # Angular CLI application builder configuration
├── package.json                      # Modern dependencies & scripts
├── postcss.config.js                 # PostCSS Tailwind integration
├── tailwind.config.js                # Custom dev dark theme & fonts
├── tsconfig.json                     # Strict TypeScript compiler options
├── tsconfig.app.json                 # Application TS configuration
├── vercel.json                       # Vercel SPA rewrite & build configuration
├── supabase/
│   └── schema.sql                    # Postgres user_progress table, RLS & triggers
└── src/
    ├── index.html                    # Root HTML with Google Fonts
    ├── main.ts                       # Angular bootstrap
    ├── styles.css                    # Tailwind directives & dark theme rules
    ├── lib/
    │   └── supabase.ts               # Supabase client singleton & DB contracts
    ├── data/
    │   └── courses.ts                # A1 to C2 authentic developer curriculum
    └── app/
        ├── app.component.ts          # Root orchestrator component
        ├── app.config.ts             # Application routing & zone coalescing
        ├── core/
        │   ├── models/
        │   │   ├── course.model.ts   # Missions, Dialogues, Tokens, Challenges
        │   │   └── user.model.ts     # User progress & vocabulary deck types
        │   └── services/
        │       ├── auth.service.ts   # Supabase Auth (Magic Link & Password)
        │       ├── progress.service.ts # Offline-first & cloud upsert engine
        │       └── speech.service.ts # Web Speech API with 1.0x/0.75x speed
        ├── features/
        │   ├── auth/
        │   │   └── auth-modal/       # Supabase sync modal
        │   ├── dashboard/            # Level roadmap & mission cards (A1-C2)
        │   └── learning/
        │       ├── audio-player/     # Play/pause with audio wave & speed toggle
        │       ├── challenge-runner/ # Multiple choice, Fill-in-blank, Decision tree
        │       ├── mission-view/     # Immersion feed + Tap-to-translate
        │       └── vocab-bank/       # Saved developer vocabulary deck
        └── shared/
            └── components/
                └── navbar/           # Top XP/Streak bar & Mobile bottom navigation
```

---

## 🚀 Step-by-Step Setup & Local Development

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **NPM**: v9+ or v10+

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
```

### 4. Setup Database Schema in Supabase
Open your [Supabase Dashboard](https://app.supabase.com) -> **SQL Editor**, and run the SQL script located at:
`supabase/schema.sql`

This creates:
- `public.user_progress` table with Row Level Security (RLS).
- Automatic profile trigger upon signup.
- Upsert policies allowing users to sync local progress.

### 5. Run Local Development Server
```bash
npm run dev
# or
npm start
```
Open your browser at `http://localhost:4200`.

---

## 🌐 Production Deployment on Vercel

### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
During the prompt:
- Link to your Vercel account.
- Add Environment Variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Option B: Via GitHub & Vercel Dashboard
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for DevLingo comprehensible input platform"
   git remote add origin https://github.com/your-username/devlingo.git
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new):
   - Import your GitHub repository.
   - Framework Preset: **Angular**.
   - Build Command: `npm run build`
   - Output Directory: `dist/devlingo/browser`
   - In **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Click **Deploy**. The `vercel.json` ensures all SPA client routes cleanly route to `/index.html`.
