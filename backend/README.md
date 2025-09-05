# Expense Manager Backend

This is the backend API for the Expense Manager application.

## Environment Variables

Set these environment variables in Railway:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_manager
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.railway.app
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/categories` - Get categories
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get transactions
- `GET /api/dashboard/summary` - Get dashboard summary