import { Request, Response } from "express";
import { BlockService } from "./block.service";
import { AppError } from "../../utils/app-error";


export class BlockController {
  private blockService = new BlockService()

  getChain = async (req: Request, res: Response) => {
    const chain = await this.blockService.getBlockchain();
    res.json({ success: true, chain });
  }

  mine = async (req: Request, res: Response) => {
    try {
      const { walletAddress } = (req as any).user;
      const newBlock = await this.blockService.mineBlock(walletAddress);

      res.status(201).json({ success: true, newBlock });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}