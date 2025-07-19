
# E-Commerce Platform



A modern, full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This application features user authentication, product listings, shopping cart functionality, payment processing with Razorpay, and an admin dashboard.

## ✨ Features

- **User Authentication** - Secure login system with Passport.js
- **Product Browsing** - Browse and search for products
- **Shopping Cart** - Add items to cart, manage quantities, and checkout
- **Payment Processing** - Integrated with Razorpay for secure payments
- **Order Management** - Track order history and status
- **Admin Dashboard** - Manage products and view order analytics
- **Responsive Design** - Optimized for mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Material UI** - Component library for modern design
- **Axios** - HTTP client for API requests
- **React Router** - For client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Razorpay** - Payment gateway integration
- **Nodemailer** - Email sending functionality

## 📁 Directory Structure

```
Directory structure:
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Header.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ProductList.js
│   │   │   └── ProtectedRoute.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   └── tailwind.config.js
└── server
    ├── middleware
    │   └── admin.js
    ├── models
    │   ├── Order.js
    │   ├── Product.js
    │   └── User.js
    ├── package.json
    ├── passport.js
    ├── routes
    │   ├── order.js
    │   ├── payment.js
    │   └── products.js
    ├── server.js
    └── utils
        └── mailer.js
```

### Frontend Structure
- **components/** - Contains all React components including:
  - `AdminDashboard.js` - Admin control panel
  - `Header.js` - Navigation header with cart functionality
  - `LoginPage.js` - User authentication interface
  - `ProductList.js` - Product display and shopping functionality
  - `ProtectedRoute.js` - Route protection for authenticated users

### Backend Structure
- **middleware/** - Express middleware including admin authorization
- **models/** - Mongoose schemas for:
  - `Order.js` - Order data structure
  - `Product.js` - Product data structure
  - `User.js` - User data structure
- **routes/** - API endpoints for:
  - `order.js` - Order management
  - `payment.js` - Payment processing
  - `products.js` - Product listings
- **utils/** - Helper functions including:
  - `mailer.js` - Email notification system

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Razorpay account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-platform.git
   cd ecommerce-platform
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ADMIN_EMAIL=your_admin_email
   ```

5. **Start the development servers**

   In the server directory:
   ```bash
   npm start
   ```

   In the client directory:
   ```bash
   npm start
   ```

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product (admin only)
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `POST /api/save-order` - Create a single product order
- `POST /api/save-cart-order` - Create multiple product orders from cart
- `GET /api/all-orders` - Get all orders (admin only)

### Authentication
- `POST /api/login` - User login
- `GET /api/logout` - User logout
- `GET /api/current-user` - Get current user information

### Payment
- `POST /api/create-order` - Create Razorpay payment order

## 🔒 Authentication

The application uses Passport.js for authentication. There are different levels of access:
- **Guest users** can browse products
- **Authenticated users** can add items to cart and make purchases
- **Admin users** have access to the admin dashboard and can manage products and orders

## 💼 Admin Dashboard

The admin dashboard provides:
- Overview of all orders
- Order status management
- Customer information
- Payment details
- Date and time tracking

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers


---

### Made by Eshita Bhawsar
