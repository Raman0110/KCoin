import { Router } from "express"
import { UserController } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken.middleware";

const router = Router();

const userController = new UserController();

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/test", verifyToken, (req, res) => {
  res.status(200).json({ message: "Hello" })
})

export default router;