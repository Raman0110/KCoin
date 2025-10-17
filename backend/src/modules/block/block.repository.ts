// src/modules/block/block.repository.ts
import { Repository } from "typeorm";
import { Block } from "./block.entity";
import { AppDataSource } from "../../config/db.config";

export class BlockRepository {
  private repo: Repository<Block> = AppDataSource.getRepository(Block);

  findAllWithTransactions = async () =>
    this.repo.find({ relations: ["transactions"], order: { index: "ASC" } });

  findLast = async () => {
    return this.repo.findOne({ order: { index: "DESC" }, relations: ["transactions"] });
  }

  save = async (block: Partial<Block>) => this.repo.save(block);
}
