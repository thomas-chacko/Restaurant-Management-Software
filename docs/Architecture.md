# Restaurant Management System - Architecture

Complete system architecture and database design for a single-restaurant management system.

---

## System Overview

Full-stack restaurant management with multi-role access (Admin, Manager, Waiter, Kitchen, Delivery), real-time order tracking, billing, delivery management, inventory, and reporting.

**Core Principles:**
- Server validates everything (never trust client)
- Money stored as integer paise (no float precision errors)
- Real-time updates via Socket.IO
- Type-safe with TypeScript throughout
- Audit trail for money-sensitive actions

---

## Technology Stack

### Backend (`apps/server`)
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x
- **Database ORM**: Drizzle ORM
- **Validation**: Zod 3.x
- **Real-time**: Socket.IO 4.x
- **Authentication**: JWT + argon2id
- **Database**: PostgreSQL 15+ (Neon in production)
- **Cache/Queue**: Redis 7.x (future)

### Frontend Web (`apps/client`)
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19+
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Data Fetching**: React Query (TanStack Query)
- **Real-time**: Socket.IO client
- **State**: Zustand

### Frontend PWA (`apps/waiter-pwa`)
- **Build Tool**: Vite 5.x
- **UI Library**: React 19+
- **PWA**: vite-plugin-pwa
- **Offline Support**: Service Worker
- **Others**: Same as web app

---

## Database Design

### Schema Overview

```
users ─────┐
           │
           ├──▶ orders ◀────── tables
           │      │
           │      ├──▶ order_items ──▶ menu_items ◀── categories
           │      │
           │      └──▶ delivery_assignments
           │             │
           │             └──▶ cash_handovers
           │
           ├──▶ stock_movements ──▶ menu_items
           │
           └──▶ audit_logs
```

---

### Core Tables

#### **1. users**
User accounts for all roles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique user ID |
| email | varchar(255) | UNIQUE, NOT NULL | Login email |
| password_hash | varchar(255) | NOT NULL | Argon2id hash |
| name | varchar(255) | NOT NULL | Full name |
| role | varchar(20) | NOT NULL | admin, manager, waiter, kitchen, delivery |
| phone | varchar(20) | | Contact number |
| is_active | boolean | DEFAULT true | Account enabled |
| created_at | timestamp | DEFAULT now() | |
| updated_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;
```

**Why:** Store all staff accounts. `is_active` allows soft delete. Email is unique for login.

---

#### **2. sessions**
Active user sessions (optional - can use stateless JWT only).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Session ID |
| user_id | uuid | FK users(id) | User reference |
| token | varchar(500) | NOT NULL | JWT or session token |
| expires_at | timestamp | NOT NULL | Session expiry |
| created_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

**Why:** Track active sessions, enable logout from all devices.

---

#### **3. tables**
Restaurant tables for dine-in orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Table ID |
| table_number | varchar(20) | UNIQUE, NOT NULL | Display name (T-01, T-02) |
| capacity | integer | NOT NULL | Max guests |
| status | varchar(20) | DEFAULT 'available' | available, occupied, reserved |
| created_at | timestamp | DEFAULT now() | |
| updated_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_tables_number ON tables(table_number);
CREATE INDEX idx_tables_status ON tables(status);
```

**Why:** Track table availability for dine-in. Status updated when order created/completed.

---

