/**
 * Railway-Compatible Email Service using HTTP-based Resend API
 * (Gmail SMTP is blocked on Railway due to port restrictions)
 */
/**
 * Send Verification Email
 */
export declare const sendVerificationEmail: (email: string, token: string, name: string) => Promise<void>;
/**
 * Send Password Reset Email
 */
export declare const sendPasswordResetEmail: (email: string, token: string, name: string) => Promise<void>;
//# sourceMappingURL=email-railway.d.ts.map