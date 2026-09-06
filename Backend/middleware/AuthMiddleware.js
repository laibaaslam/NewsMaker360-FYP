import UserModel from '../models/user.js';
import JWT from "jsonwebtoken";
export const AuthMiddleware = async (req, res, next) => {
    const JWTtoken = req.header('Authorization');
    if (!JWTtoken) {
        return res.status(404).send({
            success: false,
            message: "Unauthorized HTTP, Token not provided",
        });

    }

    const jwttoken = JWTtoken.replace("Bearer", "").trim();
    try {

        const isverified = JWT.verify(jwttoken, process.env.SECRET_KEY);
        // console.log(isverified);
        const userData = await UserModel.findOne({ email: isverified.email }).select({ password: 0, contact: 0, });
        // passing data 
        req.user = userData;
        req.token = jwttoken;
        req.userId = userData._id;

        next();

    }
    catch (error) {
        return res.status(404).send({
            success: false,
            message: "Unauthorized, Invalid token",
        });
    }


}

