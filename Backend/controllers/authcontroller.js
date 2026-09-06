import UserModel from '../models/user.js';
import resetTokenModel from '../models/resetToken.js';
import { hashPassword, comparePassword } from '../helper/authhelper.js';
import { hashtoken, compareToken } from '../helper/tokenhelper.js';
import { resetHashToken, generateResetToken, resetEmailTemplate, PlainEmailTemplate } from '../helper/resetTokenHelper.js';
import { emailTemplate, generateOTP, mailTransport, welcomeEmailTemplate } from '../helper/otphelper.js';
import JWT from "jsonwebtoken";
import { isValidObjectId } from 'mongoose';
// otp schema
import verificationToken from '../models/verficationToken.js';

/** middleware for verifying user */
export const verifyUser = async (req, res, next) => {
    try {

        const input = req.method == "GET" ? req.query : req.body;
        const email = input?.email?.trim()?.toLowerCase();
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        // check user existance

        const user = await UserModel.findOne({ email });

        if (!user) {
            // not found
            return res.status(404).send({
                success: false,
                message: "Cannot find User",
            });
        }
        next();


    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: "Authentication Error",
            error,
        });
    }
}
/**POST 
 * username
 * email
 * contact
 * password
 */
export const signupController = async (req, res) => {
    try {
        // getting input
        const { username, email, contact, password } = req.body;
        const normalizedEmail = email?.trim()?.toLowerCase();
        // validations return if not valid terminate further execution
        if (!username.trim()) {
            return res.json({ error: "Name Required!" });
        }
        if (!normalizedEmail) {
            return res.json({ error: "Email Required!" });
        }
        if (!password.trim()) {
            return res.json({ error: "Password Required!" });
        }
        if (!contact.trim()) {
            return res.json({ error: "Phone number Required!" });
        }

        const Usernameexists = await UserModel.findOne({ username });
        //check if this user already exists on basis of email becz we kept it unique for every user
        const Emailexists = await UserModel.findOne({ email: normalizedEmail });
        //exisiting user
        if (Emailexists) {
            // User already exists, return a 409 status code (Conflict) along with a message
            return res.status(409).json({
                success: false,
                error: "Email already exists",
                message: "Email already exists!.Please choose a different email."
            });
        }
        if (Usernameexists) {
            // this will notify use and redirect to login
            // User already exists, return a 409 status code (Conflict) along with a message
            return res.status(409).json({
                success: false,
                error: "Username already exists",
                message: "A user with the provided username already exists. Please choose a different username."
            });
        }


        //if not then add/sign up new user // hashing the password for security
        //    can use trim to cut space
        const hashedPassword = await hashPassword(password);
        //saving user
        const user = new UserModel({
            username,
            email: normalizedEmail,
            contact,
            password: hashedPassword,
            verified: true,
        })
        await user.save();
        //  201 for successfull creation or update
        // res.status(201).send({
        //     success: true,
        //     message: "User Registered Successfully",
        //     user,
        // });
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
            },
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
};


