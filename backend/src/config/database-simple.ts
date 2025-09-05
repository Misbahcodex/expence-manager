// Simple in-memory database for testing without MySQL
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expiry?: Date;
  created_at: Date;
}

interface Category {
  id: number;
  name: string;
  type: 'EXPENSE' | 'EARNING';
  created_at: Date;
}

interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description?: string;
  date: Date;
  created_at: Date;
}

// In-memory storage
let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];
let nextUserId = 1;
let nextCategoryId = 1;
let nextTransactionId = 1;

export const initializeDatabase = async () => {
  try {
    // Initialize default categories
    categories = [
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
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Export the in-memory data for use in models
export { users, categories, transactions, nextUserId, nextCategoryId, nextTransactionId };