#### **4. categories**
Menu categories (Starters, Main Course, Desserts, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Category ID |
| name | varchar(100) | UNIQUE, NOT NULL | Category name |
| display_order | integer | DEFAULT 0 | Sort order in menu |
| is_active | boolean | DEFAULT true | Show in menu |
| created_at | timestamp | DEFAULT now() | |
| updated_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_categories_active ON categories(display_order) WHERE is_active = true;
```

**Why:** Organize menu items. `display_order` controls menu display sequence.

---

#### **5. menu_items**
All menu items with pricing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Item ID |
| category_id | uuid | FK categories(id) | Category reference |
| name | varchar(255) | NOT NULL | Item name |
| description | text | | Item description |
| price | integer | NOT NULL | Price in paise |
| image_url | varchar(500) | | Cloudinary URL |
| is_available | boolean | DEFAULT true | Currently available |
| is_veg | boolean | DEFAULT true | Vegetarian flag |
| created_at | timestamp | DEFAULT now() | |
| updated_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_menu_available ON menu_items(is_available);
```

**Why:** Store menu with category grouping. Price in paise (no decimals = no rounding errors). `is_available` lets kitchen mark items out of stock.

---

#### **6. orders**
Core order table for dine-in and delivery.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Order ID |
| order_number | serial | UNIQUE, NOT NULL | Human-readable (1001, 1002...) |
| type | varchar(20) | NOT NULL | dine-in, delivery, takeaway |
| status | varchar(20) | NOT NULL | pending, cooking, ready, served, etc. |
| table_id | uuid | FK tables(id) | For dine-in only |
| customer_name | varchar(255) | | For delivery/takeaway |
| customer_phone | varchar(20) | | For delivery/takeaway |
| customer_address | text | | For delivery only |
| subtotal | integer | NOT NULL | Items total (paise) |
| discount | integer | DEFAULT 0 | Discount amount (paise) |
| discount_reason | text | | Why discount applied |
| tax | integer | NOT NULL | GST amount (paise) |
| total | integer | NOT NULL | Final amount (paise) |
| payment_method | varchar(20) | | cash, card, upi, online |
| payment_status | varchar(20) | | pending, paid, failed |
| notes | text | | Special instructions |
| version | integer | DEFAULT 1 | Optimistic locking |
| created_by | uuid | FK users(id), NOT NULL | Waiter who created |
| created_at | timestamp | DEFAULT now() | Order time |
| updated_at | timestamp | DEFAULT now() | |
| completed_at | timestamp | | When status → completed |

**Indexes:**
```sql
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_table ON orders(table_id) WHERE table_id IS NOT NULL;
CREATE INDEX idx_orders_type_status ON orders(type, status);
```

**Why:**
- `order_number` is human-readable, auto-incrementing.
- `version` prevents race conditions (optimistic locking).
- Money fields are integers (paise) as per AGENTS.md.
- `status` follows state machine (see business-rules.md).
- `discount_reason` required for audit trail.

**Order Status Flow:**
```
pending → cooking → ready → served → completed
              ↓              ↓
          cancelled      assigned → out_for_delivery → delivered → completed
                                        ↓
                                    cancelled
```

---

#### **7. order_items**
Items within each order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Line item ID |
| order_id | uuid | FK orders(id) CASCADE | Parent order |
| menu_item_id | uuid | FK menu_items(id) | Menu item reference |
| menu_item_name | varchar(255) | NOT NULL | Item name at order time |
| quantity | integer | NOT NULL | Count ordered |
| unit_price | integer | NOT NULL | Price per unit (paise) |
| total_price | integer | NOT NULL | quantity × unit_price (paise) |
| notes | text | | Special requests (no onions) |
| created_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu ON order_items(menu_item_id);
```

**Why:**
- Store `menu_item_name` and `unit_price` at order time (prices may change later).
- CASCADE delete: When order deleted, items are too.
- `total_price` = `quantity * unit_price` (pre-calculated for reporting).

---

#### **8. delivery_assignments**
Assign riders to delivery orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Assignment ID |
| order_id | uuid | FK orders(id) | Delivery order |
| delivery_user_id | uuid | FK users(id) | Rider assigned |
| assigned_by | uuid | FK users(id) | Manager who assigned |
| assigned_at | timestamp | DEFAULT now() | Assignment time |
| picked_up_at | timestamp | | When rider picked up |
| delivered_at | timestamp | | When delivered |
| is_active | boolean | DEFAULT true | Current assignment |
| created_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_delivery_order ON delivery_assignments(order_id);
CREATE INDEX idx_delivery_user ON delivery_assignments(delivery_user_id, is_active);
```

**Why:**
- One order can have multiple assignments (if re-assigned).
- `is_active = true` marks current assignment.
- Track timestamps for delivery time reports.

---

#### **9. cash_handovers**
Riders hand over collected cash to managers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Handover ID |
| delivery_user_id | uuid | FK users(id), NOT NULL | Rider |
| manager_id | uuid | FK users(id), NOT NULL | Manager receiving |
| amount | integer | NOT NULL | Total cash (paise) |
| order_ids | jsonb | NOT NULL | Array of order UUIDs |
| verified | boolean | DEFAULT false | Manager verified |
| notes | text | | Discrepancy notes |
| created_at | timestamp | DEFAULT now() | Handover time |

**Indexes:**
```sql
CREATE INDEX idx_cash_handover_user ON cash_handovers(delivery_user_id);
CREATE INDEX idx_cash_handover_manager ON cash_handovers(manager_id);
CREATE INDEX idx_cash_handover_date ON cash_handovers(created_at DESC);
```

**Why:**
- Record all cash collected by riders.
- `order_ids` jsonb stores list of order UUIDs.
- `verified` flag prevents duplicate handovers.
- Audit trail for cash reconciliation.

---

#### **10. stock_movements**
Track all inventory changes (never overwrite stock levels).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Movement ID |
| menu_item_id | uuid | FK menu_items(id) | Item affected |
| type | varchar(20) | NOT NULL | purchase, consumption, waste, adjustment |
| quantity | integer | NOT NULL | +positive / -negative |
| reason | text | | Why this movement |
| reference_id | uuid | | order_id if consumption |
| created_by | uuid | FK users(id) | User who recorded |
| created_at | timestamp | DEFAULT now() | |

**Indexes:**
```sql
CREATE INDEX idx_stock_item ON stock_movements(menu_item_id);
CREATE INDEX idx_stock_type ON stock_movements(type);
CREATE INDEX idx_stock_created ON stock_movements(created_at DESC);
```

**Why:**
- **Never overwrite stock** - all changes are movements.
- Current stock = SUM(quantity) for that menu_item_id.
- Types: `purchase` (+), `consumption` (-), `waste` (-), `adjustment` (±).
- `reference_id` links to order when type = consumption.

**Stock Calculation:**
```sql
SELECT 
  menu_item_id,
  SUM(quantity) as current_stock
FROM stock_movements
GROUP BY menu_item_id;
```

---

#### **11. audit_logs**
Track all money-sensitive and permission-sensitive actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Log ID |
| user_id | uuid | FK users(id) | Who performed action |
| action | varchar(50) | NOT NULL | discount_applied, order_voided, etc. |
| resource_type | varchar(50) | | order, user, stock |
| resource_id | uuid | | ID of affected resource |
| metadata | jsonb | | Action details |
| ip_address | varchar(50) | | User's IP |
| created_at | timestamp | DEFAULT now() | When it happened |

**Indexes:**
```sql
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
```

**Why:**
- Log every sensitive action (discounts, voids, refunds, staff changes).
- `metadata` jsonb stores action-specific details.
- Required for compliance and dispute resolution.
- Admin-only access.

**Example metadata:**
```json
{
  "discount_amount": 10000,
  "discount_reason": "Birthday offer",
  "original_total": 59000,
  "new_total": 49000
}
```

---

### Relationships Summary

```
users (1) ─────< (M) orders
users (1) ─────< (M) sessions
users (1) ─────< (M) delivery_assignments
users (1) ─────< (M) cash_handovers (as delivery_user)
users (1) ─────< (M) cash_handovers (as manager)
users (1) ─────< (M) stock_movements
users (1) ─────< (M) audit_logs

tables (1) ─────< (M) orders

categories (1) ─────< (M) menu_items

orders (1) ─────< (M) order_items
orders (1) ─────< (M) delivery_assignments

menu_items (1) ─────< (M) order_items
menu_items (1) ─────< (M) stock_movements
```

**Notation:**
- (1) = One
- (M) = Many
- `─────<` = One-to-Many relationship

---

## Why These Design Decisions?

### 1. **Money as Integer Paise**
**Problem:** Decimal arithmetic has precision errors.
```
0.1 + 0.2 = 0.30000000000000004  ❌
```
**Solution:** Store ₹1 as 100 paise (integer).
```
100 paise + 200 paise = 300 paise (₹3.00)  ✅
```

### 2. **order_number vs id**
- `id` = UUID (unique, not sequential, hard to remember)
- `order_number` = SERIAL (1001, 1002... human-readable)
- Use `order_number` for display, `id` for database joins.

### 3. **version Column (Optimistic Locking)**
**Problem:** Two users update same order simultaneously → data loss.
**Solution:**
```sql
UPDATE orders 
SET status = 'completed', version = version + 1
WHERE id = $1 AND version = $2;
-- If version changed, update fails (conflict detected)
```

### 4. **Stock as Movements (Not Levels)**
**Problem:** Overwriting stock loses history.
```sql
UPDATE menu_items SET stock = 50;  -- Lost: Why it changed
```
**Solution:** Record every change.
```sql
INSERT INTO stock_movements VALUES 
  ('purchase', +100, 'Weekly restock'),
  ('consumption', -5, 'Order #1001'),
  ('waste', -3, 'Expired');
-- Current stock = SUM(quantity) = 92
```

### 5. **Soft Delete (is_active)**
Never hard delete users or important data. Mark `is_active = false`.
**Why:** Preserve audit trail, enable "undo", foreign keys stay valid.

### 6. **JSONB for Flexible Data**
- `order_ids` in cash_handovers
- `metadata` in audit_logs
**Why:** Store arrays/objects without extra tables. Query with PostgreSQL jsonb operators.

### 7. **Timestamps Everywhere**
Every table has `created_at`, important tables have `updated_at`.
**Why:** Track when data was created/modified for debugging and reporting.

---

## Migration Strategy

### What Are Migrations?

Migrations are **version-controlled database schema changes**.

**Without migrations:**
```sql
-- Developer 1 runs manually
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Developer 2 doesn't know → different schema → bugs
```

**With migrations:**
```typescript
// migration_001_add_phone_to_users.ts
export async function up(db) {
  await db.schema.alterTable('users')
    .addColumn('phone', 'varchar(20)')
    .execute();
}

export async function down(db) {
  await db.schema.alterTable('users')
    .dropColumn('phone')
    .execute();
}
```

### Migration Workflow

1. **Generate migration:**
```bash
npm run db:generate -- --name add_phone_to_users
```

2. **Review generated SQL:**
```sql
-- migration_001.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

3. **Apply migration:**
```bash
npm run db:migrate
```

4. **Database tracks applied migrations:**
```
migrations_table:
┌────┬──────────────────────────────┬────────────────────┐
│ id │ name                         │ applied_at         │
├────┼──────────────────────────────┼────────────────────┤
│ 1  │ 001_create_users             │ 2024-11-18 10:00   │
│ 2  │ 002_create_orders            │ 2024-11-18 10:05   │
│ 3  │ 003_add_phone_to_users       │ 2024-11-18 11:00   │
└────┴──────────────────────────────┴────────────────────┘
```

### Migration Best Practices

✅ **DO:**
- Create new migration for every schema change
- Test migration on dev database first
- Include both `up` (apply) and `down` (rollback)
- Commit migrations to Git

❌ **DON'T:**
- Edit applied migrations (create new one instead)
- Run manual ALTER TABLE on production
- Skip migrations in development

---

## API Architecture

### Layered Structure

```
┌─────────────────────────────────────┐
│          Routes Layer               │  Thin HTTP controllers
│  - Validate request (Zod)          │  - Check auth/permissions
│  - Call service                     │  - Return response
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services Layer              │  Business logic
│  - OrderService                     │  - State machine
│  - BillingService                   │  - Calculations
│  - DeliveryService                  │  - Emit Socket events
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Data Layer (Drizzle)          │  Database queries
│  - CRUD operations                  │  - Transactions
│  - Joins, filters                   │  - Optimistic locking
└─────────────────────────────────────┘
```

### Route Example

```typescript
// apps/server/src/routes/orders.routes.ts
router.post('/orders', 
  authenticate,                    // Check JWT
  authorize(['waiter', 'manager']), // Check role
  validate(createOrderSchema),     // Validate body
  async (req, res) => {
    const order = await OrderService.create(req.body, req.user);
    res.status(201).json(order);
  }
);
```

### Service Example

```typescript
// apps/server/src/services/order.service.ts
class OrderService {
  async create(data: CreateOrderDto, user: User) {
    return await db.transaction(async (tx) => {
      // 1. Validate items exist and are available
      // 2. Calculate prices from menu (don't trust client)
      // 3. Apply discount (if authorized)
      // 4. Calculate tax (18% GST)
      // 5. Insert order and order_items
      // 6. Update table status (if dine-in)
      // 7. Create stock movements (consumption)
      // 8. Emit Socket.IO event
      // 9. Return order
    });
  }
}
```

---

## Real-Time Architecture

### Socket.IO Rooms

| Room | Members | Events |
|------|---------|--------|
| `kitchen` | Kitchen staff | `order:created`, `order:updated` |
| `manager` | Managers | All events |
| `delivery:{userId}` | Specific rider | `order:assigned` |
| `table:{tableId}` | Waiters for table | Table's order updates |

### Event Flow

```
1. API updates order in database
2. Database transaction commits
3. Service emits Socket.IO event
4. All clients in relevant rooms receive event
5. Clients invalidate React Query cache
6. UI auto-updates
```

**Server:**
```typescript
// After database commit
io.to('kitchen').emit('order:created', order);
io.to(`table:${order.tableId}`).emit('order:updated', order);
```

**Client:**
```typescript
socket.on('order:created', (order) => {
  queryClient.invalidateQueries(['orders']);
  toast.success(`New order ${order.orderNumber}`);
});
```

---

## Security Checklist

✅ **Authentication:**
- Passwords hashed with argon2id
- JWT in httpOnly cookies (not localStorage)
- Session timeout (24 hours)

✅ **Authorization:**
- Every route checks role
- Data scoped by role (delivery sees only their orders)
- Permission map enforced server-side

✅ **Input Validation:**
- All inputs validated with Zod
- SQL injection: Use Drizzle ORM only
- XSS: Sanitize user input

✅ **Money Operations:**
- All prices recalculated on server
- Discount requires audit log entry
- Optimistic locking prevents race conditions

✅ **Secrets:**
- Environment variables for secrets
- Never commit .env files
- Production secrets in hosting platform

---

## Deployment

### Development
```
Local:
- PostgreSQL: Docker (localhost:5432)
- Server: http://localhost:3001
- Client: http://localhost:3000
- PWA: http://localhost:5173
```

### Production (Recommended)
```
- Frontend: Vercel (Next.js auto-deploy)
- Backend: Railway / Render (Node.js + WebSocket)
- Database: Neon (serverless PostgreSQL)
- Images: Cloudinary
- Redis: Upstash (future)
```

---

## Next Steps

1. **Create database schema** using Drizzle
2. **Generate initial migrations**
3. **Implement authentication** (JWT + argon2id)
4. **Build order service** (state machine)
5. **Add Socket.IO** for real-time updates
6. **Implement billing** with discount logic
7. **Add delivery** assignment and cash handover
8. **Build reports** with aggregations
9. **Add audit logging** for sensitive actions
10. **Deploy to production**

---

**Last Updated:** 2024-11-18
