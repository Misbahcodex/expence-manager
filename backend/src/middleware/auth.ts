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
    // Check for authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // Extract and verify token
    const token = authHeader.substring(7);
    
    // This will throw an error if token is invalid or expired
    const decoded = verifyToken(token);
    
    // Verify user still exists and is verified
    const user = await UserModel.findById(decoded.userId.toString());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified'
      });
    }
    
    // Set user info in request object
    req.user = {
      id: (user._id as any).toString(),
      email: user.email
    };
    
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
    }
    
    // Generic error
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};
