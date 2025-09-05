import { Response } from 'express';
import { TransactionModel } from '../models/Transaction-mongo';
import { AuthRequest } from '../middleware/auth';

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const summary = await TransactionModel.getSummary(req.user!.id.toString());
    
    res.json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
