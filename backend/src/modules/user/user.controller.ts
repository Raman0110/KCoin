import { Request, Response } from "express";
import { UserService } from "./user.service";
import { AppError } from "../../utils/app-error";
import { AuthenticatedRequest } from "../block/block.types";



export class UserController {
  constructor(private userService: UserService) { }

  private readonly authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const userPayload = req.body;
      const user = await this.userService.createUser(userPayload);

      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        user,
      });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };


  loginUser = async (req: Request, res: Response) => {
    try {
      const loginPayload = req.body;
      const token = await this.userService.loginUser(loginPayload);

      res.cookie('token', token,
        {
          ...this.authCookieOptions,
          maxAge: 3600000,
        }).json({
          success: true,
          message: "Login successful"
        });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  getWallet = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError('Authentication required', 401);
      }

      const walletDetails = await this.userService.getWallet(user);

      res.status(200).json(walletDetails);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("token", {
        ...this.authCookieOptions,
      });

      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Logout failed" });
    }
  };

  getDashboardStat = async (req: Request, res: Response) => {
    try {
      const { totalPendingTransaction, totalBlocks } = await this.userService.getDashboardStat();
      res.status(200).json({
        success: true,
        totalPendingTransaction,
        totalBlocks
      })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to fetch" });
    }
  }
}