// POST LOGIN
/**POST 
 * username: this could contain email or username
 * password
 */
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim()?.toLowerCase();
        //validation
        if (!normalizedEmail) {
            return res.json({ error: "Email Required!" });
        }
        if (!password.trim()) {
            return res.json({ error: "Password Required!" });
        }
        //check user in database based on email
        const user = await UserModel.findOne({ email: normalizedEmail });
        // Check if the input matches an email or a username
        // const user = await UserModel.findOne({
        //     $or: [{ email: username }, { username: username }]
        // });
        if (!user) {
            // not found
            return res.status(404).json({
                success: false,
                message: "User not registerd",
            });
        }
        // in order to compare passwords we use compare password method
        const match = await comparePassword(password, user.password);
        if (!match) {
            // unauthorized access
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        //creating JWT token for user authentication on server  we can protect routes with this token
        const token = await JWT.sign({
            _id: user._id,
            email: user.email,
            role: user.role,
        }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        res.status(200).json({
            success: true,
            message: "Logged In",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                contact: user.contact,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

export const user = async (req, res) => {
    try {
        const userData = req.user;

        return res.status(200).json({
            success: true,
            message: "User found",
            user: userData,
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while getting user",
        });
    }
}
// email verfifcation through otp  user id and otp as input

export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        //   if req body is missing any input param
        if (!userId || !otp.trim()) {
            return res.status(401).json({
                success: false,
                message: "Missing input paramters!",
            });
        }

        // checking if user id is valid object id or not using mongoose
        if (!isValidObjectId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Invalid userId",
            });
        }
        // console.log(userId)
        // checking if user exist in db
        const user = await UserModel.findById(userId);
        // console.log(user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        // console.log("hi");
        //     if user email is already verified
        if (user.verified) {
            return res.status(401).json({
                success: false,
                message: "Account Already Verified",
            });
        }
        // getting token assoiated with user from db for comparison

        const otptoken = await verificationToken.findOne({ owner: userId });
        if (!otptoken) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }
        const match = await compareToken(otp, otptoken.token);
        // checking otp provded by user and save in db
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Please enter valid OTP!",
            });
        }
        //  changing user to verfied 
        user.verified = true;
        await verificationToken.findByIdAndDelete(otptoken._id);
        // saving user
        await user.save();
        // sending welcome mail
        mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: user.email,
            subject: 'Welcome!',
            html: welcomeEmailTemplate("Email Verified Successfully!", "Thanks for connecting with us"),
        });
        // deleting token from db
        // res.send("verifyOTP Routes");
        return res.status(201).json({
            success: true,
            message: "Your Email is verified!",
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in Verifying Email",
        });
    }
};
//  forget password input email 
export const forgotPassword = async (req, res) => {
    try {
        // console.log("hi 1");
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Please provide valid email",
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }


        // find token for user 
        const resetToken = await resetTokenModel.findOne({ owner: user._id });
        if (resetToken) {
            return res.status(401).json({
                success: false,
                message: "Only after 1  hour you can request for another token ",
            });
        }
        // console.log("hihih");
        // Generate and save a password reset token for a user 
        const NewResetToken = await generateResetToken();
        // hashing the token
        const hashedResetToken = await resetHashToken(NewResetToken);
        const resetTokenInstance = new resetTokenModel({ owner: user._id, token: hashedResetToken });
        await resetTokenInstance.save();

        // sending reset email
        mailTransport().sendMail({
            from: 'security@email.com',
            to: user.email,
            subject: 'Reset Password Email',
            html: resetEmailTemplate(`http://localhost:3000/reset-password?token=${NewResetToken}&id=${user._id}`),
        });
        return res.status(201).json({
            success: true,
            message: "Password Reset link send to your email",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while Reset Password",
            error,
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        //    new password entered by user 

        const { password } = req.body;

        if (!password.trim()) {
            return res.json({ error: "Password Required!" });
        }
        // we are sending user from resettoken validator

        const user = await UserModel.findById(req.user._id);
        if (!user) {
            // not found
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // check if user enters same password
        const isPasswordSame = await comparePassword(password, user.password);
        if (isPasswordSame) {
            // not found
            return res.status(404).json({
                success: false,
                message: "Enter New Password",
            });
        }


        // password type check  and can trim but i didinot do it in sign 
        // hashin and saving the password
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        // after resetting password deleting tokenfor reset
        await resetTokenModel.findOneAndDelete({ owner: user._id });

        // sending reset email
        mailTransport().sendMail({
            from: 'security@email.com',
            to: user.email,
            subject: 'Password Reset Successful',
            html: PlainEmailTemplate("Password Reset Successfully", "Now you can login with new password!!"),
        });

        return res.status(201).json({
            success: true,
            message: "Password Reset Succesfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while Reset Password",
            error,
        });
    }
};