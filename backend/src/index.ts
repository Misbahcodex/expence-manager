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
const app = express();
const PORT = process.env.PORT || 5000;

console.log("🚀 Backend server starting...");

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
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);

// Health check
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
    
    res.json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connected: dbState === 1
      },
      environment: process.env.NODE_ENV || 'development',
      emailService: process.env.RESEND_API_KEY ? 'configured' : 'mock'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
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
  try {
    await connectDatabase();
    await CategoryModel.createDefaultCategories();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
