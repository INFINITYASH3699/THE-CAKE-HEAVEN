# The Cake Heaven - E-commerce Platform

![Cake Heaven Logo](frontend/public/images/logo.jpg)

## 🍰 Project Overview

The Cake Heaven is a comprehensive e-commerce platform for cake shops, bakeries, and pastry businesses. This full-stack application offers a delightful shopping experience for customers looking to purchase cakes and desserts for various occasions.

## ✨ Key Features

### Customer Experience
- Intuitive product browsing by categories, occasions, flavors, and more
- Advanced filtering and search functionality
- Secure user authentication and profile management
- Shopping cart and wishlist functionality
- Secure checkout process with multiple payment options
- Order tracking and history
- Review and rating system
- Responsive design for all devices

### Admin Features
- Comprehensive dashboard with sales analytics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Coupon and discount management
- Sales and revenue reporting
- Settings management

## 🛠️ Technology Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Various React libraries (react-hook-form, framer-motion, etc.)

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT Authentication
- Cloudinary for image storage
- Various security packages (helmet, xss-clean, etc.)
- Caching for optimized performance

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary account for image storage
- Stripe account for payment processing (optional)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/INFINITYASH3699/THE-CAKE-HEAVEN.git
   cd THE-CAKE-HEAVEN
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. Backend Configuration:
   - Rename `.env.example` to `.env` in the backend directory
   - Update the MongoDB connection string
   - Configure Cloudinary credentials
   - Set up JWT secret key
   - Configure email service (if needed)
   - Set up Stripe API keys (if needed)

2. Frontend Configuration:
   - Update API URL in `frontend/src/lib/api.js` if needed

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 📚 API Documentation

The API documentation is available through Swagger UI at `/api-docs` endpoint when the backend server is running.

### Main API Endpoints

- Authentication: `/api/auth`
- Products: `/api/products`
- Orders: `/api/orders`
- Payments: `/api/payments`
- Analytics: `/api/analytics`
- Coupons: `/api/coupons`
- Settings: `/api/settings`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Token expiration is set to 30 days by default.

## 🔄 Database Schema

The main database collections include:
- Users
- Products
- Orders
- Coupons
- Settings

## 📦 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Build and deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Configure MongoDB Atlas for production database

### Frontend Deployment
1. Build the frontend application
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or other static hosting services

## 🧪 Testing

1. Run backend tests:
   ```bash
   cd backend
   npm test
   ```

2. Run frontend tests:
   ```bash
   cd frontend
   npm test
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For any inquiries, please reach out to the project maintainers.

---

Made with ❤️ by The Cake Heaven Team
