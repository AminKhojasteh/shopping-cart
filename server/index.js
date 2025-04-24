import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routers/authRouter.js";

// this is neccessary for using environment variables
dotenv.config();

// creating an express app
const app = express();

// allows us to parse incoming requests (data should be in the format of JSON): req.body
app.use(express.json());

app.get("/", function (req, res) {
  res.send("hello Morteza");
});

// routes
app.use("/api/auth", authRouter);

// connecting to DB and starting server
const PORT = process.env.PORT || 3000;
const startServer = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected");
    app.listen(PORT, function () {
      console.log(`server is ready on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to Database: ", error.message);
    process.exit(1);
  }
};

startServer();
