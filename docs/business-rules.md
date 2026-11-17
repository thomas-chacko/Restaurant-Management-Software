# Business Rules

This document defines the business logic, workflows, and constraints for the restaurant management system.

---

## Table of Contents

1. [Roles and Permissions](#roles-and-permissions)
2. [Order Flow](#order-flow)
3. [Order States](#order-states)
4. [Money and Pricing](#money-and-pricing)
5. [Delivery Management](#delivery-management)
6. [Payment and Billing](#payment-and-billing)
7. [Stock Management](#stock-management)
8. [Audit and Compliance](#audit-and-compliance)

---

## Roles and Permissions

### Role Hierarchy

The system supports five distinct roles, each with specific permissions:

1. **Admin** - Full system access
2. **Manager** - Order management, billing, delivery assignment, reports
3. **Waiter** - Order taking and table service
4. **Kitchen** - Food preparation and order tracking
5. **Delivery** - Order delivery and cash collection

### Authentication

- All users authenticate with email and password
- Backend issues JWT tokens containing the user's role
- Every API request validates the JWT and checks role permissions
- Frontend role checks are for UX only; backend always enforces permissions

### Permission Map

| Action | Admin | Manager | Waiter | Kitchen | Delivery |
|--------|-------|---------|--------|---------|----------|
| Create orders | ✓ | ✓ | ✓ | ✗ | ✗ |
| View all orders | ✓ | ✓ | ✗ | ✓ | ✗ |
| View own orders | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update order status | ✓ | ✓ | ✗ | ✓ | ✓ |
| Assign delivery rider | ✓ | ✓ | ✗ | ✗ | ✗ |
| Close bill / take payment | ✓ | ✓ | ✗ | ✗ | ✗ |
| Apply discounts | ✓ | ✓ | ✗ | ✗ | ✗ |
| Void/refund orders | ✓ | ✓ | ✗ | ✗ | ✗ |
| Hand in cash | ✓ | ✓ | ✗ | ✗ | ✓ |
| Manage staff | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage menu | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage tables | ✓ | ✓ | ✗ | ✗ | ✗ |
| View reports | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage stock | ✓ | ✓ | ✗ | ✗ | ✗ |

**Data scoping:**
- Delivery users may only read orders assigned to them
- Waiters see only their own orders (unless order is unassigned)
- Kitchen sees all active orders
- Managers and admins see all orders

---

## Order Flow

### Order Types

1. **Dine-in** - Customer eats at a table, waiter serves
2. **Delivery** - Customer receives food at their address
3. **Takeaway** - Customer picks up from counter (future, not yet defined)

### Dine-in Flow

```
Waiter → Kitchen → Waiter → Manager → Stock update
```

1. **Waiter: Take order**
   - Select table and add menu items
   - Order is created in `pending` state
   - Kitchen sees the order immediately

2. **Kitchen: Cook food**
   - View live queue of pending orders
   - Mark items as cooking, then mark order as `ready`
   - Notification sent to waiter/staff

3. **Waiter: Serve table**
   - Dine-in orders only
   - Mark order as `served`

4. **Manager: Close bill**
   - Select payment method (cash, card, UPI, etc.)
   - Apply discounts if needed
   - Take payment and mark order as `completed`

5. **System: Update stock**
   - Stock movements recorded after order completion

### Delivery Flow

```
Waiter → Kitchen → Manager → Delivery → Manager → Stock update
```

1. **Waiter: Take order**
   - Capture customer address and phone number
   - Order is created in `pending` state

2. **Kitchen: Cook food**
   - Same as dine-in

3. **Manager: Assign rider**
   - Delivery orders only
   - Select available delivery person
   - Order moves to `assigned` state

4. **Delivery: Deliver order**
   - View assigned orders in rider app
   - Mark order as `out_for_delivery`
   - Collect cash (if COD)
   - Mark order as `delivered`

5. **Delivery: Hand in cash**
   - Submit collected cash to manager
   - Manager verifies and records cash handover

6. **Manager: Close bill**
   - Mark order as `completed`

7. **System: Update stock**
   - Stock movements recorded

---

## Order States

Orders follow a strict state machine. Invalid transitions are rejected by the backend.

### States

| State | Description | Who can set |
|-------|-------------|-------------|
| `pending` | Order placed, waiting for kitchen | Waiter, Manager |
| `cooking` | Food is being prepared | Kitchen |
| `ready` | Food ready for service or pickup | Kitchen |
| `served` | Food served to table (dine-in only) | Waiter, Manager |
| `assigned` | Rider assigned (delivery only) | Manager |
| `out_for_delivery` | Order out for delivery | Delivery |
| `delivered` | Order delivered to customer | Delivery |
| `completed` | Payment received, order closed | Manager |
| `cancelled` | Order cancelled before completion | Manager, Admin |
| `voided` | Order voided after billing | Admin |

### Allowed Transitions

#### Dine-in
- `pending` → `cooking`
- `cooking` → `ready`
- `ready` → `served`
- `served` → `completed`
- `pending` → `cancelled`
- `cooking` → `cancelled`

#### Delivery
- `pending` → `cooking`
- `cooking` → `ready`
- `ready` → `assigned`
- `assigned` → `out_for_delivery`
- `out_for_delivery` → `delivered`
- `delivered` → `completed`
- `pending` → `cancelled`
- `cooking` → `cancelled`
- `assigned` → `cancelled`

#### Special transitions
- `completed` → `voided` (admin only, requires reason)

### Optimistic Locking

- Orders include a `version` column
- Every update must provide the current version
- If version mismatch occurs, request fails with 409 Conflict
- Client must refetch and retry

### Real-time Updates

- Socket.IO emits order state changes to relevant rooms
- Events emitted only **after** database transaction commits
- Rooms: `kitchen`, `manager`, `delivery:{userId}`, `table:{tableId}`

---

## Money and Pricing

### Money Storage

**All money is stored as integer paise (1 rupee = 100 paise).**

- Never use floating-point for money
- Display: divide by 100 and format with 2 decimals
- Input: multiply by 100 before storing

**Examples:**
- ₹150.00 → store as `15000`
- ₹99.50 → store as `9950`

### Price Calculation

1. **Item total** = `price × quantity`
2. **Subtotal** = sum of all item totals
3. **Discount** = calculate discount in paise
4. **Tax** = `(subtotal - discount) × tax_rate / 100`
5. **Grand total** = `subtotal - discount + tax`

### Rounding Rules

- Round tax to nearest paisa (standard rounding: 0.5 rounds up)
- Round final total to nearest paisa
- Document all rounding in this file when implemented

### Server-side Validation

- Never trust prices sent by the client
- Backend recalculates all prices from menu and applies tax
- Backend validates and applies discounts based on user role
- Client receives calculated totals only for display

---

## Delivery Management

### Rider Assignment

- Only managers can assign riders
- Rider must not have more than `N` active deliveries (define `N` later)
- Assignment recorded in `order_assignments` table
- Old assignment is marked inactive if order is reassigned

### Cash Collection

- Delivery users collect cash for COD orders
- Cash amount must match order total
- Delivery user hands in cash to manager at end of shift
- Manager verifies and records in `cash_handovers` table

### Delivery Constraints

- Delivery users can only view and update orders assigned to them
- API enforces: `WHERE assigned_to = :userId`
- Test this for every delivery endpoint

---

## Payment and Billing

### Payment Methods

Supported methods:
- `cash`
- `card`
- `upi`
- `online` (prepaid)

### Billing Workflow

1. Manager selects order
2. System displays calculated total (cannot be edited)
3. Manager selects payment method
4. Manager optionally applies discount (with reason)
5. System recalculates and shows final amount
6. Manager confirms payment
7. Order marked as `completed`

### Discounts

- Only managers and admins can apply discounts
- Discount types: percentage or fixed amount
- Discount must include a reason (e.g., "loyal customer", "staff meal")
- Logged to `audit_logs`

### Refunds and Voids

- **Void**: Cancel an order after billing (admin only)
- **Refund**: Return money to customer (admin only)
- Both require a reason
- Both logged to `audit_logs`

### Idempotency

- Payment and order-creation endpoints accept an `idempotency_key`
- Duplicate requests with the same key return the original result
- Keys expire after 24 hours

---

## Stock Management

### Stock Movements

Stock is **never** updated by overwriting quantities. All changes are recorded as movements.

**Movement types:**
- `purchase` - Stock added (supplier purchase)
- `consumption` - Stock used (order fulfilled)
- `waste` - Stock discarded
- `adjustment` - Manual correction (requires reason)

**Schema:**
```
stock_movements (
  id, item_id, type, quantity, reason, created_by, created_at
)
```

**Current stock** is calculated:
```sql
SELECT SUM(quantity) FROM stock_movements WHERE item_id = ?
```

Positive quantity = stock added  
Negative quantity = stock removed

### Stock Deduction

- Stock is deducted when order is marked `completed`
- If stock goes negative, system logs a warning but allows the order
- Admin/manager reviews negative stock in reports

### Low Stock Alerts

- Each menu item has an optional `min_stock_level`
- System alerts admin/manager when stock falls below this level
- Alerts shown in dashboard and/or sent via notification

---

## Audit and Compliance

### Audit Log

All sensitive actions are logged to `audit_logs` table:

**Logged actions:**
- Discounts applied
- Orders voided or refunded
- Cash handovers
- Staff created, updated, or deleted
- Menu price changes
- Stock adjustments
- Role changes

**Audit log schema:**
```
audit_logs (
  id, action, resource_type, resource_id, user_id, 
  metadata (JSON), created_at
)
```

### Data Retention

- Keep personal data only as long as needed for business operations
- Do not add new personal fields (email, phone, address) without approval
- Customer phone and address must never appear in logs

### Security

- Passwords hashed with **argon2id** (never bcrypt or plain)
- Never log passwords, tokens, card data, or customer PII
- All API requests validated with Zod schemas
- Use parameterized queries only (via Drizzle ORM)

---

## Open Questions

Items that need clarification before implementation:

1. **Takeaway flow**: Does takeaway have a separate workflow? Is payment taken at order creation or pickup?
2. **Tax setup**: GST rate? CGST + SGST split? Is tax included or added on top?
3. **Customer notifications**: SMS or WhatsApp for order updates?
4. **Max active deliveries**: How many orders can one rider carry at once?
5. **Stock alerts**: Email, push notification, or dashboard only?
6. **Multi-location**: Does this restaurant have multiple branches, or just one?
7. **Table management**: Can tables be combined? Reserved? What's the table lifecycle?
8. **Order editing**: Can a waiter edit an order after submission? What if kitchen has started cooking?
9. **Partial payments**: Can a customer pay partially now and partially later?
10. **Tips**: Are tips tracked separately from the bill?

---

## References

- Order state machine: Implement in server utilities (see Order States section above)
- Role permission map: See Permission Map table above
- Architecture: `docs/Architecture.md`

---

**Last updated:** 2024-11-17
