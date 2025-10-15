import { DataSource } from "typeorm";
import { User } from "../modules/user/user.entity";
import { Transaction } from "../modules/transaction/transaction.entity";
import { Block } from "../modules/block/block.entity";
import { PendingTransaction } from "../modules/pendingTransaction/pendingTransaction.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Transaction, Block, PendingTransaction]
})