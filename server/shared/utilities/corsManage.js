//../../../shared/utilities/corsManage
const express = require("express");
const cors = require('cors');
const corsManage = express.Router();

// Move the cors middleware to be applied 
corsManage.use(cors({
    credentials:true,
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
}));

module.exports = corsManage;

