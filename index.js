import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/user/", userRouter);
app.get("/", (req, res) => {
  res.send("WELCOME TO MY PROGRESS API");
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`The server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
