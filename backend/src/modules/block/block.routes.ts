import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

const router = Router();
const blockchainController = new BlockController(new BlockService());

router.get("/chain", verifyToken, blockchainController.getChain);
router.post("/mine", verifyToken, blockchainController.mine);

export default router;
