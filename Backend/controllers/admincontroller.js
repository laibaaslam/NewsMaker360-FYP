import UserModel from '../models/user.js';
import { hashPassword, comparePassword } from '../helper/authhelper.js';
//gettting all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        if (!users || users.lenght === 0) {
            res.status(404).json({
                success: false,
                message: "No Users Found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Users Rendered Successfully",
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Fetching Users",
            error,
        });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        await UserModel.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Deleting User",
            error,
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findOne({ _id: id }, { password: 0 });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",

            });
        }
        const userData = {
            username: user.username,
            email: user.email,
            contact: user.contact,
            // Add any other fields you want to include
        };
        res.status(200).json({
            success: true,
            message: "User fetched Successfully",
            user: userData,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Getting User",
            error,
        });
    }
};


export const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;
        const updatedData = await UserModel.updateOne({ _id: id }, { $set: updateUserData });
        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "User Not Found",

        //     });
        // }
        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            user: updatedData,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Updating User",
            error,
        });
    }
};

export const addUser = async (req, res) => {
    try {
        // getting input
        const { username, email, contact, password } = req.body;
        // validations return if not valid terminate further execution
        if (!username.trim()) {
            return res.json({ error: "Name Required!" });
        }
        if (!email.trim()) {
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
        const Emailexists = await UserModel.findOne({ email });
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
            email,
            contact,
            verified: true,
            password: hashedPassword,
        })

        await user.save();

        res.status(201).json({
            success: true,
            message: "User Added Successfully",
            user: {
                username: user.username,
                email: user.email,
                contact: user.contact,
                id: user._id,
            },
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in Adding New User",
            error,
        });
    }
};
