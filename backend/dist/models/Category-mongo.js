"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = exports.Category = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CategorySchema = new mongoose_1.Schema({
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
exports.Category = mongoose_1.default.model('Category', CategorySchema);
class CategoryModel {
    static async findAll() {
        return await exports.Category.find().sort({ type: 1, name: 1 });
    }
    static async findById(id) {
        return await exports.Category.findById(id);
    }
    static async findByType(type) {
        return await exports.Category.find({ type }).sort({ name: 1 });
    }
    static async createDefaultCategories() {
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
            await exports.Category.findOneAndUpdate({ name: categoryData.name, type: categoryData.type }, categoryData, { upsert: true, new: true });
        }
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=Category-mongo.js.map