/**
 * Brevo Email Service with SMTP and HTTP API support
 * Primary: HTTP API (Railway compatible)
 * Fallback: SMTP (for other deployments)
 */
interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}
/**
 * Send Verification Email
 */
export declare const sendVerificationEmail: (email: string, token: string, name: string) => Promise<EmailResponse>;
/**
 * Send Password Reset Email
 */
export declare const sendPasswordResetEmail: (email: string, token: string, name: string) => Promise<void>;
export {};
//# sourceMappingURL=email-brevo.d.ts.map