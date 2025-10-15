import { Entity } from "typeorm";
import { Transaction } from "../transaction/transaction.entity";

@Entity("PendingTransaction")
export class PendingTransaction extends Transaction { }