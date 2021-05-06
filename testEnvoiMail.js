const nodemailer = require('nodemailer')

const credentials = require('./lib/credentials')

const mailTransport = nodemailer.createTransport({
  host: credentials.host,
  port: credentials.port,
  secure: credentials.secure, 
  auth: {
      user: credentials.sendgrid.user, 
      pass: credentials.sendgrid.password, 
  },
})

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: 'Isabelle Robba <'+credentials.sendgrid.user + '>',
      to: 'isabel.robba@gmail.com',
      subject: 'Test mail nodejs',
      text: 'Test mail',
    })
    console.log('mail sent successfully: ', result)
  } catch(err) {
    console.log('could not send mail: ' + err.message)
  }
}

go()

