require("dotenv").config();
const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.fvxtj.mongodb.net/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Connected to Database: ", DB_NAME);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = dbConnection;
