import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Block } from "../block/block.entity";


@Entity("Transaction")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  senderAddress: string;

  @Column()
  recipientAddress: string;

  @Column("decimal")
  amount: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.sentTransactions)
  sender: User

  @ManyToOne(() => User, (user) => user.receivedTransactions)
  recipient: User;

  @ManyToOne(() => Block, (block) => block.transactions, {
    onDelete: "SET NULL",
    nullable: true,
  })
  block: Block;
}