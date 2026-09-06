import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
export const generateOTP = () => {
    try {
        // Default options
        const defaultOptions = {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        };

        // Merge default options with provided options
        const otpOptions = { ...defaultOptions };

        // Generate OTP using otp-generator library
        const otp = otpGenerator.generate(4, otpOptions);

        return otp;

    }
    catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'Could not hash password' }); // Set status code and return JSON response
    }

};

export const mailTransport = () => {

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD
        }
    });
    return transporter;
};

export const emailTemplate = (otp) => {
    return (
        ` 
        <!DOCTYPE html >
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email Verification OTP</title>
            </head>
            <body style="font-family: Arial, sans-serif;">

                        <div style="background-color: #f4f4f4; padding: 20px;">
                            <h2 style="color: #333;">Email Verification OTP</h2>
                            <p style="color: #666;">Dear User,</p>
                            <p style="color: #666;">Your OTP for email verification is:</p>
                            <h3 style="color: #007bff; font-weight: bold;">${otp}</h3>
                            <p style="color: #666;">Please use this OTP to verify your email address.</p>
                            <p style="color: #666;">If you did not request this OTP, please ignore this email.</p>
                        </div>

                        <div style="background-color: #fff; padding: 20px;">
                            <p style="color: #666;">Regards,</p>
                            <p style="color: #666;">NewsMaker360</p>
                        </div>

            </body>
        </html>
    `)
};


export const welcomeEmailTemplate = (heading, message) => {
    return (
        ` 
        <!DOCTYPE html >
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welecome to NewsMaker360</title>
            </head>
            <body style="font-family: Arial, sans-serif;">

                        <div style="background-color: #f4f4f4; padding: 20px;">
                            <h2 style="color: #333;">Welcome Email </h2>
                            <p style="color: #666;">Dear User,</p>
                            <p style="color: #666;">${heading}</p>
                            <p style="color: #666;">${message}</p>
                        </div>

                        <div style="background-color: #fff; padding: 20px;">
                            <p style="color: #666;">Regards,</p>
                            <p style="color: #666;">NewsMaker360</p>
                        </div>

            </body>
        </html>
    `)
};