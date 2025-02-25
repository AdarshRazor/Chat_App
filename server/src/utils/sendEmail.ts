// utils/sendEmail.ts
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

interface EmailConfig {
  host: string;
  service: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || "",
  service: process.env.EMAIL_SERVICE || "",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Boolean(process.env.EMAIL_SECURE) || false,
  user: process.env.EMAIL_USER || "",
  pass: process.env.EMAIL_PASS || "",
};

const sendEmail = async (email: string, subject: string, text: string): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: emailConfig.host,
      service: emailConfig.service,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    const mailOptions: SendMailOptions = {
      from: emailConfig.user,
      to: email,
      subject: subject,
      text: text, // Or use html: for HTML emails
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow or handle the error as needed
  }
};

export default sendEmail;