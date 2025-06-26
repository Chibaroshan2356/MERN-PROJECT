# Coupon Manager - MERN Stack Application

A full-stack coupon management application built with MongoDB, Express.js, React.js, and Node.js with user authentication.

## Features

- 🔐 User Authentication (Sign up/Sign in)
- 📋 View all coupons
- ➕ Create new coupons
- 🔍 Search coupons
- 📝 Edit existing coupons
- 👁️ View coupon details
- 🗑️ Delete coupons
- 📱 Responsive design

## Project Structure

```
coupon-manager/
├── backend/          # Express.js server
├── frontend/         # React.js client
├── package.json      # Root package.json
└── README.md         # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coupon-manager
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
   - Create `.env` file in the `backend` directory
   - Add your MongoDB connection string and JWT secret

4. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create a new coupon
- `GET /api/coupons/:id` - Get coupon by ID
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon
- `GET /api/coupons/search?q=query` - Search coupons

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- cors for cross-origin requests

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 