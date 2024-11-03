const {
    PASSWORD_RESET_REDIRECT_URL,
  } =require('../constants')
    
    const PASSWORD_RESET_MAIL = (salutation, link) => `<p>Hello!</p><br/>
    <p>${salutation},</p><br/>
    <p> Your request to reset password has been received. Please click on the link <a href="${PASSWORD_RESET_REDIRECT_URL}?token=${link}">reset password on Web</a> to update your password.</p><br/>
    <p>Thanks,</p>
    `  
    module.exports = {
      PASSWORD_RESET_MAIL,
    };
    