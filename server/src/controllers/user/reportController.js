// server/src/controllers/post/reportController.js
const express = require("express");
const postRouter = express.Router();
const corsManage = require("../../../shared/utilities/corsManage");
const User = require("../../models/userSchema");
const ReportedUser = require("../../models/reportSchema/userReportSchema");
const dotenv = require("dotenv");

dotenv.config();

postRouter.use(corsManage);

const reportOnUserProfile = async (req, res) => {
    const { reportedUser, reportedBy, reportReason } = req.body;

    try {
        const user = await User.findOne({ _id: reportedUser, isVerified: true });
        if (!user) {
            console.error("User does not exist or is not verified");
            return res.status(404).json({ message: "User does not exist or is not verified" });
        }
       
        // Check if the user has already reported the comment
        const existingReport = await ReportedUser.findOne({
            'reportedBy': reportedBy,
            'reportedUser': reportedUser,
        });

        if (existingReport) {
            return res.status(200).json({ message: "Already reported this user" });
        }

        const reportedUserUpdateData = await ReportedUser.create({
                reportedBy: reportedBy,
                reportReason: reportReason,     
                reportedUser: reportedUser,
        });

        // Update the isReported field in the User schema
        user.isReported.push(reportedUserUpdateData._id);
        await user.save();
        return res.status(200).json({ message: "user reported successfully"});

    } catch (error) {
        console.error("Error reporting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { 
    reportOnUserProfile,
 };
