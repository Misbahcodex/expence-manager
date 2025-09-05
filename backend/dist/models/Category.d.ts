export interface Category {
    id: number;
    name: string;
    type: 'EXPENSE' | 'EARNING';
    created_at: Date;
}
export declare class CategoryModel {
    static findAll(): Promise<Category[]>;
    static findById(id: number): Promise<Category | null>;
    static findByType(type: 'EXPENSE' | 'EARNING'): Promise<Category[]>;
}
//# sourceMappingURL=Category.d.ts.map