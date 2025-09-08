"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("./config/mongodb");
const Category_mongo_1 = require("./models/Category-mongo");
// Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
dotenv_1.default.config();
console.log("🚀 Backend server starting...");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
console.log("🚀 Express app created, PORT:", PORT);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS - whitelist frontend domains
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // local dev
        "http://localhost:3001", // local dev alternative
        "https://prolific-kindness-production-dcce.up.railway.app", // frontend on Railway
        process.env.FRONTEND_URL, // dynamic frontend URL from env
    ].filter(Boolean), // remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
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
        const statusMap = {
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
    }
    catch (error) {
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
app.use((err, req, res, next) => {
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
    // Start the server first, then try to connect to database
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
        console.log('🔗 Server is listening on all interfaces (0.0.0.0)');
    });
    // Try to connect to database (but don't fail if it's not available)
    try {
        console.log('📡 Attempting to connect to database...');
        await (0, mongodb_1.connectDatabase)();
        console.log('🗜️ Database connected successfully');
        console.log('🗜️ Creating default categories...');
        await Category_mongo_1.CategoryModel.createDefaultCategories();
        console.log('✅ Database setup complete');
    }
    catch (error) {
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
}
catch (error) {
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
//# sourceMappingURL=index.js.map