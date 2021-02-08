const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure : false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls:{
      rejectUnauthorized:false
  }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Jacob Ryan <process.env.EMAIL_USERNAME>',
    to: 'pralhadkharel@gmail.com',
    subject: 'Node testing',
    text: 'Hello Node'
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;