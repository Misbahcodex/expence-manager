import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expiry?: Date;
  token_version: number;
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_token: {
    type: String,
    default: () => uuidv4()
  },
  reset_token: String,
  reset_token_expiry: Date,
  token_version: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  
  static async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
  
  static async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  
  static async findByVerificationToken(token: string): Promise<IUser | null> {
    return await User.findOne({ verification_token: token });
  }
  
  static async findByResetToken(token: string): Promise<IUser | null> {
    return await User.findOne({ 
      reset_token: token, 
      reset_token_expiry: { $gt: new Date() } 
    });
  }
  
  static async verifyEmail(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { 
      is_verified: true, 
      verification_token: undefined 
    });
  }
  
  static async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
    await User.findOneAndUpdate(
      { email },
      { reset_token: token, reset_token_expiry: expiry }
    );
  }
  
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({ reset_token: token });
    if (user) {
      user.password = newPassword;
      user.reset_token = undefined;
      user.reset_token_expiry = undefined;
      await user.save();
    }
  }
  
  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  
  static async incrementTokenVersion(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $inc: { token_version: 1 } });
  }
  
  static async revokeAllTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { token_version: 0 });
  }
}

