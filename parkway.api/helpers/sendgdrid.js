const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//   to: 'jaydavis2112@gmail.com', // Change to your recipient
//   from: process.env.SENDGRID_FROM_EMAIL, // Change to your verified sender
//   subject: process.env.SENDGRID_PASSWORD_RESET_SUBJECT,
//   text: 'This is text in a test email.',
//   html: '<strong>This is "strong" test in a test email.</strong>',
// }

// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log(response[0].statusCode)
//     console.log(response[0].headers)
//   })
//   .catch((error) => {
//     console.error(error)
//   })

  async function sendPasswordResetEmail(toEmail, resetToken) {

    const msg = {
      to: toEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: process.env.SENDGRID_PASSWORD_RESET_SUBJECT,
      text: `Click the following link to reset your password: ${process.env.PASSWORD_RESET_BASE_URL}/${resetToken}`,
    }
    
    try {
      await sgMail.send(msg)
      return 'Email sent successfully!'
    } catch (error) {
      console.error('Error sending email:', error)
      return res.status(500).json({message: 'Check the logs for any issues.'});
    }
  }

  module.exports = { sendPasswordResetEmail };