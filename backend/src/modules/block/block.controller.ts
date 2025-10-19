import { Request, Response } from "express";
import { BlockService } from "./block.service";
import { AppError } from "../../utils/app-error";
import { AuthenticatedRequest } from "../block/block.types"


export class BlockController {
  constructor(private blockService: BlockService) { }

  getChain = async (req: Request, res: Response) => {
    const chain = await this.blockService.getBlockchain();
    res.json({ success: true, chain });
  }

  mine = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const walletAddress = req.user?.walletAddress;

      if (!walletAddress) {
        throw new AppError('Authentication required', 401);
      }

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