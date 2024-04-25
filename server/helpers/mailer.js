const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_MAILER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function sendPostEmail(users, emailData) {
  users.map((user) => {
    let mailDetails = {
      from: process.env.GMAIL_MAILER,
      to: user.email,
      subject: `New Weather Post Available about ${emailData.Type.name}`,
      html: `
            <p>Hey there,</p>
            <p>There is a new weather post titled ${emailData.title}.</p>
            <p>Please check it out on WeatherBrewHive click here to continue <a href=${process.env.DATA_WEBSITE_URL}>here</a>.</p>
            <!-- Footer -->
            <div style="background-color: #f2f2f2; padding: 20px;">
            <!-- Logo and Partition -->
            <div style="display: flex; align-items: center;">
                <div>
                <img src="https://res.cloudinary.com/dghilbqdk/image/upload/v1713171404/weather%20brew%20hive/qdisddobuaeipaasjpby.png" alt="Your Logo" style="width: 100px; height: auto; margin-right: 20px;">
                </div>
                <div style="border-left: 1px solid #ccc; padding-left: 20px;">
                <p>This email is being sent to ${user.email}. If you have any questions, please contact us at <a href="mailto:brewhive0208@gmail.com">brewhive0208@gmail.com</a>.</p>
                <p>&copy; 2024 Weather Brew Hive. All rights reserved.</p>
                </div>
            </div>
            </div>
        `,
    };

    mailTransporter.sendMail(mailDetails); // This is okay in test so use this when we don't want to check if the email successfully sent or not

    // to test if the email is sent or not (but it is said that doing this might cause problem in test because of the delay output of the email successfully send) in other word REMEMBER don't use this when you want to test
    // mailTransporter.sendMail(mailDetails,
    //   (error, info) => {
    //   if (error) {
    //     console.error('Error sending email: ', error);
    //   } else {
    //     console.log('Email sent: ', info.response);
    //   }
    // });
  });
}
function payment(user, paymentLink) {
  let mailDetails = {
    from: process.env.GMAIL_MAILER,
    to: user,
    subject: `Donation payment to weather brew hive`,
    html: `
          <p>Hey there,</p>
          <p>Here is the payment link for the donation please click <a href=${paymentLink}>here</a></p>
          
          <!-- Footer -->
          <div style="background-color: #f2f2f2; padding: 20px;">
          <!-- Logo and Partition -->
          <div style="display: flex; align-items: center;">
              <div>
              <img src="https://res.cloudinary.com/dghilbqdk/image/upload/v1713171404/weather%20brew%20hive/qdisddobuaeipaasjpby.png" alt="Your Logo" style="width: 100px; height: auto; margin-right: 20px;">
              </div>
              <div style="border-left: 1px solid #ccc; padding-left: 20px;">
              <p>This email is being sent to ${user}. If you have any questions, please contact us at <a href="mailto:brewhive0208@gmail.com">brewhive0208@gmail.com</a>.</p>
              <p>&copy; 2024 Weather Brew Hive. All rights reserved.</p>
              </div>
          </div>
          </div>
      `,
  };
  mailTransporter.sendMail(mailDetails); // This is okay in test so use this when we don't want to check if the email successfully sent or not

  // to test if the email is sent or not (but it is said that doing this might cause problem in test because of the delay output of the email successfully send) in other word REMEMBER don't use this when you want to test
  // mailTransporter.sendMail(mailDetails,
  //   (error, info) => {
  //   if (error) {
  //     console.error('Error sending email: ', error);
  //   } else {
  //     console.log('Email sent: ', info.response);
  //   }
  // });
}

module.exports = { sendPostEmail, payment };
