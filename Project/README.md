# ShopEZ — MERN E-Commerce Application

> A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce platform built with a premium burgundy & beige design system.

## 📁 Project Structure

```
mern integration project/
├── client/          # React + Vite frontend (port 5173)
├── server/          # Node.js + Express backend (port 5000)
├── package.json     # Root — runs both with concurrently
└── .gitignore
```

## 🚀 Quick Start

### 1. Configure MongoDB

Edit `server/.env` and replace the `MONGO_URI` with your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopez
JWT_SECRET=your_super_secret_key_here
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

Or run all at once:
```bash
npm run install:all
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin**: `admin@shopez.com` / `admin123`
- **User**: `priya@example.com` / `user123`
- 12 sample products across all categories

### 4. Run the Application

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 🎨 Features

### Customer Features
- Browse products with category/sort filters and search
- Product detail page with image gallery and reviews
- Shopping cart with quantity management
- 3-step checkout (address → payment → confirm)
- Order history with expandable details
- User profile with address management

### Admin Features
- Dashboard with revenue, order stats
- Product management (create, edit, delete)
- Order management with status updates

### Tech Features
- JWT authentication with protected routes
- MongoDB with Mongoose models
- Axios with JWT interceptor
- React Hot Toast notifications
- Fully responsive design

## 🗂️ API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/products | Public | Get products |
| GET | /api/products/:id | Public | Get product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET | /api/cart | User | Get cart |
| POST | /api/cart | User | Add to cart |
| POST | /api/orders | User | Place order |
| GET | /api/orders/my-orders | User | My orders |
| GET | /api/orders | Admin | All orders |
| PUT | /api/users/profile | User | Update profile |

## 🎨 Design System

Colors: Burgundy (`#6D1A36`) + Beige (`#EDE0CC`)  
Fonts: Playfair Display (headings) + Lato (body)

## 👥 Team

Built by the ShopEZ team as part of the MERN Full Stack Developer program on Skillwallet.
