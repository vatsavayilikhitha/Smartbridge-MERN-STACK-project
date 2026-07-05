# 🛍️ ShopEZ - Full Stack MERN E-Commerce Application

ShopEZ is a premium, responsive e-commerce web application built using the MERN stack. Designed with a custom aesthetic featuring **Deep Navy Blue**, **Coral** accents, and **Warm Ivory** surfaces, the application offers an intuitive experience for buyers and a complete management dashboard for sellers.

---

## 🌐 Live Application URL
🚀 **Live Deploy:** [https://shopez-e-commerce-bfxg.onrender.com/](https://shopez-e-commerce-bfxg.onrender.com/)

---

## 📂 Repository Structure

The project is organized into two main folders:
- **`Documentation/`**: Contains academic planning templates, data flow diagrams (DFD), technology stacks, User Acceptance Testing (UAT) templates, and final PDF project reports.
- **`Project/`**: The complete software codebase.
  - **`Project/client/`**: React frontend built with Vite.
  - **`Project/server/`**: Express.js server connected to MongoDB Atlas.

---

## ✨ Features

### 🛒 Customer Experience:
- **Responsive Navigation:** Smooth mobile hamburger transitions and search parameters.
- **Interactive Catalog:** Live search bar and category filters synced with browser URL states (supporting spaces & ampersands).
- **Product Details:** Dedicated product views featuring reviews and dynamic rating components.
- **Persistent Cart:** A database-synchronized shopping cart that retains selections across sessions.
- **Secure Checkout:** 3-step checkout sequence collecting shipping info and supporting Card, UPI, and Cash on Delivery (COD).
- **Order Tracking:** Ledger showing complete historical orders and active shipment statuses.

### 📊 Seller Dashboard:
- **Sales Analytics:** KPI cards summarizing total revenue, total orders, pending orders, and items delivered.
- **Product Catalog CRUD:** Inventory management modal to create, read, update, and delete products.
- **Order Management:** Real-time state manager to update shipping status (Pending → Processing → Shipped → Delivered → Cancelled).

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), React Router DOM (v6), React Icons, React Hot Toast, Custom Modular CSS variables.
- **Backend:** Node.js, Express.js (ES Modules syntax).
- **Database:** MongoDB Atlas (Cloud-hosted Mongoose ODM).
- **Security:** JWT (JSON Web Tokens) stateless authentication, password hashing using `bcryptjs`.
- **Deployment:** Render (Unified Blueprint deployment via `render.yaml`).

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB Atlas account (for database connection)

### Step 1: Clone the Repository & Configure Env Variables
Create a file named `.env` inside `Project/server/` and fill in the credentials (use `Project/server/.env.example` as a template):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

### Step 2: Install Dependencies
From the repository root, install dependencies for both the frontend client and the backend server:
```bash
cd Project
npm install:all
```

### Step 3: Seed Database (Optional)
Populate your database with mock products, users, and dashboard order statistics:
```bash
cd Project
npm run seed
```
- **Admin/Seller:** `admin@shopez.com` | Password: `admin123`
- **Customer:** `priya@example.com` | Password: `user123`

### Step 4: Run Development Server
Start the client and server concurrently:
```bash
cd Project
npm run dev
```
- Frontend starts at: [http://localhost:5173](http://localhost:5173)
- API Backend runs at: [http://localhost:5000](http://localhost:5000)

---

## 🔒 Security Best Practices
- **Secret Masking:** All database passwords and private keys are loaded via environment variables (`.env`).
- **Git Protection:** `.gitignore` blocks `.env` from ever being pushed to public repositories.
- **Password Hashing:** User passwords are encrypted with a salt factor of 10 prior to database save.
