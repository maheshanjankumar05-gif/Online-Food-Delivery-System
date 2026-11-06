# Online Food Delivery System (QuickBite)

A full-stack Food Ordering and Delivery Management platform built with React, Node.js, Express, and MongoDB.

---

## 🌟 Key Features

- **Customer Storefront (`/`)**:
  - Live food menu across 16 categories (*Biryani, Salads, Pastas, Rolls, Cakes, Desserts, Chinese, North/South Indian, etc.*).
  - **Featured Popular Restaurants**: Browse and filter by top-rated local eateries (*Bawarchi Biryani House, Little Italy, Green Bowl Salads, etc.*).
  - **Dynamic Promo Codes**: One-click promo code discounts (`QUICK50`, `FIRSTBITE`, `FREEDEL`, `WELCOME75`).
  - **Indian Rupee (₹)** pricing throughout the storefront, cart, and checkout.
  - Cart counter & live total calculation with customizable delivery fee.
  - **Cash on Delivery (COD)** and **Online Payment** support.

- **Order Tracking & Driver Bio (`/myorders`)**:
  - **Live Delivery Progress Tracker**: 4 stages (*Order Confirmed → Food Preparing → Out for Delivery → Delivered*).
  - **Estimated Delivery Time Badge**: Real-time delivery ETA window (e.g. *25-30 mins*).
  - **Assigned Driver Bio Card**: Driver avatar, name, rating (⭐ 4.9), vehicle number, verified status, and one-click direct phone dialer.

- **Admin Dashboard (`/admin`)**:
  - Secure admin authentication.
  - Add new dishes with photos, categories, restaurant assignment, and INR pricing.
  - Live inventory management and dish removal.
  - **Live Order Status Management**: Change status to update the customer's live tracker in real time.

---

## 🚀 Quick Start (Local)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas connection string)

### 2. Environment Variables
Create a `.env` file in the `backend/` folder:
```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/food-delivery
JWT_SECRET=your_jwt_secret_key
SALT=10
STRIPE_SECRET_KEY=sk_test_placeholder_key
FRONTEND_URL=http://localhost:4000
```

### 3. Install & Build
```bash
# Install dependencies for all sub-packages
npm run install:all

# Build frontend and admin panels
npm run build
```

### 4. Run the Server
```bash
npm start
```
- Open **Customer Storefront:** `http://localhost:4000/`
- Open **Admin Dashboard:** `http://localhost:4000/admin`

---

## 🌐 Cloud Deployment (Render / Railway)

Because all 3 apps are unified under a single Express server:

### Deploying to Render (Recommended - Free Web Service)
1. Push this repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URL` = Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `JWT_SECRET` = A strong secret string
   - `SALT` = `10`
   - `PORT` = `10000`
6. Click **Deploy Web Service**. Render will build both Vite apps and start your unified full-stack server!
