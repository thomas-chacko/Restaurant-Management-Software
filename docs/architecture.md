# Architecture

This document describes the technical architecture, design decisions, and system structure of the restaurant management software.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Database Design](#database-design)
8. [Real-time Communication](#real-time-communication)
9. [Authentication & Authorization](#authentication--authorization)
10. [API Design](#api-design)
11. [State Management](#state-management)
12. [File Upload & Storage](#file-upload--storage)
13. [Deployment Architecture](#deployment-architecture)
14. [Security Considerations](#security-considerations)
15. [Performance & Scalability](#performance--scalability)
16. [Development Workflow](#development-workflow)

---

## System Overview

A full-stack restaurant management system for a single restaurant, supporting multiple user roles and real-time order tracking.

### Key Features

- **Multi-role access**: Admin, Manager, Waiter, Kitchen, Delivery
- **Order management**: Dine-in and delivery workflows
- **Real-time updates**: Live kitchen queue, order status changes
- **Billing & payments**: Multiple payment methods, discounts, refunds
- **Delivery tracking**: Rider assignment, cash collection, handover
- **Inventory management**: Stock movements, low-stock alerts
- **Reporting**: Sales, staff performance, inventory reports
- **Audit logging**: Track sensitive actions for compliance

### Design Principles

1. **Separation of concerns**: Business logic in services, not routes
2. **Single source of truth**: Database is authoritative, frontend is view
3. **Security by default**: Server validates everything, never trust client
4. **Real-time first**: Socket.IO for instant updates across devices
5. **Type safety**: TypeScript everywhere, shared types between frontend/backend
6. **Optimistic locking**: Version column prevents race conditions
7. **Audit everything**: Log money-sensitive and permission-sensitive actions

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├──────────────────┬──────────────────┬──────────────────────────┤
│  Web App         │  Waiter PWA      │  Future: Mobile App      │
│  (Next.js)       │  (Vite + React)  │                          │
│  - Admin         │  - Order taking  │                          │
│  - Manager       │  - Table mgmt    │                          │
│  - Kitchen       │  - Offline ready │                          │
│  - Delivery      │                  │                          │
└────────┬─────────┴────────┬─────────┴──────────────────────────┘
         │                  │
         │ HTTPS + WS       │ HTTPS + WS
         │                  │
┌────────▼──────────────────▼────────────────────────────────────┐
│                      API Gateway / Load Balancer               │
└────────┬───────────────────────────────────────────────────────┘
         │
┌────────▼───────────────────────────────────────────────────────┐
│                     Backend (Node.js + Express)                │
├────────────────────────────────────────────────────────────────┤
│  Routes          │  Middleware       │  Services               │
│  - /auth         │  - Authentication │  - OrderService         │
│  - /orders       │  - Authorization  │  - BillingService       │
│  - /menu         │  - Validation     │  - DeliveryService      │
│  - /delivery     │  - Error handler  │  - StockService         │
│  - /staff        │  - Logger         │  - AuditService         │
│  - /reports      │                   │                         │
├────────────────────────────────────────────────────────────────┤
│  Real-time (Socket.IO)                                         │
│  - Rooms: kitchen, manager, delivery:{id}, table:{id}          │
│  - Events: order:created, order:updated, stock:low             │
└────────┬───────────────────────────────┬───────────────────────┘
         │                               │
         │ PostgreSQL                    │ Redis (future)
         │                               │ - Socket.IO adapter
┌────────▼───────────────────┐          │ - Job queues
│     Database (Neon)        │          │ - Rate limiting
│  - Users, Roles            │          │
│  - Orders, Order Items     │    ┌─────▼──────┐
│  - Menu, Categories        │    │   Redis    │
│  - Tables                  │    │  (Future)  │
│  - Delivery assignments    │    └────────────┘
│  - Stock movements         │
│  - Audit logs              │
│  - Cash handovers          │
└────────────────────────────┘
         │
         │ (Future: Read replicas)
         │
┌────────▼───────────────────┐
│    Cloudinary              │
│  - Menu item images        │
│  - Signed uploads only     │
└────────────────────────────┘
```

---

## Technology Stack

### Monorepo

- **pnpm workspaces**: Package manager and workspace management
- **Turborepo**: Build orchestration, caching, and task running
- **TypeScript**: Type safety across the entire stack

### Backend (`apps/server`)

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 20+ LTS |
| Express | HTTP framework | 4.x |
| TypeScript | Language | 5.x |
| Drizzle ORM | Database ORM | Latest |
| Zod | Schema validation | 3.x |
| Socket.IO | Real-time communication | 4.x |
| argon2 | Password hashing | Latest |
| jsonwebtoken | JWT auth | 9.x |
| PostgreSQL | Database | 15+ |
| Redis | Caching & queues (future) | 7.x |

### Frontend - Web (`apps/client`)

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework (App Router) | 14+ |
| React | UI library | 18+ |
| TypeScript | Language | 5.x |
| Tailwind CSS | Styling | 3.x |
| Shadcn/ui | UI components | Latest |
| React Query | Data fetching & caching | 5.x |
| Socket.IO client | Real-time updates | 4.x |
| Zustand | Client state management | 4.x |

### Frontend - Waiter PWA (`apps/waiter-pwa`)

| Technology | Purpose | Version |
|------------|---------|---------|
| Vite | Build tool | 5.x |
| React | UI library | 18+ |
| TypeScript | Language | 5.x |
| Tailwind CSS | Styling | 3.x |
| vite-plugin-pwa | PWA support | Latest |
| React Query | Data fetching | 5.x |
| Socket.IO client | Real-time updates | 4.x |

### Shared (`packages/shared`)

- TypeScript types
- Zod schemas
- Business logic (order state machine, roles)
- Utilities (money conversion, date formatting)

---

## Project Structure

```
Restaurant-Management-Software/
├── apps/
│   ├── server/              # Backend API
│   ├── client/              # Web frontend
│   └── waiter-pwa/          # Waiter PWA
├── packages/
│   └── shared/              # Shared code
├── docs/                    # Documentation
├── pnpm-workspace.yaml      # Workspace config
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
```

See [business-rules.md](./business-rules.md) for detailed folder rules.

---

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│          Routes Layer               │  HTTP endpoints, thin controllers
│  - Request validation (Zod)        │
│  - Auth/permission checks           │
│  - Delegate to services             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services Layer              │  Business logic
│  - OrderService                     │
│  - BillingService                   │
│  - DeliveryService                  │
│  - StockService                     │
│  - AuditService                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Data Access Layer             │  Database queries
│  - Drizzle ORM queries              │
│  - Transaction management           │
│  - Schema definitions               │
└─────────────────────────────────────┘
```

### Route Structure

Routes are **thin controllers** that:
1. Validate request (Zod schema)
2. Check authentication and permissions
3. Call service method
4. Return response

```typescript
// apps/server/src/routes/orders.routes.ts
router.post('/orders', 
  authenticate,
  authorize(['waiter', 'manager']),
  validate(createOrderSchema),
  async (req, res) => {
    const order = await OrderService.create(req.body, req.user);
    res.json(order);
  }
);
```

### Service Layer

Services contain **all business logic**:
- Validation beyond schema (e.g., stock availability)
- State transitions (via order state machine)
- Complex calculations (billing, discounts, tax)
- Cross-entity operations
- Emit Socket.IO events

```typescript
// apps/server/src/services/order.service.ts
class OrderService {
  async create(data: CreateOrderDto, user: User): Promise<Order> {
    // 1. Validate business rules
    // 2. Calculate prices from menu
    // 3. Insert into database
    // 4. Emit Socket.IO event
    // 5. Return order
  }
  
  async updateStatus(orderId: string, newStatus: OrderStatus, user: User) {
    // 1. Check permission
    // 2. Validate state transition
    // 3. Update with optimistic locking
    // 4. Emit event
    // 5. If completed, deduct stock
  }
}
```

### Database Layer

Uses **Drizzle ORM**:
- Type-safe queries
- Automatic migrations
- Parameterized queries (SQL injection safe)
- Transaction support

```typescript
// apps/server/src/db/schema.ts
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: serial('order_number'),
  type: varchar('type', { enum: ['dine-in', 'delivery'] }),
  status: varchar('status', { enum: orderStatuses }),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').default(0),
  tax: integer('tax').notNull(),
  total: integer('total').notNull(),
  version: integer('version').default(1),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## Frontend Architecture

### Next.js App Router Structure

```
apps/client/src/app/
├── (auth)/
│   ├── login/
│   └── layout.tsx
├── admin/
│   ├── dashboard/
│   ├── staff/
│   ├── menu/
│   └── reports/
├── manager/
│   ├── orders/
│   ├── delivery/
│   └── billing/
├── kitchen/
│   └── queue/
├── delivery/
│   └── orders/
└── layout.tsx
```

### Data Fetching Strategy

- **Server components**: Initial data load (fast first paint)
- **React Query**: Client-side fetching, caching, optimistic updates
- **Socket.IO**: Real-time updates (invalidate React Query cache)

```typescript
// Server Component (initial load)
async function OrdersPage() {
  const orders = await fetchOrders(); // Server-side fetch
  return <OrderList initialData={orders} />;
}

// Client Component (real-time updates)
'use client';
function OrderList({ initialData }) {
  const { data } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    initialData,
  });
  
  useSocket('order:updated', () => {
    queryClient.invalidateQueries(['orders']);
  });
  
  return <div>{/* render orders */}</div>;
}
```

### State Management

- **React Query**: Server state (orders, menu, users)
- **Zustand**: Client state (UI state, filters, modals)
- **React Context**: Auth context (current user, permissions)

```typescript
// Zustand store
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
}));
```

### Component Structure

```
components/
├── ui/                  # Shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── dialog.tsx
├── orders/              # Feature components
│   ├── OrderCard.tsx
│   ├── OrderList.tsx
│   └── OrderStatusBadge.tsx
├── layout/              # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── NavMenu.tsx
└── shared/              # Shared components
    ├── DataTable.tsx
    └── ConfirmDialog.tsx
```

---

## Database Design

### Core Tables

#### Users & Auth
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL, -- admin, manager, waiter, kitchen, delivery
  phone VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)
```

#### Orders
```sql
orders (
  id UUID PRIMARY KEY,
  order_number SERIAL,
  type VARCHAR NOT NULL, -- dine-in, delivery
  status VARCHAR NOT NULL, -- pending, cooking, ready, served, completed, etc.
  table_id UUID REFERENCES tables(id),
  customer_name VARCHAR,
  customer_phone VARCHAR,
  customer_address TEXT,
  subtotal INTEGER NOT NULL, -- in paise
  discount INTEGER DEFAULT 0,
  discount_reason TEXT,
  tax INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method VARCHAR, -- cash, card, upi, online
  payment_status VARCHAR,
  notes TEXT,
  version INTEGER DEFAULT 1, -- optimistic locking
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP
)

order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- price at time of order
  total_price INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP
)
```

#### Menu
```sql
categories (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
)

menu_items (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name VARCHAR NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in paise
  image_url VARCHAR,
  is_available BOOLEAN DEFAULT true,
  min_stock_level INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Delivery
```sql
delivery_assignments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  delivery_user_id UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
)

cash_handovers (
  id UUID PRIMARY KEY,
  delivery_user_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL, -- in paise
  orders JSONB, -- array of order IDs
  verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP
)
```

#### Inventory
```sql
stock_movements (
  id UUID PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id),
  type VARCHAR NOT NULL, -- purchase, consumption, waste, adjustment
  quantity INTEGER NOT NULL, -- positive = add, negative = remove
  reason TEXT,
  reference_id UUID, -- order_id if consumption
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
)
```

#### Audit
```sql
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR NOT NULL, -- discount_applied, order_voided, staff_created, etc.
  resource_type VARCHAR, -- order, user, stock, etc.
  resource_id UUID,
  metadata JSONB, -- action-specific data
  ip_address VARCHAR,
  created_at TIMESTAMP
)
```

#### Tables
```sql
tables (
  id UUID PRIMARY KEY,
  table_number VARCHAR UNIQUE NOT NULL,
  capacity INTEGER,
  status VARCHAR DEFAULT 'available', -- available, occupied, reserved
  created_at TIMESTAMP
)
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_delivery_assignments_user ON delivery_assignments(delivery_user_id, is_active);
CREATE INDEX idx_stock_movements_item ON stock_movements(menu_item_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## Real-time Communication

### Socket.IO Rooms

| Room | Members | Events |
|------|---------|--------|
| `kitchen` | Kitchen staff | `order:created`, `order:cancelled` |
| `manager` | Managers, admins | All order events |
| `delivery:{userId}` | Specific delivery user | `order:assigned`, `order:updated` |
| `table:{tableId}` | Waiters for that table | `order:updated` for that table |

### Event Flow

```typescript
// Server emits after database commit
async function updateOrderStatus(orderId, newStatus) {
  const order = await db.transaction(async (tx) => {
    // 1. Update order
    const updated = await tx.update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId))
      .returning();
    return updated[0];
  });
  
  // 2. Emit to relevant rooms (after commit!)
  io.to('kitchen').emit('order:updated', order);
  io.to('manager').emit('order:updated', order);
  if (order.tableId) {
    io.to(`table:${order.tableId}`).emit('order:updated', order);
  }
}
```

### Client Handling

```typescript
// Client invalidates cache on socket event
socket.on('order:updated', (order) => {
  queryClient.invalidateQueries(['orders']);
  queryClient.invalidateQueries(['orders', order.id]);
  
  // Optional: Optimistic update
  queryClient.setQueryData(['orders', order.id], order);
});
```

---

## Authentication & Authorization

### Authentication Flow

```
1. User submits email + password
2. Server validates credentials
3. Server generates JWT with { userId, role }
4. Client stores JWT in httpOnly cookie (secure)
5. Client includes JWT in Authorization header for all requests
6. Server validates JWT and extracts user info
```

### JWT Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "manager",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization Middleware

```typescript
// apps/server/src/middleware/auth.middleware.ts
export function authorize(allowedRoles: Role[]) {
  return (req, res, next) => {
    const user = req.user; // Set by authenticate middleware
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage
router.get('/reports', 
  authenticate, 
  authorize(['admin', 'manager']), 
  getReports
);
```

### Permission Checks

Use the permission map from `packages/shared/roles.ts`:

```typescript
import { hasPermission } from '@repo/shared';

if (!hasPermission(user.role, 'apply_discount')) {
  throw new ForbiddenError();
}
```

---

## API Design

### REST Conventions

- **GET** - Read data (no side effects)
- **POST** - Create resources
- **PATCH** - Partial update
- **PUT** - Full update (rarely used)
- **DELETE** - Delete resources

### Endpoint Structure

```
/api/v1/auth
  POST   /login
  POST   /logout
  GET    /me

/api/v1/orders
  GET    /           # List orders (filtered by role)
  POST   /           # Create order
  GET    /:id        # Get order details
  PATCH  /:id        # Update order (status, etc.)
  POST   /:id/cancel # Cancel order
  
/api/v1/menu
  GET    /           # List menu items
  POST   /           # Create menu item (admin/manager)
  PATCH  /:id        # Update menu item
  DELETE /:id        # Delete menu item

/api/v1/delivery
  GET    /assignments      # Get delivery assignments
  POST   /assignments      # Assign rider to order
  POST   /cash-handover    # Record cash handover
```

### Request/Response Format

**Request:**
```json
POST /api/v1/orders
{
  "type": "dine-in",
  "tableId": "uuid",
  "items": [
    { "menuItemId": "uuid", "quantity": 2, "notes": "No onions" }
  ],
  "notes": "Extra plates"
}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "orderNumber": 42,
  "type": "dine-in",
  "status": "pending",
  "tableId": "uuid",
  "items": [...],
  "subtotal": 50000,
  "tax": 9000,
  "total": 59000,
  "createdAt": "2024-11-17T10:30:00Z"
}
```

**Response (Error):**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "items", "message": "At least one item required" }
  ]
}
```

### Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad request (validation error)
- **401** - Unauthorized (not logged in)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found
- **409** - Conflict (optimistic locking failure)
- **500** - Server error

---

## State Management

### Order State Machine

Defined in `packages/shared/order-state.ts`:

```typescript
export const orderStateMachine = {
  pending: ['cooking', 'cancelled'],
  cooking: ['ready', 'cancelled'],
  ready: ['served', 'assigned'], // served=dine-in, assigned=delivery
  served: ['completed'],
  assigned: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: ['completed'],
  completed: ['voided'], // admin only
  cancelled: [],
  voided: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return orderStateMachine[from]?.includes(to) ?? false;
}
```

**Backend enforcement:**
```typescript
if (!canTransition(order.status, newStatus)) {
  throw new BadRequestError(
    `Cannot transition from ${order.status} to ${newStatus}`
  );
}
```

---

## File Upload & Storage

### Cloudinary Integration

- **Menu item images** uploaded to Cloudinary
- **Signed uploads**: Backend generates signed URL, frontend uploads directly
- **Transformations**: Automatic resizing, format conversion

```typescript
// Backend: Generate signed upload URL
router.post('/menu/upload-url', authenticate, authorize(['admin', 'manager']), 
  async (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'menu' },
      process.env.CLOUDINARY_API_SECRET
    );
    
    res.json({
      url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      timestamp,
      signature,
      cloudName,
      folder: 'menu',
    });
  }
);

