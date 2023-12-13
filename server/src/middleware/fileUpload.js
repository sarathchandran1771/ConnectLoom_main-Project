//fileUpload.js
const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

const uploadFile = async (type, timestamp, signature, file) => {
  const folder = type === "image" ? "images" : "videos";

  const data = new FormData();
  data.append("file", file);
  data.append("timestamp", timestamp);
  data.append("signature", signature);
  data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
  data.append("folder", folder);
console.log("data from file upload", data)
  try {
    const api = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${type}/upload`;

    // Using promisify to convert axios.post into a promise-based function
    const axiosPostAsync = promisify(axios.post);
    const res = await axiosPostAsync(api, data); 

    const { secure_url } = res.data;
    console.log("secure_url",secure_url);
    return secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to Cloudinary");
  }
};

module.exports = uploadFile;
