# Xynvora AI – Company Platform

> Building Intelligent AI Solutions for Modern Businesses

## Tech Stack

| Layer          | Technology                         |
|----------------|------------------------------------|
| Framework      | Next.js 14 (App Router)            |
| Styling        | Tailwind CSS + Framer Motion       |
| 3D / WebGL     | React Three Fiber + Three.js       |
| Language       | TypeScript                         |
| Database       | PostgreSQL (via Prisma)            |
| Auth           | JWT                                |
| Cloud          | AWS (EC2 / S3 / CloudFront)        |
| Storage        | AWS S3                             |
| CRM            | HubSpot                            |
| Meetings       | Calendly                           |
| Deployment     | Vercel / AWS EC2                   |

## Folder Structure

```
xynvora-ai/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home
│   ├── layout.tsx              # Root layout (Navbar + Footer)
│   ├── about/page.tsx
│   ├── leadership/page.tsx
│   ├── team/page.tsx
│   ├── services/page.tsx
│   ├── portfolio/page.tsx
│   ├── solutions/page.tsx
│   ├── research/page.tsx
│   ├── roadmap/page.tsx
│   ├── gallery/page.tsx
│   ├── testimonials/page.tsx
│   ├── careers/page.tsx
│   ├── contact/page.tsx
│   └── admin/
│       └── dashboard/page.tsx  # Admin panel
│
├── components/
│   ├── ui/                     # Reusable primitives
│   │   ├── Card3D.tsx          # 3D tilt card
│   │   ├── GlowOrb.tsx         # Ambient glow effect
│   │   ├── SectionTitle.tsx    # Consistent section headings
│   │   └── Badge.tsx           # Colored tag/pill
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky top nav
│   │   └── Footer.tsx          # Site footer
│   └── sections/               # Full-page section components
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── LeadershipSection.tsx
│       ├── TeamSection.tsx
│       ├── ServicesSection.tsx
│       ├── PortfolioSection.tsx
│       ├── SolutionsSection.tsx
│       ├── ResearchSection.tsx
│       ├── RoadmapSection.tsx
│       ├── GallerySection.tsx
│       ├── TestimonialsSection.tsx
│       ├── CareersSection.tsx
│       └── ContactSection.tsx
│
├── data/
│   └── index.ts                # All static content (stats, team, portfolio…)
│
├── hooks/
│   └── useCard3D.ts            # Mouse-tracking 3D tilt hook
│
├── lib/
│   └── utils.ts                # cn(), hexToRgba()
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── styles/
│   └── globals.css             # Tailwind base + custom animations
│
├── public/
│   ├── images/                 # Static images
│   └── icons/                  # Favicon, PWA icons
│
├── .env.example                # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Database Schema (PostgreSQL)

```sql
-- Users / Auth
users          (id, name, email, password_hash, role, created_at)

-- Content tables
team_members   (id, name, position, image_url, bio, linkedin, skills)
leadership     (id, name, position, image_url, message, responsibilities)
projects       (id, title, client, description, image_url, tech[], result, demo_url)
testimonials   (id, client_name, company, review, rating, image_url)
gallery        (id, title, image_url, category, date)
research       (id, title, pdf_url, description, author, category, date)
roadmap        (id, quarter, task, status, sort_order)
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in values
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

Navigate to `/admin/dashboard`.

- **CEO** – Full control: projects, team, research, all content
- **CFO** – Operations: testimonials, gallery, roadmap, clients

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or build Docker image for AWS EC2
docker build -t xynvora-ai .
docker run -p 3000:3000 xynvora-ai
```

---

© 2026 Xynvora AI · hello@xynvora.ai
