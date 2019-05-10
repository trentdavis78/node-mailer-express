require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');


const app = express();

// View engine setup

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Name: ${req.body.company}</li>
            <li>Name: ${req.body.email}</li>
            <li>Name: ${req.body.phone}</li>
            <li>Name: ${req.body.name}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
             // async..await is not allowed in global scope, must use a wrapper
            async function main(){
       
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "email-smtp.us-east-1.amazonaws.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: process.env.SES_USR, // generated ethereal user
                  pass: process.env.SES_PWD // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
              });
        
            // send mail with defined transport object
            let info = await transporter.sendMail({
            from: "Trent Davis <trentdavisinc@gmail.com>", // sender address
            to: "trentdavisinc@gmail.com", // list of receivers
            subject: "New message from nodemailer", // Subject line
            html: output // html body
            });
        
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
        
        main().catch(console.error);
        res.render('contact', {msg: 'Email has been sent'})
});

app.listen(3000, () => {
    console.log("Server started and listening on port 3000")
});