/**
 * Send Verification Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
export declare const sendVerificationEmail: (email: string, token: string, name: string) => Promise<any>;
/**
 * Send Password Reset Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
export declare const sendPasswordResetEmail: (email: string, token: string, name: string) => Promise<any>;
//# sourceMappingURL=email-hybrid.d.ts.map