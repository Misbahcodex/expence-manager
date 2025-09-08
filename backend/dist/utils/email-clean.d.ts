/**
 * Send Verification Email using Gmail
 */
export declare const sendVerificationEmail: (email: string, token: string, name: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo | {
    fallback: boolean;
    verificationUrl: string;
}>;
/**
 * Send Password Reset Email using Gmail
 */
export declare const sendPasswordResetEmail: (email: string, token: string, name: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo | {
    fallback: boolean;
    resetUrl: string;
}>;
//# sourceMappingURL=email-clean.d.ts.map