// Frontend: Upload to Cloudinary
const uploadToCloudinary = async (file: File) => {
  const { url, timestamp, signature, cloudName, folder } = 
    await api.get('/menu/upload-url');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('api_key', cloudName);
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.secure_url;
};
```

---

## Deployment Architecture

### Development

```
Local machine:
├── PostgreSQL (Docker)
├── Redis (Docker, optional)
├── apps/server → http://localhost:3001
├── apps/client → http://localhost:3000
└── apps/waiter-pwa → http://localhost:5173
```

### Production (Future)

```
                  ┌─────────────┐
                  │  Cloudflare │
                  │     CDN     │
                  └──────┬──────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
   ┌─────▼─────┐                  ┌──────▼──────┐
   │  Vercel   │                  │   Railway   │
   │  (Client) │                  │   (Server)  │
   └───────────┘                  └──────┬──────┘
                                         │
                           ┌─────────────┴──────────────┐
                           │                            │
                     ┌─────▼──────┐            ┌────────▼────────┐
                     │    Neon    │            │   Upstash Redis │
                     │ PostgreSQL │            │    (optional)   │
                     └────────────┘            └─────────────────┘
```

**Services:**
- **Frontend**: Vercel (Next.js, automatic deployments)
- **PWA**: Vercel or Netlify (static build + service worker)
- **Backend**: Railway, Render, or Fly.io (Node.js, WebSocket support)
- **Database**: Neon (serverless PostgreSQL)
- **Redis**: Upstash (serverless Redis)
- **Images**: Cloudinary
- **Monitoring**: Sentry (errors), Vercel Analytics

---

## Security Considerations

### Input Validation

- All inputs validated with **Zod schemas**
- Server-side validation is authoritative
- Sanitize user input for XSS prevention

### SQL Injection Prevention

- Use **Drizzle ORM** exclusively (parameterized queries)
- Never build SQL strings from user input

### Authentication Security

- Passwords hashed with **argon2id** (not bcrypt)
- JWT stored in **httpOnly cookies** (not localStorage)
- CSRF protection via SameSite cookie attribute
- Rate limiting on login endpoint (future: Redis)

### Authorization

- Every route checks role and permissions on server
- Data scoped by role (delivery users see only their orders)
- Sensitive actions logged to audit_logs

### HTTPS & CORS

- HTTPS enforced in production
- CORS configured to allow only trusted origins
- Socket.IO CORS restricted to frontend domains

### Secrets Management

- Environment variables for secrets
- Never commit `.env` files
- Production secrets in hosting platform (Vercel env vars, Railway secrets)

### Content Security Policy (Future)

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' https://res.cloudinary.com;
```

