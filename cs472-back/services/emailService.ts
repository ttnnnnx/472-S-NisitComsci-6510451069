import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  public static async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ) {
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: "NisitComSci <noreply@localhost>",
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>
               <p>This link will expire in 1 hour.</p>`,
      });

      return { message: "Reset email sent successfully" };
    } catch (error) {
      console.error("Failed to send email: ", error);
      return { error: "Failed to send email" };
    }
  }
}
