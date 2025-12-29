# Admin Panel Features - Radhe Stationery

## Complete Admin Dashboard

The admin panel now includes comprehensive management tools for running the e-commerce store.

### 1. **User Management** (`/admin/users`)
- View all registered users
- Search users by name or email
- Change user roles (user → admin)
- Delete user accounts
- Pagination support

### 2. **Delivery Management** (`/admin/delivery`)
- Track all shipments
- Filter by delivery status:
  - Pending
  - Picked Up
  - In Transit
  - Out for Delivery
  - Delivered
  - Failed
- Update delivery details:
  - Estimated delivery date
  - Actual delivery date
  - Current location
  - Tracking notes
- Automatic tracking number generation

### 3. **Invoice Management** (`/admin/invoices`)
- View all generated invoices
- Search invoices by number or order ID
- Professional invoice display with:
  - Invoice number (auto-generated: INV-YYYYMMDD-XXXX)
  - Customer details
  - Item breakdown
  - Subtotal, shipping, tax, total
  - Payment method and status
- Print-friendly invoice format
- Pagination support

### 4. **Store Settings** (`/admin/settings`)
Configure store-wide settings:
- **Store Information**
  - Store name
  - Support email
  - Support phone
- **Address**
  - Full address
  - City, state, pincode
- **Shipping & Payment**
  - Shipping cost (₹)
  - Free shipping threshold
  - Enable/disable Cash on Delivery (COD)

### 5. **Dashboard** (`/admin`)
Quick overview with:
- Total products count
- Total orders count
- Total revenue (sum of paid orders)
- Recent orders list (last 5)
- Quick links to all management sections

### 6. **Existing Features**
- **Products Management** - Create, edit, delete products
- **Orders Management** - View and update order status

## Automatic Features

### Invoice Generation
When a customer completes payment:
1. Invoice is automatically created
2. Invoice number is generated (INV-YYYYMMDD-XXXX)
3. Invoice includes all order details
4. Customer can view invoice in order confirmation

### Delivery Tracking
When payment is verified:
1. Delivery record is automatically created
2. Tracking number is generated
3. Estimated delivery date set (5 days from order)
4. Initial status: "Pending"
5. Admin can update status and location

### Stock Management
When order is paid:
1. Product stock is automatically reduced
2. Stock reflects in product listings
3. Out of stock products show status

## Database Models

### Invoice Model
```
- invoiceNumber (unique)
- orderId (reference)
- userId (reference)
- items (array)
- subtotal, shippingCost, tax, totalAmount
- shippingDetails
- paymentMethod, paymentStatus
- timestamps
```

### Delivery Model
```
- orderId (unique)
- trackingNumber (unique)
- carrier
- estimatedDeliveryDate
- actualDeliveryDate
- status (enum)
- location
- notes
- timestamps
```

### Settings Model
```
- storeName
- supportEmail, supportPhone
- address, city, state, pincode
- enableCOD (boolean)
- shippingCost, freeShippingAbove
- timestamps
```

## API Endpoints

### Users
- `GET /api/admin/users` - List users with search & pagination
- `PATCH /api/admin/users/[id]` - Update user role
- `DELETE /api/admin/users/[id]` - Delete user

### Delivery
- `GET /api/admin/delivery` - List deliveries with status filter
- `PATCH /api/admin/delivery/[id]` - Update delivery details

### Invoices
- `GET /api/admin/invoices` - List invoices with search
- `GET /api/admin/invoices/[id]` - Get invoice details

### Settings
- `GET /api/admin/settings` - Get store settings
- `PATCH /api/admin/settings` - Update store settings

## User Roles

### Admin
- Access to all admin features
- Can manage users, products, orders, deliveries, invoices, settings
- Can change other users to admin

### User
- Can browse products
- Can place orders
- Can view own orders and invoices
- Cannot access admin panel

## How to Use

### Create Admin User
1. Sign up normally at `/auth/signup`
2. Go to MongoDB Atlas
3. Find the user in `users` collection
4. Change `role` field from "user" to "admin"
5. Sign out and sign back in
6. Admin button will appear in header

### Access Admin Panel
1. Click "Admin" button in header (only visible if admin)
2. Or navigate to `/admin`
3. Dashboard shows overview
4. Use navigation to access different sections

### Manage Users
1. Go to `/admin/users`
2. Search for user by name/email
3. Click role dropdown to change role
4. Click Delete to remove user

### Track Deliveries
1. Go to `/admin/delivery`
2. Filter by status
3. Click "Update" to modify delivery details
4. Update dates, location, and notes
5. Changes save automatically

### View Invoices
1. Go to `/admin/invoices`
2. Search by invoice number or order ID
3. Click "View" to see full invoice
4. Click "Print Invoice" to print

### Configure Settings
1. Go to `/admin/settings`
2. Update store information
3. Configure shipping costs
4. Enable/disable COD
5. Click "Save Settings"

## Features Coming Soon

- Email notifications for orders
- SMS tracking updates
- Bulk order operations
- Advanced analytics
- Customer reviews management
- Discount/coupon management
- Inventory alerts
- Multi-warehouse support
