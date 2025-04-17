import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routers/authRouter.js";

dotenv.config();

const app = express();

app.get("/", function (req, res) {
  res.send("hello world");
});

app.use("/api/auth", authRouter);

const start = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected");
    app.listen(process.env.PORT, function () {
      console.log("server is ready");
    });
  } catch (error) {
    console.log("Error connecting to Database: ", error.message);
    process.exit(1);
  }
};

start();
