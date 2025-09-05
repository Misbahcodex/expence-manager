import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
  date: Date;
  created_at: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

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

export class TransactionModel {
  static async create(transactionData: CreateTransactionData): Promise<ITransaction> {
    const transaction = new Transaction({
      ...transactionData,
      user_id: new mongoose.Types.ObjectId(transactionData.user_id),
      category_id: new mongoose.Types.ObjectId(transactionData.category_id)
    });
    return await transaction.save();
  }
  
  static async findById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id);
  }
  
  static async findByUserId(userId: string): Promise<TransactionWithCategory[]> {
    const transactions = await Transaction.find({ user_id: userId })
      .populate('category_id', 'name type')
      .sort({ date: -1 });
    
    return transactions.map(transaction => ({
      id: (transaction._id as any).toString(),
      user_id: (transaction.user_id as any).toString(),
      category_id: (transaction.category_id as any).toString(),
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      created_at: transaction.created_at,
      category_name: (transaction.category_id as any).name,
      category_type: (transaction.category_id as any).type
    }));
  }
  
  static async update(id: string, userId: string, updateData: UpdateTransactionData): Promise<ITransaction | null> {
    const updateFields: any = {};
    
    if (updateData.category_id !== undefined) {
      updateFields.category_id = new mongoose.Types.ObjectId(updateData.category_id);
    }
    if (updateData.amount !== undefined) {
      updateFields.amount = updateData.amount;
    }
    if (updateData.description !== undefined) {
      updateFields.description = updateData.description;
    }
    if (updateData.date !== undefined) {
      updateFields.date = updateData.date;
    }
    
    return await Transaction.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateFields,
      { new: true }
    );
  }
  
  static async delete(id: string, userId: string): Promise<boolean> {
    const result = await Transaction.deleteOne({ _id: id, user_id: userId });
    return result.deletedCount > 0;
  }
  
  static async getSummary(userId: string): Promise<{
    totalEarnings: number;
    totalExpenses: number;
    balance: number;
  }> {
    const transactions = await Transaction.find({ user_id: userId })
      .populate('category_id', 'type');
    
    let totalEarnings = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      const category = transaction.category_id as any;
      if (category.type === 'EARNING') {
        totalEarnings += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    
    return {
      totalEarnings,
      totalExpenses,
      balance: totalEarnings - totalExpenses
    };
  }
}
