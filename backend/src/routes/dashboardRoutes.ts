import { Router } from 'express';
import { getSummary } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get('/summary', getSummary);

export default router;
