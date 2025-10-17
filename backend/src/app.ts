import { AppDataSource } from "./config/db.config";
import express from "express";
import userRouter from "./modules/user/user.routes";
import blockRouter from "./modules/block/block.routes";
import transactionRouter from "./modules/transaction/transaction.route";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/block", blockRouter);
app.use("/transactions", transactionRouter);

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