import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User-mongo';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    // Verify user still exists and is verified
    const user = await UserModel.findById(decoded.userId.toString());
    if (!user || !user.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or unverified user'
      });
    }
    
    req.user = {
      id: (user._id as any).toString(),
      email: user.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
