import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createTransaction: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTransactions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTransaction: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTransaction: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=transactionController.d.ts.map