# Deployment Guide

This guide will help you deploy the Coupon Manager MERN application to various platforms.

## Prerequisites

- Node.js and npm installed
- MongoDB database (local or cloud)
- Git repository set up

## Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

### 2. Frontend Environment Variables

For production, you may need to set the API URL. Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Heroku

#### Backend Deployment

1. Create a Heroku account and install Heroku CLI
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```

5. Add MongoDB addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

6. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   ```

7. Deploy:
   ```bash
   git push heroku main
   ```

#### Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Update the API URL in your code to point to your Heroku backend
3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy to Netlify, Vercel, or GitHub Pages

### Option 2: Vercel

#### Backend Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard

#### Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Option 3: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database:
   ```bash
   mongo
   use coupon-manager
   ```

### MongoDB Atlas (Cloud)

1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## Production Considerations

### Security

1. Use strong JWT secrets
2. Enable HTTPS
3. Set up CORS properly
4. Validate all inputs
5. Use environment variables for sensitive data

### Performance

1. Enable compression
2. Use CDN for static assets
3. Optimize images
4. Implement caching
5. Use database indexes

### Monitoring

1. Set up error logging
2. Monitor application performance
3. Set up alerts
4. Regular backups

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS settings include your frontend domain
2. **MongoDB connection**: Check connection string and network access
3. **JWT errors**: Verify JWT_SECRET is set correctly
4. **Build errors**: Check Node.js version compatibility

### Logs

- Check application logs in your hosting platform
- Use `console.log` for debugging (remove in production)
- Set up proper error handling

## Support

For issues and questions:
1. Check the README.md file
2. Review error logs
3. Test locally first
4. Check hosting platform documentation 