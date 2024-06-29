const nodemailer = require('nodemailer');

const sendMail = async (mailOptions) => {
  /** Create transporter for sending mail */
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    logger: true,
  });

  const { to, subject, text } = mailOptions;
  await transporter.sendMail({
    to,
    from: {
      name: 'Sumit Prasad from MERN ☯️',
      address: 'sumitprasad303@gmail.com'
    },
    subject,
    text
  });
};

module.exports = sendMail;