---

## Performance & Scalability

### Database Optimization

- **Indexes** on frequently queried columns (status, created_at, user_id)
- **Connection pooling** via Drizzle
- **Read replicas** for reports (future)
- **Pagination** for large lists

### Caching Strategy

- **React Query**: Client-side caching (5-minute stale time)
- **Redis**: Server-side caching for menu, reports (future)
- **CDN**: Static assets cached at edge (Cloudflare)

### Real-time Optimization

- **Socket.IO rooms**: Users join only relevant rooms
- **Redis adapter**: Scale Socket.IO across multiple servers (future)
- **Event debouncing**: Batch rapid updates on client

### Code Splitting

- Next.js automatic code splitting
- Dynamic imports for heavy components
- Route-based splitting for admin/manager/kitchen/delivery

### Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Database query time**: Log slow queries (>100ms)
- **API response time**: Monitor p95, p99 latencies

---

## Development Workflow

### Branch Strategy

```
main            # Production-ready code
├── develop     # Integration branch
└── feature/*   # Feature branches
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]

jobs:
  test:
    - Install dependencies (pnpm install)
    - Type check (pnpm typecheck)
    - Lint (pnpm lint)
    - Test (pnpm test)
    - Build (pnpm build)
  
  deploy:
    - On push to main → Deploy to production
    - On push to develop → Deploy to staging
```

