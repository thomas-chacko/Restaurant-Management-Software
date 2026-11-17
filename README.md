# Restaurant Management Software

A full-stack restaurant management system for handling orders, billing, delivery, kitchen operations, inventory, and staff management with real-time updates.

---

## 🎯 Overview

This system manages all aspects of restaurant operations for a single location:

- **Waiters** take orders and manage tables
- **Kitchen** tracks orders live and marks them ready
- **Managers** handle billing, assign delivery riders, and manage operations
- **Delivery staff** deliver orders and hand in cash
- **Admins** manage staff, menu, tables, tax, inventory, and reports

---

## 🏗️ Architecture

Simple multi-app structure:

```
apps/
├── server/       # Node.js + Express API (Backend)
├── client/       # Next.js web app (Admin, Manager, Kitchen, Delivery)
└── waiter-pwa/   # React PWA (Waiter app with offline support)
```

---

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Drizzle ORM** (PostgreSQL)
- **Zod** (Validation)
- **Socket.IO** (Real-time updates)
- **argon2** (Password hashing)
- **JWT** (Authentication)

### Frontend
- **Next.js 14+** (App Router) - Web app
- **Vite** + **React** - Waiter PWA
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui** (UI components)
- **React Query** (Data fetching)
- **Socket.IO client** (Real-time)

### Database & Storage
- **PostgreSQL** (Neon in production, Docker locally)
- **Cloudinary** (Image storage)
- **Redis** (Future: queues, Socket.IO adapter)

---

## 📋 Prerequisites

- **Node.js** 20+ LTS
- **npm** (comes with Node.js)
- **PostgreSQL** 15+ (or Docker)
- **Git**

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Restaurant-Management-Software
```

### 2. Install dependencies

```bash
# Install all apps at once
npm run install:all
```

### 3. Set up environment variables

```bash
# First time setup
npm run install:all

# Copy environment files
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
cp apps/waiter-pwa/.env.example apps/waiter-pwa/.env

# Edit with your values
nano apps/server/.env
```

**apps/server/.env**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/restaurant
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=development

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**apps/client/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**apps/waiter-pwa/.env**
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### 4. Set up the database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb restaurant

# Run migrations
cd apps/server && npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

**Option B: Docker**
```bash
# Start PostgreSQL in Docker
docker run -d \
  --name restaurant-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=restaurant \
  -p 5432:5432 \
  postgres:15

# Then run migrations
cd apps/server && npm run db:migrate
```

### 5. Start development servers

```bash
# Start all apps (one command!)
npm run dev
```

This starts:
- **Backend API**: http://localhost:3001
- **Web App**: http://localhost:3000
- **Waiter PWA**: http://localhost:5173

Or start individual apps:
```bash
npm run dev:server      # Backend only
npm run dev:client      # Web app only
npm run dev:pwa         # PWA only
```

---

## 📦 Available Commands

```bash
# Development
npm run install:all   # Install all dependencies
npm run dev           # Start all apps
npm run dev:server    # Start backend only
npm run dev:client    # Start web app only
npm run dev:pwa       # Start PWA only

# Build
npm run build         # Build all apps
npm run build:server
npm run build:client
npm run build:pwa

# Linting
npm run lint          # Lint all apps

# Testing
npm run test          # Test all apps

# Clean
npm run clean         # Remove build artifacts
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access, staff management, reports |
| **Manager** | Orders, billing, delivery assignment, reports |
| **Waiter** | Take orders, manage tables |
| **Kitchen** | View orders, mark ready |
| **Delivery** | View assigned orders, deliver, hand in cash |

---

## 🔄 Order Flow

### Dine-in
```
Waiter (take order) → Kitchen (cook) → Waiter (serve) → Manager (bill) → Completed
```

### Delivery
```
Waiter (take order) → Kitchen (cook) → Manager (assign rider) → 
Delivery (deliver) → Delivery (hand in cash) → Manager (close bill) → Completed
```

