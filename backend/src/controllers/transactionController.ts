import { Response } from 'express';
import { TransactionModel, CreateTransactionData, UpdateTransactionData } from '../models/Transaction-mongo';
import { AuthRequest } from '../middleware/auth';

export const createTransaction = async (req: AuthRequest, res: Response) => {
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
    
    const transactionData: CreateTransactionData = {
      user_id: req.user!.id.toString(),
      category_id: category_id.toString(),
      amount,
      description,
      date: date ? new Date(date) : undefined
    };
    
    const transaction = await TransactionModel.create(transactionData);
    
    res.status(201).json({
      success: true,
      transactionId: (transaction._id as any).toString(),
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await TransactionModel.findByUserId(req.user!.id.toString());
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionData = req.body;
    
    if (updateData.amount !== undefined && updateData.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    const transaction = await TransactionModel.update(
      id,
      req.user!.id.toString(),
      updateData
    );
    
    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await TransactionModel.delete(id, req.user!.id.toString());
    
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
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
