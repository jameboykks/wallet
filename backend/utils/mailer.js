const nodemailer = require('nodemailer');

exports.sendMail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    // Cấu hình theo dịch vụ của bạn
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_password'
    }
  });

  return transporter.sendMail({
    from: '"E-Wallet" <your_email@gmail.com>',
    to,
    subject,
    text
  });
};
