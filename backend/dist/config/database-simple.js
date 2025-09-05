"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTransactionId = exports.nextCategoryId = exports.nextUserId = exports.transactions = exports.categories = exports.users = exports.initializeDatabase = void 0;
// In-memory storage
let users = [];
exports.users = users;
let categories = [];
exports.categories = categories;
let transactions = [];
exports.transactions = transactions;
let nextUserId = 1;
exports.nextUserId = nextUserId;
let nextCategoryId = 1;
exports.nextCategoryId = nextCategoryId;
let nextTransactionId = 1;
exports.nextTransactionId = nextTransactionId;
const initializeDatabase = async () => {
    try {
        // Initialize default categories
        exports.categories = categories = [
            { id: 1, name: 'Food & Dining', type: 'EXPENSE', created_at: new Date() },
            { id: 2, name: 'Transportation', type: 'EXPENSE', created_at: new Date() },
            { id: 3, name: 'Shopping', type: 'EXPENSE', created_at: new Date() },
            { id: 4, name: 'Entertainment', type: 'EXPENSE', created_at: new Date() },
            { id: 5, name: 'Bills & Utilities', type: 'EXPENSE', created_at: new Date() },
            { id: 6, name: 'Healthcare', type: 'EXPENSE', created_at: new Date() },
            { id: 7, name: 'Education', type: 'EXPENSE', created_at: new Date() },
            { id: 8, name: 'Other Expenses', type: 'EXPENSE', created_at: new Date() },
            { id: 9, name: 'Salary', type: 'EARNING', created_at: new Date() },
            { id: 10, name: 'Freelance', type: 'EARNING', created_at: new Date() },
            { id: 11, name: 'Investment', type: 'EARNING', created_at: new Date() },
            { id: 12, name: 'Gift', type: 'EARNING', created_at: new Date() },
            { id: 13, name: 'Other Income', type: 'EARNING', created_at: new Date() }
        ];
        console.log('✅ In-memory database initialized successfully');
        console.log('📝 Note: This is a temporary database for testing. Data will be lost when server restarts.');
    }
    catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=database-simple.js.map