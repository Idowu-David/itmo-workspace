import transporter from "../config/mailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  console.log("VERIFY: ", verifyUrl)
  try {
    const info = await transporter.sendMail({
      from: `"ITMO Workspace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your ITMO account",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your Unilag student account.</p>
          <a href="${verifyUrl}" style="display:inline-block; background:#2C5CC5; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin-top:12px;">
            Verify Email
          </a>
          <p style="color:#888; font-size:13px; margin-top:20px;">This link expires in 30 minutes.</p>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
