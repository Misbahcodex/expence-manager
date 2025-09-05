# Complete Auth Module Setup Guide

This project now includes a complete authentication system with the following features:

## 🔐 Features

- **User Registration (Signup)** with email verification
- **User Login** with JWT tokens
- **Email Verification** system
- **Forgot Password** functionality
- **Reset Password** with secure tokens
- **Password Hashing** using bcrypt
- **JWT Authentication** for protected routes
- **Responsive UI** with Tailwind CSS

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd app/backend
npm install
```

### 2. Database Configuration

Update the database connection in `app/backend/db.js`:

```javascript
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "misbah", // Your MySQL password
  database: "sql_form", // Your database name
});
```

### 3. Email Configuration

Update the email settings in `app/backend/routes/auth.js`:

```javascript
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password", // Replace with your app password
  },
});
```

**Note:** For Gmail, you need to:

1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password instead of your regular password

### 4. JWT Secret

Update the JWT secret in `app/backend/routes/auth.js`:

```javascript
const JWT_SECRET = "your-secret-key-change-in-production";
```

### 5. Start Backend Server

```bash
cd app/backend
node index.js
```

The server will run on `http://localhost:4000`

### 6. Frontend Setup

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
app/
├── backend/
│   ├── routes/
│   │   └── auth.js          # All auth routes
│   ├── db.js               # Database connection
│   ├── index.js            # Express server
│   └── package.json
├── frontend/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   └── pages/
│       ├── loin.tsx
│       ├── signup.tsx
│       ├── forgot.tsx
│       ├── reset-password.tsx
│       └── verify-email.tsx
├── login/
│   └── page.tsx            # Login page
├── signup/
│   └── page.tsx            # Signup page
├── forgot-password/
│   └── page.tsx            # Forgot password page
├── reset-password/
│   └── page.tsx            # Reset password page
├── verify-email/
│   └── page.tsx            # Email verification page
└── dashboard/
    └── page.tsx            # Dashboard (protected)
```

## 🔗 API Endpoints

### Authentication Routes

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| POST   | `/api/signup`              | Register new user         |
| POST   | `/api/login`               | User login                |
| POST   | `/api/forgot-password`     | Send password reset email |
| POST   | `/api/reset-password`      | Reset password with token |
| POST   | `/api/verify-email`        | Verify email with token   |
| POST   | `/api/resend-verification` | Resend verification email |

## 🎯 User Flow

### 1. Registration Flow

1. User fills signup form
2. System creates account with verification token
3. Verification email sent to user
4. User clicks email link to verify
5. Account activated

### 2. Login Flow

1. User enters email/password
2. System validates credentials
3. JWT token generated and stored
4. User redirected to dashboard

### 3. Password Reset Flow

1. User requests password reset
2. Reset token generated and emailed
3. User clicks email link
4. User sets new password
5. Token invalidated

## 🛡️ Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication tokens
- **Email Verification**: Prevents fake accounts
- **Token Expiration**: Reset tokens expire after 1 hour
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request protection

## 🎨 UI Features

- **Responsive Design**: Works on all devices
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages
- **Success Messages**: Confirmation of successful actions
- **Form Validation**: Client-side validation
- **Modern Styling**: Clean, professional design

## 🔧 Customization

### Styling

All components use Tailwind CSS classes. You can customize the styling by modifying the className attributes.

### Email Templates

Email templates are in HTML format in the auth routes. You can customize the design and content.

### Database Schema

The database automatically creates the required tables. You can modify the schema in `db.js`.

## 🚨 Important Notes

1. **Email Configuration**: You must configure a real email service for production
2. **JWT Secret**: Change the JWT secret for production
3. **Database Security**: Use strong database passwords
4. **HTTPS**: Use HTTPS in production for security
5. **Environment Variables**: Move sensitive data to environment variables

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**: Check email configuration and app passwords
2. **Database connection failed**: Verify database credentials
3. **CORS errors**: Ensure backend CORS is properly configured
4. **JWT token issues**: Check JWT secret configuration

### Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Test signup
curl -X POST http://localhost:4000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📞 Support

If you encounter any issues, check:

1. Console logs for error messages
2. Database connection status
3. Email service configuration
4. Network connectivity between frontend and backend

The auth module is now complete and ready for use! 🎉
