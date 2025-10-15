import { Request, Response } from "express";
import { BlockService } from "./block.service";


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
      res.status(400).json({ success: false, message: error.message });
    }
  }
}