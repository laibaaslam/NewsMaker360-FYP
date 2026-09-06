
import mongoose from 'mongoose';
// Define User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
        match: /^[a-zA-Z0-9]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    contact: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{11}/.test(v); // Regular expression to match 11-digit Pakistani phone numbers
            },
            message: props => `${props.value} is not a valid Pakistani phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        unique: false,
        // minlength: 8,
        // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        // Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character
        // You can add additional validation rules for password strength here
    },
    role: {
        type: Number,
        default: 0,
        // 0 for user 1 for admin
    },
    // this is used to check user is verified through email otp
    verified: {
        type: Boolean,
        default: false,
        required: true,

    },
}, { timestamps: true }
);

// Compile User model
export default mongoose.model.Users || mongoose.model('User', userSchema);
