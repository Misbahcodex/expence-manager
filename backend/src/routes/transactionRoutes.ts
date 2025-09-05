import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