---

## 🔐 Security

- **Passwords**: Hashed with argon2id
- **Authentication**: JWT with httpOnly cookies
- **Authorization**: Every API route checks role permissions
- **Validation**: All inputs validated with Zod on server
- **SQL Injection**: Protected via Drizzle ORM parameterized queries
- **Audit Logging**: All sensitive actions logged

---

## 💰 Money Handling

**All money stored as integer paise (1 rupee = 100 paise)**

- ₹150.00 → stored as `15000`
- ₹99.50 → stored as `9950`

This prevents floating-point rounding errors in calculations.

---

## 📡 Real-time Updates

**Socket.IO** powers live updates:

- Kitchen sees new orders instantly
- Order status changes update all screens
- Delivery assignments notify riders
- Low stock alerts for managers

---

## 📁 Project Structure

```
Restaurant-Management-Software/
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/       # HTTP endpoints
│   │   │   ├── services/     # Business logic
│   │   │   ├── models/       # Drizzle schema & queries
│   │   │   ├── socket/       # Socket.IO setup
│   │   │   ├── middleware/   # Auth, validation
│   │   │   ├── types/        # TypeScript types
│   │   │   ├── schemas/      # Zod validation
│   │   │   ├── utils/        # Utilities
│   │   │   └── index.ts      # Entry point
│   │   └── package.json
│   │
│   ├── client/
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router
│   │   │   ├── components/   # React components
│   │   │   ├── lib/          # Utilities
│   │   │   ├── hooks/        # Custom hooks
│   │   │   └── types/        # TypeScript types (copied from server)
│   │   └── package.json
│   │
│   └── waiter-pwa/
│       ├── src/
│       │   ├── pages/        # PWA pages
│       │   ├── components/   # React components
│       │   ├── lib/          # Utilities
│       │   └── types/        # TypeScript types (copied from server)
│       └── package.json
│
├── docs/
│   ├── Architecture.md       # System architecture
│   └── business-rules.md     # Business logic & workflows
│
├── package.json              # Root scripts
├── .gitignore
├── README.md                 # This file
└── AGENTS.md                 # AI agent instructions
```

---

## 📚 Documentation

- **[Architecture](./docs/Architecture.md)** - System design and technical decisions
- **[Business Rules](./docs/business-rules.md)** - Workflows, roles, and constraints
- **[AGENTS.md](./AGENTS.md)** - Rules for AI assistants working on this project

---

## 🚢 Deployment

### Backend (Railway/Render/Fly.io)
```bash
# Build
cd apps/server && npm run build

# Start
npm start
```

### Frontend (Vercel)
```bash
# Vercel auto-detects Next.js
# Just connect your repo
```

### Environment Variables
Set these in your hosting platform:
- Database URL (Neon PostgreSQL)
- JWT secret
- Cloudinary credentials
- CORS origins

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
cd apps/server && npm test
cd apps/client && npm test
```

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes
3. Run checks: `npm run lint && npm run test`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

**Code Standards:**
- TypeScript strict mode
- ESLint + Prettier
- Test coverage for business logic
- Server-side validation for all inputs

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Or restart Docker container
docker restart restaurant-db
```

### npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm run install:all
```

### Build fails
```bash
# Clean and rebuild
npm run clean
npm run build
```

---

## 📈 Roadmap

- [ ] Phase 1: Core order flow (dine-in, delivery)
- [ ] Phase 2: Payment integrations (Razorpay)
- [ ] Phase 3: Advanced reporting and analytics
- [ ] Phase 4: Multi-location support
- [ ] Phase 5: Mobile apps (React Native)
- [ ] Phase 6: QR code ordering
- [ ] Phase 7: AI assistant for queries

---

## 📄 License

[Your License Here]

---

## 👨‍💻 Authors

[Your Name/Team]

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices for restaurant management.