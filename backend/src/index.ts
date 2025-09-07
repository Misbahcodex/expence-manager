import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

console.log("🚀 Backend server starting...");
console.log("📦 Basic imports loaded successfully");

// Import database and models after basic setup
let connectDatabase: any = null;
let CategoryModel: any = null;
try {
  console.log("📦 Loading database config...");
  const dbModule = require("./config/mongodb");
  connectDatabase = dbModule.connectDatabase;
  console.log("📦 Database config loaded");
  
  console.log("📦 Loading Category model...");
  const categoryModule = require("./models/Category-mongo");
  CategoryModel = categoryModule.CategoryModel;
  console.log("📦 Category model loaded");
} catch (error) {
  console.error("❌ Error loading database modules:", error);
}

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
    ].filter(Boolean), // remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Routes will be loaded dynamically in startServer function
console.log('🛣️ Route registration postponed until server startup...');

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
      emailService: process.env.RESEND_API_KEY ? 'configured' : 'mock',
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
  console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  
  // Load and register routes during server startup
  try {
    console.log('🛣️ Loading and registering routes...');
    
    const userRoutes = require('./routes/userRoutes').default || require('./routes/userRoutes');
    if (userRoutes) {
      app.use('/api/users', userRoutes);
      console.log('✅ User routes registered');
    }
    
    const transactionRoutes = require('./routes/transactionRoutes').default || require('./routes/transactionRoutes');
    if (transactionRoutes) {
      app.use('/api/transactions', transactionRoutes);
      console.log('✅ Transaction routes registered');
    }
    
    const dashboardRoutes = require('./routes/dashboardRoutes').default || require('./routes/dashboardRoutes');
    if (dashboardRoutes) {
      app.use('/api/dashboard', dashboardRoutes);
      console.log('✅ Dashboard routes registered');
    }
    
    const categoryRoutes = require('./routes/categoryRoutes').default || require('./routes/categoryRoutes');
    if (categoryRoutes) {
      app.use('/api/categories', categoryRoutes);
      console.log('✅ Category routes registered');
    }
    
    console.log('✅ All routes loaded and registered successfully');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
    console.log('⚠️ Server will continue without some routes');
  }
  
  // Start the server first, then try to connect to database
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log('🔗 Server is listening on all interfaces (0.0.0.0)');
  });
  
  // Try to connect to database (but don't fail if it's not available)
  if (connectDatabase) {
    try {
      console.log('📡 Attempting to connect to database...');
      await connectDatabase();
      console.log('🗜️ Database connected successfully');
      
      if (CategoryModel && CategoryModel.createDefaultCategories) {
        console.log('🗜️ Creating default categories...');
        await CategoryModel.createDefaultCategories();
        console.log('✅ Database setup complete');
      } else {
        console.log('⚠️ CategoryModel not available, skipping default categories');
      }
    } catch (error) {
      console.error("⚠️ Database connection failed, but server will continue:", error);
      console.log('🔄 Server will attempt to reconnect to database on API calls');
    }
  } else {
    console.log('⚠️ Database connection function not available');
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
