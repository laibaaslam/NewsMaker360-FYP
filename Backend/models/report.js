
import mongoose from 'mongoose';
// Define report Schema
const reportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    videoLink: { type: String, required: true },
    transcribedText: { type: String, required: true },
    reportDate: { type: Date, default: Date.now, required: true },
    expirationDate: { type: Date, required: true, index: { expires: '4d' } }, // TTL index
});

// Middleware to calculate expiration date based on report date and life span of 4 days
reportSchema.pre('save', function (next) {
    if (!this.expirationDate) {
        this.expirationDate = new Date(this.reportDate);
        this.expirationDate.setDate(this.expirationDate.getDate() + 4);
    }
    next();
});
// Compile User model
export default mongoose.model.Report || mongoose.model('Report', reportSchema);
