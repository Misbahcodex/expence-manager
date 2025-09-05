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
exports.TransactionModel = exports.Transaction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TransactionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
class TransactionModel {
    static async create(transactionData) {
        const transaction = new exports.Transaction({
            ...transactionData,
            user_id: new mongoose_1.default.Types.ObjectId(transactionData.user_id),
            category_id: new mongoose_1.default.Types.ObjectId(transactionData.category_id)
        });
        return await transaction.save();
    }
    static async findById(id) {
        return await exports.Transaction.findById(id);
    }
    static async findByUserId(userId) {
        const transactions = await exports.Transaction.find({ user_id: userId })
            .populate('category_id', 'name type')
            .sort({ date: -1 });
        return transactions.map(transaction => ({
            id: transaction._id.toString(),
            user_id: transaction.user_id.toString(),
            category_id: transaction.category_id.toString(),
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            created_at: transaction.created_at,
            category_name: transaction.category_id.name,
            category_type: transaction.category_id.type
        }));
    }
    static async update(id, userId, updateData) {
        const updateFields = {};
        if (updateData.category_id !== undefined) {
            updateFields.category_id = new mongoose_1.default.Types.ObjectId(updateData.category_id);
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
        return await exports.Transaction.findOneAndUpdate({ _id: id, user_id: userId }, updateFields, { new: true });
    }
    static async delete(id, userId) {
        const result = await exports.Transaction.deleteOne({ _id: id, user_id: userId });
        return result.deletedCount > 0;
    }
    static async getSummary(userId) {
        const transactions = await exports.Transaction.find({ user_id: userId })
            .populate('category_id', 'type');
        let totalEarnings = 0;
        let totalExpenses = 0;
        transactions.forEach(transaction => {
            const category = transaction.category_id;
            if (category.type === 'EARNING') {
                totalEarnings += transaction.amount;
            }
            else {
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
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=Transaction-mongo.js.map