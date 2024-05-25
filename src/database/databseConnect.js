/* eslint-disable no-console */
/* eslint-disable no-undef */
const mongoose = require("mongoose");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.d8yzbln.mongodb.net/TaskDB?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(process.env.DBUSER);

// `mongodb+srv://${process.env.DBUser}:${process.env.DBPass}@cluster0.d8yzbln.mongodb.net/soeDB?retryWrites=true&w=majority`

// Connect using Mongoose
async function connectWithMongoose() {
  try {
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("Error connecting with Mongoose:", error);
    throw error;
  }
}

module.exports = { connectWithMongoose };
