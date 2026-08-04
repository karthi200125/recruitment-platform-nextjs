import nodemailer from "nodemailer";
import { resetPasswordTemplate } from "./emailTemplate";

export const sendResetEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject: "Reset your password",
    html: resetPasswordTemplate(link),
  });
};