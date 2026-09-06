// routes/auth.js
// , , generateOTP, verifyOTP
import { signupController, loginController, user, verifyUser, verifyEmail, forgotPassword, resetPassword } from "../controllers/authcontroller.js";
import { validateUser, handleValidationResult } from "../middleware/validator.js";
import { isResetTokenValid } from "../middleware/resetTokenValidator.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { Router } from "express";
//router object required for keeping routing of api in separate files
const router = Router();

// POST Method :  /api/auth 

// /signup validating user input fields
router.post('/signup', validateUser, handleValidationResult, signupController);
//  /login checking first if user eixst in db
router.post('/login', verifyUser, loginController);
// getting user
router.get('/user', AuthMiddleware, user);
router.post('/verifyEmail', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', isResetTokenValid, resetPassword);
// endpoint to verify if token and id of user valid 
router.get('/verify-token', isResetTokenValid, (req, res) => {
    res.json({
        success: true
    });
});
export default router;
