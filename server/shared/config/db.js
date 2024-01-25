const mongoose = require("mongoose");

const connectDB = async () => {
  try {
  //const conn = await mongoose.connect("mongodb/mongo-db"); //127.0.0.1:27017
   const conn = await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://connectLoom:connectLoom@loomdata.lwjdsu4.mongodb.net/');

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
};

module.exports = {connectDB};
