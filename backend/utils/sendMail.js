import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"E-Wallet" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "E-Wallet: OTP xác thực giao dịch",
    text: `Mã OTP của bạn là: ${otp} (có hiệu lực trong 3 phút)`
  });
}
