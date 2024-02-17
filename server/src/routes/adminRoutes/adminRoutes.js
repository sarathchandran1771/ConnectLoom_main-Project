// routes/adminRoutes/adminRoutes.js
const express = require('express');
const multer = require('multer');
const adminRouter = express.Router();
const upload = multer();

const S3Middleware = require('../../middleware/S3-UploadMiddleware')
const adminControllers = require('../../controllers/admin/adminControllers')

const protect = require('../../middleware/adminAuthMiddleWare')

adminRouter.post('/adminLogin', adminControllers.getAdminLogin);

adminRouter.post("/logout", adminControllers.AdminLogout);

adminRouter.get("/userData", protect, adminControllers.getAllUsers);

adminRouter.patch("/updateUserStatus",protect, adminControllers.updateUserStatus);

adminRouter.get("/reportedPost", adminControllers.getReportedPost);

adminRouter.patch("/updatePostStatus", adminControllers.updatePostStatus);


adminRouter.post("/uploadPhoto", S3Middleware.upload.single('file'), adminControllers.uploadPhoto);

adminRouter.get("/get-adToUser", adminControllers.getUploadedAdToUser);

adminRouter.get("/get-ad", adminControllers.getUploadedAdvertisement);

adminRouter.get("/get-premiumUsers", adminControllers.getPremiumUsers);

adminRouter.delete('/Delete-ad/:postId', adminControllers.deleteAdPost);

adminRouter.patch("/edit-AdPost", S3Middleware.upload.single('file'), adminControllers.editAdPost);


  
module.exports = adminRouter;


