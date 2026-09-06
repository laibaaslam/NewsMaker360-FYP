import { check, validationResult } from "express-validator";
export const validateUser = [
    check("username")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Username missing")
        .isLength({ min: 4, max: 20 })
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Username can only contain letters and numbers'),

    check("email")
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),
    check("contact")
        .notEmpty()
        .withMessage('Contact number is required')
        .isNumeric()
        .withMessage('Contact number must be numeric')
        .isLength({ min: 11, max: 11 })
        .withMessage('Contact number must be 11 digits'),
    check("password")
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')

];

export const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, errors: errors.array()[0].msg });
    }
    next(); // Call next middleware if validation passes
};