### Local Development

```bash
# Start all apps
pnpm dev

# Or individual apps
pnpm dev --filter=server
pnpm dev --filter=client
pnpm dev --filter=waiter-pwa

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Database Migrations

```bash
# Generate migration
pnpm --filter=server db:generate

# Apply migration
pnpm --filter=server db:migrate

# Seed database (development)
pnpm --filter=server db:seed
```

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Core order flow (dine-in, delivery)
- ✅ User roles and authentication
- ✅ Real-time updates
- ✅ Basic billing

### Phase 2
- Multiple payment methods (card, UPI via Razorpay)
- Advanced reporting (sales by day, staff performance)
- Stock alerts and low-stock notifications

### Phase 3
- Table reservations
- Customer loyalty program
- SMS/WhatsApp notifications (via Twilio)

### Phase 4
- Multi-location support (franchises)
- Kitchen display system (KDS) hardware integration
- Printer integration (kitchen tickets, bills)

### Phase 5
- Mobile apps (React Native)
- QR code ordering (customers scan and order)
- Online ordering (website integration)

### Phase 6
- Analytics dashboard (trends, predictions)
- Inventory purchase orders
- Supplier management

### Phase 7
- AI assistant (read-only sales and stock questions)
- Voice ordering
- Recipe and prep instructions

---

## References

- [Business Rules](./business-rules.md) - Business logic and workflows
- [API Documentation](./api.md) - Detailed API reference (to be created)
- [Deployment Guide](./deployment.md) - Deployment instructions (to be created)
- [Decisions](./decisions/) - Architecture Decision Records (to be created)

---

**Last updated:** 2024-11-17
