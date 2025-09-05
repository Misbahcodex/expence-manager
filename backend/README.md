# Expense Manager Backend

Express.js backend API for the Expense Manager application.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_manager
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/users/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "message": "User registered successfully. Please verify your email." }`

#### Login User
- **POST** `/api/users/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "token": "jwt_token", "user": { "id": 1, "name": "string", "email": "string" } }`

#### Verify Email
- **GET** `/api/users/verify/:token`
- **Response**: `{ "success": true, "message": "Email verified successfully" }`

#### Forgot Password
- **POST** `/api/users/forgot-password`
- **Body**: `{ "email": "string" }`
- **Response**: `{ "success": true, "message": "Password reset link sent to your email" }`

#### Reset Password
- **POST** `/api/users/reset-password`
- **Body**: `{ "token": "string", "newPassword": "string" }`
- **Response**: `{ "success": true, "message": "Password reset successful" }`

### Transaction Endpoints (Require Authentication)

#### Get All Transactions
- **GET** `/api/transactions`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of transaction objects with category information

#### Create Transaction
- **POST** `/api/transactions`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "category_id": number, "amount": number, "description": "string", "date": "string" }`
- **Response**: `{ "success": true, "transactionId": number }`

#### Update Transaction
- **PUT** `/api/transactions/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "category_id": number, "amount": number, "description": "string", "date": "string" }`
- **Response**: `{ "success": true, "message": "Transaction updated successfully" }`

#### Delete Transaction
- **DELETE** `/api/transactions/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "message": "Transaction deleted successfully" }`

### Dashboard Endpoints (Require Authentication)

#### Get Summary
- **GET** `/api/dashboard/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "totalEarnings": number, "totalExpenses": number, "balance": number }`

### Category Endpoints

#### Get All Categories
- **GET** `/api/categories`
- **Response**: Array of category objects

## Database Schema

The application uses MySQL with the following tables:

- **users**: User accounts and authentication
- **categories**: Transaction categories (expenses/earnings)
- **transactions**: User transactions linked to categories

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | expense_manager |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | Email username | - |
| `EMAIL_PASS` | Email password/app password | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection with parameterized queries

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
