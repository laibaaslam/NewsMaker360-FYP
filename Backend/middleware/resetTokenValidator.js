import { isValidObjectId } from "mongoose";
import UserModel from '../models/user.js';
import resetTokenModel from '../models/resetToken.js';
import { compareResetToken } from '../helper/resetTokenHelper.js';
export const isResetTokenValid = async (req, res, next) => {
    try {

        const { token, id } = req.query;

        if (!token || !id) {
            return res.status(401).json({
                success: false,
                message: "Invalid Request",
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(401).json({
                success: false,
                message: "Invalid User",
            });
        }
        const user = await UserModel.findById(id);

        if (!user) {
            // not found
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        // find token for user 
        const userResetToken = await resetTokenModel.findOne({ owner: user._id });
        if (!userResetToken) {
            return res.status(401).json({
                success: false,
                message: "Reset Token not found ",
            });
        }

        const match = await compareResetToken(token, userResetToken.token);

        if (!match) {
            // unauthorized access
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }

        //  assugnest user values whose password we want to reset  
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while validating Reset Token",
            error,
        });
    }
};