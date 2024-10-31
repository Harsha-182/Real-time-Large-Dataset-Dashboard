const mailer = require('nodemailer');
const {
  CREDENTIALS,
  FROM_ADDRESS,
} = require('../config/mail');

const transporter = mailer.createTransport(CREDENTIALS, {
  logger: true,
});

const send = async (to, subject, body, attachment) => transporter.sendMail({
  from: FROM_ADDRESS, // sender address
  to:'harshavardhan0626@gmail.com' , // list of receivers
  // to, // list of receivers
  subject, // Subject line
  html: body, // plain text body
  attachments: attachment,
}, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }});
module.exports = {
  send,
};
