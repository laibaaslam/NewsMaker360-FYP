// this is a helper file for for hashing of email verification token to make it save
import bcrypt from "bcrypt";

// hashing input 
export const hashtoken = async (token) => {
    try {
        //number of times the bcrypt algorithm will be applied to the input password
        const saltRounds = 10;
        const hashedtoken = await bcrypt.hash(token, saltRounds);
        return hashedtoken;
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'Could not hash password' }); // Set status code and return JSON response
    }
};
// comparing input 
export const compareToken = async (token, hashedtoken) => {
    return bcrypt.compare(token, hashedtoken);
};