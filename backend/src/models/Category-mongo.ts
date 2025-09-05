import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'EXPENSE' | 'EARNING';
  created_at: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['EXPENSE', 'EARNING']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

export class CategoryModel {
  static async findAll(): Promise<ICategory[]> {
    return await Category.find().sort({ type: 1, name: 1 });
  }
  
  static async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }
  
  static async findByType(type: 'EXPENSE' | 'EARNING'): Promise<ICategory[]> {
    return await Category.find({ type }).sort({ name: 1 });
  }
  
  static async createDefaultCategories(): Promise<void> {
    const categories = [
      { name: 'Food & Dining', type: 'EXPENSE' },
      { name: 'Transportation', type: 'EXPENSE' },
      { name: 'Shopping', type: 'EXPENSE' },
      { name: 'Entertainment', type: 'EXPENSE' },
      { name: 'Bills & Utilities', type: 'EXPENSE' },
      { name: 'Healthcare', type: 'EXPENSE' },
      { name: 'Education', type: 'EXPENSE' },
      { name: 'Other Expenses', type: 'EXPENSE' },
      { name: 'Salary', type: 'EARNING' },
      { name: 'Freelance', type: 'EARNING' },
      { name: 'Investment', type: 'EARNING' },
      { name: 'Gift', type: 'EARNING' },
      { name: 'Other Income', type: 'EARNING' }
    ];
    
    for (const categoryData of categories) {
      await Category.findOneAndUpdate(
        { name: categoryData.name, type: categoryData.type },
        categoryData,
        { upsert: true, new: true }
      );
    }
  }
}

