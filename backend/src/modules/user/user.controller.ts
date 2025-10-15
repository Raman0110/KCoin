import { Request, Response } from "express";
import { UserService } from "./user.service";



export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    try {
      const userPayload = req.body;
      const user = await this.userService.createUser(userPayload);

      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        user: user
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  loginUser = async (req: Request, res: Response) => {
    try {
      const loginPayload = req.body;
      const token = await this.userService.loginUser(loginPayload);

      res.cookie('token', token,
        {
          maxAge: 3600000,
          httpOnly: true,
          secure: false
        }).json({
          success: true,
          message: "Login successful"
        });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  getWallet = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const walletDetails = await this.userService.getWallet(user);

      res.status(200).json(walletDetails);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }
}