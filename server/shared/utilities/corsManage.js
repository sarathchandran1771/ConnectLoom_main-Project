//../../../shared/utilities/corsManage

const express = require("express");
const cors = require('cors');
const corsManage = express.Router();


const corsOptions = {
    credentials: true,
    origin: '*',
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
};

corsManage.use(cors(corsOptions));

module.exports = corsManage;



// const express = require("express");
// const cors = require('cors');
// const corsManage = express.Router();

// // Allow only specific origins
// const allowedOrigins = ['http://localhost:3000', 'https://localhost:3000'];

// // Move the cors middleware to be applied 
// corsManage.use(cors({
//     credentials: true,
//     origin: function (origin, callback) {
//         // Check if the origin is in the allowedOrigins array or if it's undefined (allow if same-origin)
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
// }));

// module.exports = corsManage;
