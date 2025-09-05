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
declare let users: User[];
declare let categories: Category[];
declare let transactions: Transaction[];
declare let nextUserId: number;
declare let nextCategoryId: number;
declare let nextTransactionId: number;
export declare const initializeDatabase: () => Promise<void>;
export { users, categories, transactions, nextUserId, nextCategoryId, nextTransactionId };
//# sourceMappingURL=database-simple.d.ts.map