import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Block } from "../block/block.entity";


@Entity("Transaction")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar" })
  senderAddress: string;

  @Column({ type: "varchar" })
  recipientAddress: string;

  @Column("decimal")
  amount: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.sentTransactions, {
    nullable: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: "senderAddress", referencedColumnName: "walletAddress" })
  sender?: User;

  @ManyToOne(() => User, (user) => user.receivedTransactions, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: "recipientAddress", referencedColumnName: "walletAddress" })
  recipient?: User;

  @ManyToOne(() => Block, (block) => block.transactions, {
    onDelete: "SET NULL",
    nullable: true,
  })
  block: Block;
}