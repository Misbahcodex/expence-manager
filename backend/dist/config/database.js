"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'expenses',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
exports.pool = promise_1.default.createPool(dbConfig);
const initializeDatabase = async () => {
    try {
        const connection = await exports.pool.getConnection();
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'expenses'}`);
        await connection.execute(`USE ${process.env.DB_NAME || 'expenses'}`);
        // Create Users table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create Categories table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('EXPENSE', 'EARNING') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create Transactions table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
        // Insert default categories
        await connection.execute(`
      INSERT IGNORE INTO categories (name, type) VALUES 
      ('Food & Dining', 'EXPENSE'),
      ('Transportation', 'EXPENSE'),
      ('Shopping', 'EXPENSE'),
      ('Entertainment', 'EXPENSE'),
      ('Bills & Utilities', 'EXPENSE'),
      ('Healthcare', 'EXPENSE'),
      ('Education', 'EXPENSE'),
      ('Other Expenses', 'EXPENSE'),
      ('Salary', 'EARNING'),
      ('Freelance', 'EARNING'),
      ('Investment', 'EARNING'),
      ('Gift', 'EARNING'),
      ('Other Income', 'EARNING')
    `);
        connection.release();
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=database.js.map