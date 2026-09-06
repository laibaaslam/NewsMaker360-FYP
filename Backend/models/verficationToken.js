// email verfication token
import mongoose from 'mongoose';
// Define User Schema
const verificationTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    },
    token: {
        type: String,
        required: true
    },

});

// Compile User model
export default mongoose.model('verificationToken', verificationTokenSchema);
