# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack expense management application with a Next.js frontend and Express.js backend using MongoDB for data persistence. The app features user authentication, transaction management, and real-time financial summaries.

## Development Commands

### Setup & Installation
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Setup backend environment
cd backend && cp env.example .env
# Then configure your MongoDB URI, JWT secret, and email settings
```

### Development Workflow
```bash
# Start frontend development server (with Turbopack)
npm run dev

# Start backend development server
npm run start:backend
# OR: cd backend && npm run dev

# Start both frontend and backend together
npm run start:full
```

### Build & Production
```bash
# Build frontend only
npm run build

# Build backend only
npm run build:backend

# Build entire application
npm run build:full

# Start production servers
npm run start:frontend  # Frontend production
npm run start:backend   # Backend production
```

### Code Quality
```bash
# Lint frontend code
npm run lint

# Backend TypeScript compilation
cd backend && npm run build
```

## Architecture Overview

### Frontend Structure (`app/` directory)
- **Next.js 15 App Router**: Uses the modern app directory structure
- **Authentication Context**: `contexts/AuthContext.tsx` provides global auth state
- **API Layer**: `lib/api.ts` centralized Axios configuration with JWT interceptors
- **Route-based Pages**: Each route (`login/`, `dashboard/`, etc.) has its own `page.tsx`
- **Global Layout**: `layout.tsx` includes AuthProvider wrapper

### Backend Structure (`backend/src/` directory)
- **MVC Architecture**: Organized into controllers, models, routes, and middleware
- **MongoDB with Mongoose**: Document-based data models for Users, Transactions, Categories
- **JWT Authentication**: Token-based auth with middleware protection
- **Email System**: Both real (Nodemailer) and mock implementations

### Key Architectural Patterns

#### Database Strategy
- **MongoDB Primary**: Uses Mongoose models (User-mongo.ts, Transaction-mongo.ts, Category-mongo.ts)
- **Legacy MySQL Support**: Contains alternate MySQL implementations (database-simple.ts)
- **Model Abstraction**: UserModel, TransactionModel classes abstract database operations

#### Authentication Flow
- **JWT Tokens**: Stored in localStorage, automatically attached to requests
- **Email Verification**: Required for account activation
- **Password Reset**: Token-based password recovery system
- **Route Protection**: Both frontend (AuthContext) and backend (auth middleware) protection

#### API Communication
- **Proxy Pattern**: Frontend uses `/api/proxy` route to avoid CORS issues
- **Centralized Error Handling**: Axios interceptors for token expiration
- **Structured Responses**: Consistent API response format across endpoints

## Key Files to Understand

### Frontend Core Files
- `app/lib/api.ts` - All API calls and authentication logic
- `app/contexts/AuthContext.tsx` - Global authentication state management
- `app/layout.tsx` - Root layout with AuthProvider
- `next.config.js` - Contains Railway deployment URL configuration

### Backend Core Files
- `backend/src/index.ts` - Express server setup with middleware configuration
- `backend/src/config/mongodb.ts` - Database connection and configuration
- `backend/src/middleware/auth.ts` - JWT authentication middleware
- `backend/src/controllers/userController.ts` - Authentication business logic

## Development Environment Setup

### Required Environment Variables (Backend `.env`)
```env
# MongoDB (Primary database)
MONGODB_URI=mongodb://localhost:27017/expense_manager

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Development vs Production Database
- **Development**: Uses mock email service (console logging)
- **Production**: Configured for Railway deployment with MongoDB Atlas
- **Testing**: Check `TESTING_GUIDE.md` for complete auth flow testing

## Deployment Configuration

### Railway Deployment
- **Backend**: Configured with `railway.json` and `Procfile`
- **Frontend**: Environment variable points to Railway backend URL
- **Docker Support**: Contains `Dockerfile` for containerized deployment
- **Netlify Alternative**: `netlify.toml` configuration available

### Database Migrations
- **Auto-Creation**: MongoDB collections and default categories created on startup
- **Default Categories**: Expense and earning categories automatically seeded
- **User Verification**: Email verification system integrated into user registration

## Transaction Management Architecture

### Category System
- **Pre-defined Categories**: System creates default expense/earning categories
- **Type-based**: Categories are typed as either 'EXPENSE' or 'EARNING'
- **Auto-categorization**: Transactions must be assigned to existing categories

### Financial Calculations
- **Real-time Summary**: Dashboard aggregates earnings, expenses, and balance
- **Transaction History**: Filterable by type (all, expenses, earnings)
- **CRUD Operations**: Full create, read, update, delete for transactions

## Authentication Security Features

### Security Measures
- **Password Hashing**: bcryptjs with salt rounds of 12
- **JWT Expiration**: Configurable token expiry (default 7 days)
- **Email Verification**: Prevents unverified account usage
- **CORS Protection**: Whitelisted origins for API access
- **Helmet Security**: Additional HTTP security headers

### Token Management
- **Automatic Refresh**: Frontend handles token expiration gracefully
- **Local Storage**: Tokens persisted across browser sessions
- **Logout Cleanup**: Complete token and user data removal on logout
