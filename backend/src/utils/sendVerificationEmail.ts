import resend from "../config/mailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "ITMO Workspace <onboarding@resend.dev>",
    to: email,
    subject: "Verify your ITMO account",
    html: `<a href="${verifyUrl}">Verify Email</a>`,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data?.id);
};
