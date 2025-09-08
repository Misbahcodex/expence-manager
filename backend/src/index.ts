import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDatabase } from "./config/mongodb";
import { CategoryModel } from "./models/Category-mongo";

// Routes
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

console.log("🚀 Backend server starting...");

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

console.log("🚀 Express app created, PORT:", PORT);

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - whitelist frontend domains
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      "http://localhost:3001", // local dev alternative
      "https://prolific-kindness-production-dcce.up.railway.app", // frontend on Railway
      process.env.FRONTEND_URL, // dynamic frontend URL from env
    ].filter(Boolean) as string[], // remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);

console.log('✅ All routes registered successfully');

// Basic ping endpoint for debugging
app.get("/", (req, res) => {
  res.json({ message: "Expense Manager Backend is running!", timestamp: new Date().toISOString() });
});

app.get("/ping", (req, res) => {
  res.json({ pong: true, timestamp: new Date().toISOString() });
});

// Health check - Always return 200 for Railway health checks
app.get("/api/health", async (req, res) => {
  try {
    // Check database connection
    const dbState = require('mongoose').connection.readyState;
    const statusMap: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    const dbStatus = statusMap[dbState] || 'unknown';
    
    // Always return 200 OK for health checks, even if DB is not connected
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connected: dbState === 1
      },
      environment: process.env.NODE_ENV || 'development',
      emailService: process.env.RESEND_API_KEY ? 'resend-http' : (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ? 'gmail-smtp' : 'mock',
      port: PORT
    });
  } catch (error) {
    console.error('Health check error:', error);
    // Still return 200 for health check
    res.status(200).json({
      success: true,
      message: "Server is running (health check error)",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const startServer = async () => {
  console.log('🔧 Environment variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', PORT);
  console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('- GMAIL_USER exists:', !!process.env.GMAIL_USER);
  console.log('- GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('- FRONTEND_URL exists:', !!process.env.FRONTEND_URL);
  // Start the server first, then try to connect to database
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log('🔗 Server is listening on all interfaces (0.0.0.0)');
  });
  
  // Try to connect to database (but don't fail if it's not available)
  try {
    console.log('📡 Attempting to connect to database...');
    await connectDatabase();
    console.log('🗜️ Database connected successfully');
    
    console.log('🗜️ Creating default categories...');
    await CategoryModel.createDefaultCategories();
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error("⚠️ Database connection failed, but server will continue:", error);
    console.log('🔄 Server will attempt to reconnect to database on API calls');
  }
  
  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('📡 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
};

// Wrap everything in try-catch to catch startup errors
try {
  startServer();
} catch (error) {
  console.error('❌ Fatal startup error:', error);
  process.exit(1);
}

// Also handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
