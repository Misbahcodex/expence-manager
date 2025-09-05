import mongoose, { Document } from 'mongoose';
export interface ICategory extends Document {
    name: string;
    type: 'EXPENSE' | 'EARNING';
    created_at: Date;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare class CategoryModel {
    static findAll(): Promise<ICategory[]>;
    static findById(id: string): Promise<ICategory | null>;
    static findByType(type: 'EXPENSE' | 'EARNING'): Promise<ICategory[]>;
    static createDefaultCategories(): Promise<void>;
}
//# sourceMappingURL=Category-mongo.d.ts.map