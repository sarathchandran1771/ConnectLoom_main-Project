// routes/adminRoutes/adminRoutes.js
const express = require('express');
const adminRouter = express.Router();

const adminControllers = require('../../controllers/admin/adminControllers')

adminRouter.post('/adminLogin', adminControllers.getAdminLogin);

adminRouter.post("/logout", adminControllers.AdminLogout);

adminRouter.get("/userData", adminControllers.getAllUsers);

adminRouter.patch("/updateUserStatus", adminControllers.updateUserStatus);

adminRouter.get("/reportedPost", adminControllers.getReportedPost);

adminRouter.patch("/updatePostStatus", adminControllers.updatePostStatus);


module.exports = adminRouter;
