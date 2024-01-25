const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const app = express()
const dotenv = require('dotenv');
dotenv.config();


const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY
    }
  });



const uploadPhoto = async (req, res) => {
  try {
    if (!req.body || !req.body.image) {
      return res.status(400).json({ error: 'Image data is missing in the request body' });
    }
    const imageData = req.body.image;

    // Convert base64 data to a buffer
    const buffer = Buffer.from(imageData, 'base64');

    // Upload the buffer to S3
    const uploadResult = await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKETNAME,
        Key: Date.now().toString(),
        Body: buffer,
      })
    );

    console.log('File uploaded successfully:', uploadResult);

    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = uploadPhoto;




//const upload = multer({
  //   storage: multerS3({
  //     s3: s3,
  //     bucket: process.env.S3_BUCKETNAME,
  //     metadata: function (req, file, cb) {
  //       cb(null, {fieldName: file.fieldname});
  //     },
  //     key: function (req, file, cb) {
  //       cb(null, Date.now().toString())
  //     }
  //   })
  // })