import { AppDataSource } from "./config/db.config";
import express from "express";
import userRouter from "./modules/user/user.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);

const PORT = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=>Server running on PORT:${PORT}`);
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  })