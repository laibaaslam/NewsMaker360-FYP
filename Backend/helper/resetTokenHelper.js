// this is a helper file for for hashing of password reset token to make it save
import bcrypt from "bcrypt";
import crypto from 'crypto';


// hashing input 
export const resetHashToken = async (token) => {
    try {
        //number of times the bcrypt algorithm will be applied to the input password
        const saltRounds = 10;
        const resethashedtoken = await bcrypt.hash(token, saltRounds);
        return resethashedtoken;
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'Could not hash password' }); // Set status code and return JSON response
    }
};
// comparing input 
export const compareResetToken = async (token, resethashedtoken) => {

    return bcrypt.compare(token, resethashedtoken);
};

// generating random reset token for aync call
export const generateResetToken = async () => {
    // console.log("INside reset genrate");
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buffer) => {
            if (err) {

                reject(err);
            } else {

                const token = buffer.toString('hex');
                resolve(token);
            }
        });
    });
};
// email to send to user with link
export const resetEmailTemplate = (resetLink) => {
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
                <h2 style="color: #333;">Password Reset Link</h2>
                <p style="color: #666;">Dear User,</p>
                <p style="color: #666;">You requested to reset your password.</p>
                <p style="color: #666;">Click the link below to reset your password:</p>
                <a href="${resetLink}" style="color: #007bff; font-weight: bold;">Reset Password</a>
                <p style="color: #666;">If you did not request a password reset, please ignore this email.</p>
            </div>


                        <div style="background-color: #fff; padding: 20px;">
                            <p style="color: #666;">Regards,</p>
                            <p style="color: #666;">NewsMaker360</p>
                        </div>

            </body>
        </html>
    `)
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


export const PlainEmailTemplate = (heading, message) => {
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
