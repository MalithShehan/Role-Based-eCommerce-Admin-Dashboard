# Role-Based eCommerce Admin Dashboard

A secure, role-based Admin Panel for a basic eCommerce backend using **Node.js**, **Express**, **AdminJS**, **Sequelize ORM**, and **PostgreSQL**. This project implements authentication, role-based access control, a custom dashboard, and a settings management page.

## Live Demo

**[https://role-based-ecommerce-admin-dashboard-fhim.onrender.com/admin](https://role-based-ecommerce-admin-dashboard-fhim.onrender.com/admin)**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin123` |
| User | `john@example.com` | `user123` |

> **Note:** The app is hosted on Render's free tier — the first request may take ~30 seconds if the server has spun down due to inactivity.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Backend server framework |
| PostgreSQL | Relational database |
| Sequelize ORM | Database modeling, migrations & queries |
| AdminJS | Auto-generated admin panel interface |
| bcryptjs | Secure password hashing |
| JSON Web Token (JWT) | API-level authentication |
| express-session | AdminJS session-based authentication |
| connect-session-sequelize | Persistent session storage in PostgreSQL |

---

## Project Structure

```
Role-Based-eCommerce-Admin-Dashboard/
├── package.json
├── .env                                # Environment variables
├── README.md
└── src/
    ├── app.js                          # Main entry point — Express + AdminJS setup
    ├── config/
    │   └── database.js                 # PostgreSQL connection configuration
    ├── middleware/
    │   └── auth.js                     # JWT authentication & role authorization middleware
    ├── models/
    │   ├── Index.js                    # Sequelize initialization & model relationships
    │   ├── User.js                     # User model (admin/user roles, bcrypt hooks)
    │   ├── Category.js                 # Product category model
    │   ├── Product.js                  # Product model (belongs to Category)
    │   ├── Order.js                    # Order model (belongs to User)
    │   ├── OrderItem.js                # Order line item (belongs to Order & Product)
    │   └── Setting.js                  # Key-value configuration model
    ├── routes/
    │   └── auth.js                     # POST /api/login — JWT login endpoint
    ├── admin/
    │   ├── auth.js                     # AdminJS authentication handler (bcrypt)
    │   ├── dashboard.js                # Custom dashboard data handler (role-based)
    │   ├── settings.js                 # Custom settings page handler (CRUD)
    │   ├── components/
    │   │   ├── dashboard.component.jsx # React — custom dashboard UI component
    │   │   └── settings.component.jsx  # React — custom settings UI component
    │   └── resources/                  # AdminJS resource configurations
    │       ├── user.resource.js        # Admin-only visibility & access
    │       ├── category.resource.js    # Role-based CRUD actions
    │       ├── product.resource.js     # Role-based CRUD actions
    │       ├── order.resource.js       # Role-based CRUD actions
    │       ├── orderItem.resource.js   # Role-based CRUD actions
    │       └── setting.resource.js     # Admin-only visibility & access
    └── seeders/
        └── seed.js                     # Database seeder with sample data
```

---

## Requirements & Implementation

### 1. Core Setup

| Requirement | Implementation |
|---|---|
| Node.js + Express backend | `src/app.js` — Express 4 server |
| Sequelize ORM with PostgreSQL | `src/config/database.js` — Sequelize 6 + pg driver |
| AdminJS integration | AdminJS v7 with `@adminjs/sequelize` adapter & `@adminjs/express` router |
| bcrypt for password hashing | `bcryptjs` — hooks in User model (`beforeCreate`, `beforeUpdate`) |
| JWT-based authentication | `jsonwebtoken` — `/api/login` endpoint returns signed JWT tokens |

### 2. Database Models

Six models with proper relationships:

```
User ──< Order ──< OrderItem >── Product >── Category
Setting (standalone key-value config table)
```

| Model | Table | Key Fields |
|---|---|---|
| **User** | `users` | id, name, email, password (hashed), role (`admin` / `user`) |
| **Category** | `categories` | id, name, description |
| **Product** | `products` | id, name, description, price, stock, categoryId → Category |
| **Order** | `orders` | id, userId → User, totalAmount, status (pending/processing/shipped/delivered/cancelled) |
| **OrderItem** | `order_items` | id, orderId → Order, productId → Product, quantity, price |
| **Setting** | `settings` | id, key (unique), value, description |

**Relationships** (defined in `src/models/Index.js`):
- `User.hasMany(Order)` / `Order.belongsTo(User)`
- `Category.hasMany(Product)` / `Product.belongsTo(Category)`
- `Order.hasMany(OrderItem)` / `OrderItem.belongsTo(Order)`
- `Product.hasMany(OrderItem)` / `OrderItem.belongsTo(Product)`

### 3. AdminJS Configuration

| Requirement | Implementation |
|---|---|
| All 6 models added to AdminJS | Registered in `src/app.js` via resource config files |
| Relationships configured | Foreign keys (`categoryId`, `userId`, `orderId`, `productId`) displayed as references |
| Password field hidden | `password: { isVisible: { list: false, show: false, edit: false, filter: false } }` in `user.resource.js` |
| Relational data displayed clearly | List/show/edit/filter properties customized per resource with proper field ordering |

### 4. Authentication

| Requirement | Implementation |
|---|---|
| `/api/login` endpoint | `POST /api/login` — validates email + password, returns JWT |
| Passwords stored securely | bcryptjs with salt rounds of 10, hashed on create & update |
| JWT for session handling | Token includes userId, email, role, name — expires in 24 hours |
| Only authenticated users access AdminJS | `buildAuthenticatedRouter` with session store — redirects to login page |

**Authentication flow:**
1. **AdminJS panel** → session-based auth via `express-session` + `connect-session-sequelize`
2. **API endpoint** → JWT-based auth via `Authorization: Bearer <token>` header

### 5. Role-Based Access Control

Uses `isAccessible` and `isVisible` in AdminJS resource options:

| Feature | Admin | Regular User |
|---|---|---|
| View Products, Categories, Orders, OrderItems | ✅ | ✅ |
| Create / Edit / Delete any entity | ✅ | ❌ |
| View Users table | ✅ | ❌ (hidden) |
| View Settings table | ✅ | ❌ (hidden) |
| Manage Users (add/edit/delete) | ✅ | ❌ |
| Manage Settings | ✅ | ❌ |
| Dashboard — full system summary | ✅ | — |
| Dashboard — personal order summary | — | ✅ |

**Implementation details:**
- `isVisible: isAdmin` — hides Users and Settings from non-admin sidebar
- `isAccessible: isAdmin` — blocks direct URL access to restricted actions
- All `new`, `edit`, `delete` actions require admin role across all resources

### 6. Dashboard & Settings Pages

**Custom Dashboard** (`src/admin/components/dashboard.component.jsx`):
- **Admin view**: 5 stat cards (Total Users, Products, Categories, Orders, Revenue), Orders by Status breakdown with color-coded badges, Recent Orders table with user info
- **User view**: 2 stat cards (My Orders, Total Spent), Recent personal Orders table
- Data fetched via custom handler in `src/admin/dashboard.js`

**Custom Settings Page** (`src/admin/components/settings.component.jsx`):
- Displays all key-value settings in a styled table
- Inline editing — click Edit, modify value, Save/Cancel
- Admin-only access — non-admin users see an empty state
- Data managed via handler in `src/admin/settings.js`

---

## Setup & Installation

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** installed and running

### 1. Clone the repository

```bash
git clone https://github.com/MalithShehan/Role-Based-eCommerce-Admin-Dashboard.git
cd Role-Based-eCommerce-Admin-Dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create or edit the `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_admin
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

PORT=3000
NODE_ENV=development
```

### 4. Create the PostgreSQL database

```sql
CREATE DATABASE ecommerce_admin;
```

### 5. Seed the database

```bash
npm run seed
```

This creates sample data including:
- **Admin accounts**: `admin@example.com` / `admin123`, `sarah@example.com` / `admin123`
- **User accounts**: `john@example.com` / `user123`, `jane@example.com` / `user123`, and 5 more
- 8 Categories, 41 Products, 18 Orders, 25 Order Items, 10 Settings

### 6. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start at **http://localhost:3000** and AdminJS will be available at **http://localhost:3000/admin**.

---

## Usage

### AdminJS Panel

1. Open **http://localhost:3000/admin**
2. Login with `admin@example.com` / `admin123` for full admin access
3. Or login with `john@example.com` / `user123` for limited user access

### API Login Endpoint

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the production server |
| `npm run dev` | Start with nodemon (auto-reload on file changes) |
| `npm run seed` | Seed database with sample data |
