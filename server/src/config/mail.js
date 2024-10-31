const CREDENTIALS = {
    host: process.env.MAIL_HOST || "email-smtp.us-east-1.amazonaws.com",
    port: process.env.MAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.MAILJET_API_KEY || 'AKIA34EZPPD5TWVA4WUV',
      pass: process.env.MAILJET_API_SECRET || 'BOeOtOUZFZRoCCssKlE2NALHwwWZnXLvLPLgeAcfW1P3',
    },
  };
  
  module.exports = {
    CREDENTIALS,
    FROM_ADDRESS: process.env.FROM_ADDRESS || 'hiremyteam@celestialsys.com', // TODO Change from adress.
  };
  