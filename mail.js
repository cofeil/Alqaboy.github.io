var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'laurghcof@gmail.com',
      pass: 'laurc123'
    }
  });

module.exports = {
    // var mailOptions = {
    //     from: 'youremail@gmail.com',
    //     to: 'myfriend@yahoo.com',
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };
 	sendEmail: function(mailOptions) {	  
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
 	},

}
