const CREDENTIALS = {
    host: process.env.MAIL_HOST || "",
    port: process.env.MAIL_PORT || 0,
    secure: true,
    auth: {
      user: process.env.MAILJET_API_KEY || '',
      pass: process.env.MAILJET_API_SECRET || '',
    },
  };
  
  module.exports = {
    CREDENTIALS,
    FROM_ADDRESS: process.env.FROM_ADDRESS || '', // TODO Change from adress.
  };
  