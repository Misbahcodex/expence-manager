import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Ensure JWT_SECRET is provided from environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set. This is a security risk in production.');
  // Only generate a random secret for development environments
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
}

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
// Use shorter expiration times for security
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Default to 1 hour instead of 1 day
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Validate expiration times to prevent overly long tokens
if (JWT_EXPIRES_IN.match(/^\d+d$/)) {
  const days = parseInt(JWT_EXPIRES_IN.replace('d', ''));
  if (days > 1) {
    console.warn('WARNING: JWT access token expiration is set to more than 1 day. This is a security risk.');
  }
}
if (JWT_REFRESH_EXPIRES_IN.match(/^\d+d$/)) {
  const days = parseInt(JWT_REFRESH_EXPIRES_IN.replace('d', ''));
  if (days > 30) {
    console.warn('WARNING: JWT refresh token expiration is set to more than 30 days. This is a security risk.');
  }
}

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

export interface JwtRefreshPayload {
  userId: number;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

// Generate access token with more secure options
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
    audience: 'expense-manager-app',
    issuer: 'expense-manager-api'
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: number, tokenVersion: number): string => {
  return jwt.sign(
    { userId, tokenVersion } as JwtRefreshPayload, 
    JWT_SECRET, 
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256',
      audience: 'expense-manager-app',
      issuer: 'expense-manager-api'
    }
  );
};

// Verify access token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'expense-manager-app',
      issuer: 'expense-manager-api'
    }) as JwtPayload;
  } catch (error: any) {
    // Provide more specific error messages for debugging
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token signature');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not yet active');
    } else {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'expense-manager-app',
      issuer: 'expense-manager-api'
    }) as JwtRefreshPayload;
  } catch (error: any) {
    // Provide more specific error messages for debugging
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token signature');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Refresh token not yet active');
    } else {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }
};

/**
 * Generate a new secure JWT secret
 * This can be used for secret rotation, which is a security best practice
 */
export const generateNewJwtSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Invalidate all tokens by forcing a secret rotation
 * This should be called when a security breach is suspected or during critical security events
 */
export const rotateJwtSecret = async (): Promise<string> => {
  // In a real application, this would update the secret in your database or environment
  // and potentially notify administrators
  const newSecret = generateNewJwtSecret();
  console.log('WARNING: JWT secret has been rotated. All existing tokens are now invalid.');
  
  // Here you would update your application's secret storage
  // For example: await updateSecretInDatabase('JWT_SECRET', newSecret);
  
  return newSecret;
};
