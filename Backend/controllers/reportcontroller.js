import ReportModel from '../models/report.js';
import UserModel from '../models/user.js';

export const addReport = async (req, res) => {
    try {
        // getting input
        const { userId, videoLink, transcribedText } = req.body;

        // validations return if not valid terminate further execution
        if (!userId.trim()) {
            return res.json({ error: "Id Required!" });
        }
        if (!videoLink.trim()) {
            return res.json({ error: "Video Link Required!" });
        }
        if (!transcribedText.trim()) {
            return res.json({ error: "Text Required!" });
        }

        const report = new ReportModel({
            userId, videoLink, transcribedText,
            reportDate: new Date(),
            expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // Set expiration date to 4 days from now
        });
        await report.save();

        res.status(201).json({
            success: true,
            message: "Report Saved Successfully",
            report,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in Saving Report",
            error,
        });
    }
};

export const getReportsByUserId = async (req, res) => {

    try {
        // console.log(id);
        const id = req.params.id;

        const reports = await ReportModel.find({ userId: id });

        res.status(200).json({
            success: true,
            message: "Reports fetched Successfully",
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Fetching Reports",
            error,
        });
    }
};

export const getAllActivities = async (req, res) => {
    try {
        const reports = await ReportModel.find().sort({ reportDate: -1 });
        const userIds = [...new Set(reports.map((report) => report.userId).filter(Boolean))];
        const users = await UserModel.find(
            { _id: { $in: userIds } },
            { username: 1, email: 1 }
        );
        const userMap = Object.fromEntries(
            users.map((user) => [user._id.toString(), user])
        );

        const activities = reports.map((report) => {
            const plain = report.toObject();
            const user = userMap[plain.userId] || null;
            return {
                ...plain,
                username: user?.username || 'Unknown user',
                email: user?.email || 'N/A',
            };
        });

        res.status(200).json({
            success: true,
            message: 'All activities fetched successfully',
            activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in fetching activities',
            error,
        });
    }
};
