import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    verification_token?: string;
    reset_token?: string;
    reset_token_expiry?: Date;
    created_at: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export declare class UserModel {
    static create(userData: CreateUserData): Promise<IUser>;
    static findById(id: string): Promise<IUser | null>;
    static findByEmail(email: string): Promise<IUser | null>;
    static findByVerificationToken(token: string): Promise<IUser | null>;
    static findByResetToken(token: string): Promise<IUser | null>;
    static verifyEmail(id: string): Promise<void>;
    static setResetToken(email: string, token: string, expiry: Date): Promise<void>;
    static resetPassword(token: string, newPassword: string): Promise<void>;
    static validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=User-mongo.d.ts.map