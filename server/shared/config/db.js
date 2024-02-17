const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongo_URL || 'mongodb+srv://connectLoom:connectLoom@loomdata.lwjdsu4.mongodb.net/');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
};

module.exports = {connectDB};
