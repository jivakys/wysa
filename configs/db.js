const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connection;
