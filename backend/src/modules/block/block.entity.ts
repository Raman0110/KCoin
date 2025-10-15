import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Transaction } from "../transaction/transaction.entity";

@Entity("Block")
export class Block {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  index: number;

  @Column()
  previousHash: string;

  @Column()
  hash: string;

  @Column()
  nonce: number;

  @Column({ nullable: true })
  minerAddress: string;

  @CreateDateColumn()
  timestamp: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.block, {
    cascade: true,
  })
  transactions: Transaction[];
}