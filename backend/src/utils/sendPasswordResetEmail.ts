import resend from "../config/mailer";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "ITMO Workspace <onboarding@resend.dev>",
    to: "idowudavidodun@gmail.com",
    subject: "Reset your ITMO password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>You requested a password reset for your ITMO Workspace account.</p>
        <p>Click the button below to set a new password:</p>
        <a href="${resetUrl}" 
           style="display:inline-block; background:#2C5CC5; color:#fff; 
                  padding:12px 24px; border-radius:8px; text-decoration:none; margin-top:12px;">
          Reset Password
        </a>
        <p style="color:#888; font-size:13px; margin-top:20px;">
          This link expires in 30 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Reset email sent:", data?.id);
};
