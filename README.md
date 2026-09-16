# ⚔️ EMBERWAKE

> **"From the dying cinders, a sovereign will rises."**
> 
> A Soulslike Life RPG & Habit Tracking system crafted in Next.js 16, Three.js WebGL, and NextAuth. Habits become Sacred Oaths; consistency fuels the Bonfire; failure drains your Ember Flasks.

---

## ✨ Features

- 🔥 **Interactive 3D Bonfire Hero (WebGL)**: Real-time 3D campfire scene rendered with Three.js, particle flame embers, coiled blade, dynamic point lights, and 7 rotating celestial runes.
- 🛡️ **Multi-Layered Security & Auth**: Full NextAuth v5 authentication supporting Google OAuth and encrypted Credentials, backed by Prisma ORM and unbreakable server-side route guards.
- ⚡ **Guest Mode & Clean Slate**: Zero fake or hardcoded dummy stats. New Ashen Souls begin fresh with a 3-Pillars interactive Codex and persistent progress tracking.
- 📜 **The 3 Pillars of Habit Tracking**:
  - **Vigils**: Daily non-negotiable rituals that maintain the Bonfire streak.
  - **Oaths**: Flexible weekly disciplines that forge core attributes (*Vigor, Mind, Endurance, Strength, Dexterity*).
  - **Bounties**: High-reward one-time trials that bestow massive Runes.
- 🏺 **Interactive 3D Chambers**:
  - **The Camp**: Real-time habit tracking, quest forging, and 3D mini-bonfire state.
  - **Chronicle**: Complete milestone logs, attribute progression, and wallet breakdown (*Runes Held vs Lifetime XP*).
  - **Merchant of the Cinders**: Interactive 3D relic inspector with rotate and zoom controls.
  - **Hall of Relics**: 3D display chamber for unlocked legendary artifacts.
  - **Moments**: Cinematic trial triggers and triumph celebrations.
- 🕯️ **Soulslike Atmosphere**: Molten glassmorphism, animated torch flame tabs on navigation hover, dynamic audio-visual feedback, and dark-fantasy typography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **3D & Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://github.com/pmndrs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), Custom GLSL Shaders
- **Authentication**: [Auth.js / NextAuth v5](https://authjs.dev/) (Credentials + Google OAuth)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: Vanilla CSS, Tailwind CSS, Lucide Icons

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/pg9801763195-ai/Emberwake.git
cd Emberwake
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set up your environment variables:
```env
# Database (PostgreSQL - Neon, Supabase, or Local)
DATABASE_URL="postgresql://user:password@localhost:5432/emberwake"
DIRECT_URL="postgresql://user:password@localhost:5432/emberwake"

# NextAuth v5
AUTH_SECRET="your-generated-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to awaken at The Gate.

---

## ☁️ Deployment (Vercel)

Emberwake is optimized for instant 1-click deployment on Vercel:

1. Push this repository to your GitHub account.
2. Import the repository into **[Vercel](https://vercel.com/)**.
3. Add `AUTH_SECRET` and `NEXTAUTH_URL` under **Project Settings ➔ Environment Variables**.
4. Click **Deploy**.

---

## 📜 License

Distributed under the MIT License.
