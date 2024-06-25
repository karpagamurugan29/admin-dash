const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected successfully");
  } catch (error) {
    console.error("Connection error:", error.message);
  }
};

dbConnect();
