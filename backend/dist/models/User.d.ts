export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    verification_token?: string;
    reset_token?: string;
    reset_token_expiry?: Date;
    created_at: Date;
}
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
    static create(userData: CreateUserData): Promise<User>;
    static findById(id: number): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findByVerificationToken(token: string): Promise<User | null>;
    static findByResetToken(token: string): Promise<User | null>;
    static verifyEmail(id: number): Promise<void>;
    static setResetToken(email: string, token: string, expiry: Date): Promise<void>;
    static resetPassword(token: string, newPassword: string): Promise<void>;
    static validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map