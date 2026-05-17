# Peblo Notes — AI-Powered Notes Workspace

> A full-stack, collaborative notes application with Gemini AI integration, public sharing, productivity analytics, and a beautiful Material Design 3 dark UI.

Built as a take-home challenge for **Peblo** — a seed-funded ed-tech startup backed by the Eleven Group.

---

## Live Demo

> _Deploy in progress — run locally using the setup instructions below._

---

## Screenshots

| Landing Page | Dashboard | Note Editor |
|---|---|---|
| ![Landing](./docs/screenshots/landing.png) | ![Dashboard](./docs/screenshots/dashboard.png) | ![Editor](./docs/screenshots/editor.png) |

| AI Panel | Public Share | Explore Feed |
|---|---|---|
| ![AI](./docs/screenshots/ai-panel.png) | ![Share](./docs/screenshots/shared-note.png) | ![Explore](./docs/screenshots/explore.png) |

---

## Features

### Core
- **Authentication** — Signup/login with bcrypt password hashing, NextAuth.js JWT sessions
- **Notes Workspace** — Create, edit, archive notes with 1-second auto-save debounce
- **Tags & Categories** — Flexible tagging system with sidebar filter and tag cloud
- **AI Integration** — Google Gemini 2.0 Flash generates summaries, action items, and suggested titles
- **Search & Filter** — Real-time debounced search by title/content + tag filtering
- **Public Sharing** — Toggle note visibility; generate a UUID share link accessible without login
- **Productivity Dashboard** — Weekly activity bar chart, AI usage count, top tags, recent notes

