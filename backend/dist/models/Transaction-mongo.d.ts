import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    user_id: mongoose.Types.ObjectId;
    category_id: mongoose.Types.ObjectId;
    amount: number;
    description?: string;
    date: Date;
    created_at: Date;
}
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface CreateTransactionData {
    user_id: string;
    category_id: string;
    amount: number;
    description?: string;
    date?: Date;
}
export interface UpdateTransactionData {
    category_id?: string;
    amount?: number;
    description?: string;
    date?: Date;
}
export interface TransactionWithCategory {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    description?: string;
    date: Date;
    created_at: Date;
    category_name: string;
    category_type: 'EXPENSE' | 'EARNING';
}
export declare class TransactionModel {
    static create(transactionData: CreateTransactionData): Promise<ITransaction>;
    static findById(id: string): Promise<ITransaction | null>;
    static findByUserId(userId: string): Promise<TransactionWithCategory[]>;
    static update(id: string, userId: string, updateData: UpdateTransactionData): Promise<ITransaction | null>;
    static delete(id: string, userId: string): Promise<boolean>;
    static getSummary(userId: string): Promise<{
        totalEarnings: number;
        totalExpenses: number;
        balance: number;
    }>;
}
//# sourceMappingURL=Transaction-mongo.d.ts.map