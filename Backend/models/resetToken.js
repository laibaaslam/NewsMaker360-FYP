// email verfication token
import mongoose from 'mongoose';
// Define User Schema
const resetTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    createdAt: {
        type: Date,
        index: { expires: 60 * 60 * 1000 },
        default: Date.now()
    },
    token: {
        type: String,
        required: true
    },

});

// Compile User model
export default mongoose.model('resetToken', resetTokenSchema);
