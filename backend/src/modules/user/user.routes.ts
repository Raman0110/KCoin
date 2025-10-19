import { Router } from "express"
import { UserController } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken.middleware";
import { UserService } from "./user.service";

const router = Router();

const userController = new UserController(new UserService());

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post("/logout", verifyToken, userController.logout)
router.get("/getWallet", verifyToken, userController.getWallet)
router.get("/getDashboard", verifyToken, userController.getDashboardStat)

export default router;