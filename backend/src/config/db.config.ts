import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../modules/user/user.entity";
import { Transaction } from "../modules/transaction/transaction.entity";
import { Block } from "../modules/block/block.entity";
import { PendingTransaction } from "../modules/pendingTransaction/pendingTransaction.entity";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add your hosted PostgreSQL connection string to the Render service environment variables."
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  synchronize: true,
  logging: false,
  entities: [User, Transaction, Block, PendingTransaction]
})