### Bonus Features Implemented
- ✅ Dark mode (Material Design 3 token system)
- ✅ Collapsible sidebar (localStorage persisted)
- ✅ Public Explore feed (`/explore`) — browse all shared notes
- ✅ Archived notes management (restore or permanently delete)
- ✅ Settings page with account stats
- ✅ Responsive layout (mobile + desktop)
- ✅ Combined AI panel (one click → all outputs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 with Material Design 3 custom `@theme` tokens |
| **Database** | MongoDB Atlas via Prisma ORM v5.22 |
| **Auth** | NextAuth.js v4 (Credentials Provider + bcryptjs) |
| **AI** | Google Generative AI SDK — `gemini-2.0-flash` model |
| **Icons** | Material Symbols (Google Fonts) + Lucide React |
| **Typography** | Inter + JetBrains Mono via `next/font/google` |

---

## Architecture

```
peblo-ai-notes/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Landing page
│   │   ├── login/page.tsx             # Auth — Sign In
│   │   ├── signup/page.tsx            # Auth — Sign Up
│   │   ├── dashboard/
│   │   │   ├── layout.tsx             # Protected layout with Sidebar
│   │   │   ├── page.tsx               # Productivity dashboard
│   │   │   ├── notes/page.tsx         # All notes (tag sidebar filter)
│   │   │   ├── notes/[id]/page.tsx    # Note editor page
│   │   │   ├── search/page.tsx        # Live search
│   │   │   ├── archived/page.tsx      # Archived notes
│   │   │   └── settings/page.tsx      # Account settings
│   │   ├── explore/
│   │   │   ├── layout.tsx             # Sidebar for logged-in, header for guests
│   │   │   └── page.tsx               # Public notes feed
│   │   ├── shared/[shareId]/page.tsx  # Public shared note view
│   │   └── api/
│   │       ├── auth/signup/route.ts   # POST /api/auth/signup
│   │       ├── auth/[...nextauth]/    # NextAuth handler
│   │       ├── notes/route.ts         # GET + POST /api/notes
│   │       ├── notes/[id]/route.ts    # PATCH + DELETE /api/notes/:id
│   │       ├── notes/[id]/share/      # PATCH /api/notes/:id/share
│   │       ├── notes/search/route.ts  # GET /api/notes/search
│   │       └── ai/route.ts            # POST /api/ai
│   ├── components/
│   │   ├── Sidebar.tsx                # Collapsible nav sidebar
│   │   ├── SidebarContext.tsx         # Collapse state context
│   │   ├── DashboardMain.tsx          # Margin-aware main content
│   │   ├── NoteEditor.tsx             # Full note editor + AI panel
│   │   └── CreateNoteCard.tsx         # Dashboard create CTA card
│   └── lib/
│       ├── prisma.ts                  # Prisma client singleton
│       ├── auth.ts                    # NextAuth config
│       ├── ai.ts                      # Gemini API helper functions
│       └── utils.ts                   # cn() class utility
├── prisma/
│   └── schema.prisma                  # DB schema
├── .env.example
└── README.md
```

---

## Database Schema

```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  email        String   @unique
  passwordHash String
  notes        Note[]
  tags         Tag[]
  activityLogs ActivityLog[]
}

model Note {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId
  title      String   @default("Untitled")
  content    String   @default("")
  category   String?
  isArchived Boolean  @default(false)
  tagNames   String[] @default([])
  isPublic   Boolean  @default(false)
  shareId    String?
  tags       Tag[]    @relation(fields: [tagIds], references: [id])
  aiLogs     AiLog[]
  user       User     @relation(...)
}

model AiLog {
  id             String   @id
  noteId         String
  summary        String?
  actionItems    String[]
  suggestedTitle String?
  tokensUsed     Int?
}
```

---

## API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register new user |
| `POST` | `/api/auth/[...nextauth]` | ❌ | NextAuth login/session |
| `GET` | `/api/notes` | ✅ | Get all notes for user |
| `POST` | `/api/notes` | ✅ | Create new note |
| `PATCH` | `/api/notes/:id` | ✅ | Update note (title, content, tags, archive) |
| `DELETE` | `/api/notes/:id` | ✅ | Permanently delete note |
| `PATCH` | `/api/notes/:id/share` | ✅ | Toggle public/private + generate shareId |
| `GET` | `/api/notes/search` | ✅ | Search notes by `q` and/or `tag` |
| `POST` | `/api/ai` | ✅ | Generate summary / action items / title |

---

## AI Workflow

```
User writes note content
        ↓
Clicks "Generate Everything" in AI panel
        ↓
POST /api/ai { action: "all", noteId, content }
        ↓
lib/ai.ts → Google Gemini 2.0 Flash
        ↓
Single prompt: returns JSON { summary, actionItems, suggestedTitle }
        ↓
Result saved to AiLog table (for dashboard AI usage count)
        ↓
UI updates: summary displayed, "Apply Title" button appears
```

**Prompt Engineering:**
The combined prompt instructs Gemini to return strict JSON with three fields. A try/catch fallback handles malformed responses gracefully.

---

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier works)
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/peblo-ai-notes.git
cd peblo-ai-notes
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/peblo_ai_notes"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 4. Push database schema
```bash
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the landing page.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | ✅ | Base URL of app (http://localhost:3000 locally) |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |

---

## Testing the Application

| Flow | Steps |
|---|---|
| **Auth** | Go to `/signup` → create account → auto-redirects to dashboard |
| **Create Note** | Click "+ New Note" in sidebar → type content → auto-saved |
| **Add Tags** | In note footer → type tag name → press Enter |
| **AI** | Write 2+ sentences → click "AI Assist" → "Generate Everything" |
| **Search** | Sidebar → Search → type keyword or tag name |
| **Share** | In note footer → click "Make Public" → copy link → open in incognito |
| **Dashboard** | Sidebar → Dashboard → see stats, chart, tag cloud |
| **Archive** | In editor header → Archive button → note moves to /dashboard/archived |
| **Explore** | Visit `/explore` (no login needed) — browse all public notes |

---

## Security

- Passwords hashed with `bcryptjs` (10 rounds)
- Sessions managed by NextAuth with secure, HTTP-only cookies
- All note API routes verify user ownership before read/write
- No secrets committed — all credentials via environment variables
- `.env` excluded from git via `.gitignore`

---

## What I'd Add Next

- **Markdown preview** toggle in the editor
- **Real-time collaboration** via WebSockets or Liveblocks
- **Email notifications** for shared note comments
- **Automated tests** (Playwright E2E + Vitest unit)
- **Rate limiting** on AI endpoints
- **Vercel deployment** with production MongoDB Atlas

---

_Built for the Peblo Full Stack Developer Challenge — May 2026_
