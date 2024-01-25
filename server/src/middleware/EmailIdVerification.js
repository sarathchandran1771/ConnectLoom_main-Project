// middleware/emailVerify.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


const sendVerificationEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        const subject = 'Verify Your Email....';
        await transporter.sendMail({
            from: process.env.USER,
            to: user.emailId,
            subject: subject,
            html: `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                    <h2 style="color: #333;">Hello ${user.username}!</h2>
                    <p style="color: #555;">Thank you for signing up with us.</p>
                    <p style="color: #555;">To complete your registration, please verify your email by clicking the button below:</p>
                    <a href="${process.env.FRONTEND_BASEURL}/verifyemail/${user.emailToken}"
                    " 
                       style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        Verify Your Email
                    </a>
                    <p style="color: #555; margin-top: 20px;">If the button above doesn't work, you can also click the link below:</p>
                    <p style="color: #007BFF;"><a href="${process.env.FRONTEND_BASEURL}/verifyemail/${user.emailToken}" style="color: #007BFF; text-decoration: none;">${process.env.FRONTEND_BASEURL}/verifyemail/${user.emailToken}</a></p>
                    <p style="color: #555;">Thank you!</p>
                </div>
            `,
        });
        
    } catch (error) {
        console.error("Email not sent!");
        console.error(error);
        throw error;
    }
};

module.exports = {  sendVerificationEmail};