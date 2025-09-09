/**
 * Brevo Email Service with SMTP and HTTP API support
 * Primary: HTTP API (Railway compatible)
 * Fallback: SMTP (for other deployments)
 */
/**
 * Send Verification Email
 */
export declare const sendVerificationEmail: (email: string, token: string, name: string) => Promise<void>;
/**
 * Send Password Reset Email
 */
export declare const sendPasswordResetEmail: (email: string, token: string, name: string) => Promise<void>;
//# sourceMappingURL=email-brevo.d.ts.map