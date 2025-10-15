import { Request, Response } from "express";
import { UserService } from "./user.service";


const userService = new UserService();

export class UserController {

  async createUser(req: Request, res: Response) {
    try {
      const userPayload = req.body;
      const user = await userService.createUser(userPayload);

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

  async loginUser(req: Request, res: Response) {
    try {
      const loginPayload = req.body;
      const token = await userService.loginUser(loginPayload);

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
}