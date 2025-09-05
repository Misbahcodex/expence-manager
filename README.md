# Expense Manager

A full-stack expense management application built with Next.js (frontend) and Express.js (backend) with MySQL database.

## Features

- **User Authentication**: Register, login, email verification, and password reset
- **Transaction Management**: Add, edit, delete, and view transactions
- **Category Management**: Pre-defined categories for expenses and earnings
- **Dashboard**: Real-time financial summary with earnings, expenses, and balance
- **Responsive Design**: Modern UI that works on all devices
- **Secure**: JWT authentication and password hashing

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- React Hook Form for form management
- Axios for API calls
- Lucide React for icons

### Backend
- Express.js with TypeScript
- MySQL database with mysql2
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for email services
- CORS and Helmet for security

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd expence-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expenses

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd .. # Go back to root directory
npm install
```

### 4. Database Setup

1. Create a MySQL database named `expense_manager`
2. The application will automatically create the required tables on first run

### 5. Email Configuration (Optional)

For email verification and password reset to work:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` environment variable

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/verify/:token` - Verify email
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions (requires auth)
- `POST /api/transactions` - Create transaction (requires auth)
- `PUT /api/transactions/:id` - Update transaction (requires auth)
- `DELETE /api/transactions/:id` - Delete transaction (requires auth)

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary (requires auth)

### Categories
- `GET /api/categories` - Get all categories

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed)
- `is_verified` (BOOLEAN)
- `verification_token` (VARCHAR)
- `reset_token` (VARCHAR)
- `reset_token_expiry` (DATETIME)
- `created_at` (DATETIME)

### Categories Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `type` (ENUM: 'EXPENSE', 'EARNING')
- `created_at` (DATETIME)

### Transactions Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `category_id` (Foreign Key to Categories)
- `amount` (DECIMAL)
- `description` (TEXT)
- `date` (DATETIME)
- `created_at` (DATETIME)

## Usage

1. **Register**: Create a new account with your name, email, and password
2. **Verify Email**: Check your email and click the verification link
3. **Login**: Sign in with your credentials
4. **Add Transactions**: Use the dashboard to add income and expense transactions
5. **View Summary**: Monitor your financial health with the dashboard summary
6. **Manage Categories**: Transactions are automatically categorized

## Features Overview

### Dashboard
- Real-time financial summary
- Transaction history with filtering
- Add new transactions with categories
- Visual indicators for earnings vs expenses

### Authentication
- Secure user registration and login
- Email verification system
- Password reset functionality
- JWT-based session management

### Transaction Management
- Add transactions with amount, category, description, and date
- Filter transactions by type (all, expenses, earnings)
- Edit and delete existing transactions
- Automatic categorization

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
npm run build  # Build TypeScript
npm start  # Start production server
```

### Frontend Development
```bash
npm run dev  # Start Next.js development server
npm run build  # Build for production
npm start  # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.