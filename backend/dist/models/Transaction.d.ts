export interface Transaction {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    description?: string;
    date: Date;
    created_at: Date;
}
export interface CreateTransactionData {
    user_id: number;
    category_id: number;
    amount: number;
    description?: string;
    date?: Date;
}
export interface UpdateTransactionData {
    category_id?: number;
    amount?: number;
    description?: string;
    date?: Date;
}
export interface TransactionWithCategory extends Transaction {
    category_name: string;
    category_type: 'EXPENSE' | 'EARNING';
}
export declare class TransactionModel {
    static create(transactionData: CreateTransactionData): Promise<Transaction>;
    static findById(id: number): Promise<Transaction>;
    static findByUserId(userId: number): Promise<TransactionWithCategory[]>;
    static update(id: number, userId: number, updateData: UpdateTransactionData): Promise<Transaction>;
    static delete(id: number, userId: number): Promise<void>;
    static getSummary(userId: number): Promise<{
        totalEarnings: number;
        totalExpenses: number;
        balance: number;
    }>;
}
//# sourceMappingURL=Transaction.d.ts.map