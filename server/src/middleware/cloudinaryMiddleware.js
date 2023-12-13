//middleware/cloudinarymiddleware.js

const { cloudinary } = require("../../shared/config/cloudinaryConfig.js");

const generateSignature = (req, res, next) => { 

  const { cloudinaryData } = req.body;

 if (!cloudinaryData) {
  res.status(400);
  return next(new Error("cloudinaryData is required"));
}

const { folder } = cloudinaryData;

// Check if folder is present in cloudinaryData
if (!folder) {
  console.log("folder is required");
  res.status(400);
  return next(new Error("folder name is required"));
}
 try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("timestamp & signature",timestamp, signature);

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.log("folder name error", error);
    res.status(500);
    next("500", error);
  }
};

module.exports = generateSignature;
