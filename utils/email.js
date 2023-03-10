const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');


class SendEmail {
  constructor(user, url) {
    this.to = user;
    this.name = user.name.split(' ')[0];
    this.url = url;
    this.from = `Illia Dolbnia <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Would be done in the future
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: this.name,
        url: this.url,
        subject
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordWrap: false })
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcomeEmail', 'Welcome');
  }

  async sendResetPassword() {
    await this.send('resetPasswordEmail', 'Your password reset token( valid only for 10 minutes)');
  }

}


module.exports = SendEmail;

