"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactions = exports.createTransaction = void 0;
const Transaction_mongo_1 = require("../models/Transaction-mongo");
const createTransaction = async (req, res) => {
    try {
        const { category_id, amount, description, date } = req.body;
        if (!category_id || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Category ID and amount are required'
            });
        }
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        const transactionData = {
            user_id: req.user.id.toString(),
            category_id: category_id.toString(),
            amount,
            description,
            date: date ? new Date(date) : undefined
        };
        const transaction = await Transaction_mongo_1.TransactionModel.create(transactionData);
        res.status(201).json({
            success: true,
            transactionId: transaction._id.toString(),
            message: 'Transaction created successfully'
        });
    }
    catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction_mongo_1.TransactionModel.findByUserId(req.user.id.toString());
        res.json(transactions);
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getTransactions = getTransactions;
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.amount !== undefined && updateData.amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        const transaction = await Transaction_mongo_1.TransactionModel.update(id, req.user.id.toString(), updateData);
        res.json({
            success: true,
            message: 'Transaction updated successfully',
            transaction
        });
    }
    catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction_mongo_1.TransactionModel.delete(id, req.user.id.toString());
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transactionController.js.map