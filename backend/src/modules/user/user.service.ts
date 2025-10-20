import bcrypt from "bcryptjs";
import { AppDataSource } from "../../config/db.config";
import { User } from "./user.entity";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { BlockService } from "../block/block.service";
import { PendingTransactionService } from "../pendingTransaction/pendingTransaction.service";
import { AppError } from "../../utils/app-error";

type createUserDto = {
  email: string,
  password: string
}

export class UserService {
  private readonly blockService = new BlockService();
  private readonly pendingTransactionService = new PendingTransactionService();
  private readonly userRepo = AppDataSource.getRepository(User);

  private readonly GENESIS_AMOUNT = 5;
  private readonly SYSTEM_ADDRESS = "00";

  createUser = async (userPayload: createUserDto) => {
    if (!userPayload) throw new AppError("Email and Password is missing", 400);

    const { email, password } = userPayload;
    if (!email || !password) throw new AppError("Both email and password are required", 400)

    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) throw new AppError("User already Exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const walletAddress = `KC-${randomUUID()}`;

    const user = this.userRepo.create({
      email, password: hashedPassword, walletAddress
    })

    await this.userRepo.save(user);

    const totalUser = await this.userRepo.count();

    if (totalUser === 1) {
      await this.initializeNewUser(walletAddress);
    }

    const { password: _, ...newUser } = user;

    return newUser
  }


  private initializeNewUser = async (walletAddress: string) => {
    try {
      await this.pendingTransactionService.addPendingTransaction({
        senderAddress: this.SYSTEM_ADDRESS,
        recipientAddress: walletAddress,
        amount: this.GENESIS_AMOUNT,
      });
    } catch (error) {
      console.error("Failed to create genesis transaction:", error);
    }
  }

  loginUser = async (loginPayload: createUserDto) => {
    if (!loginPayload) throw new AppError("Email and Password is missing", 400)

    const { email, password } = loginPayload;
    if (!email || !password) throw new AppError("Both email and password are required", 400)

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid Credentials", 400)

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) throw new AppError("Invalid Credentials", 400)

    const { password: _, ...userDetails } = user;
    const token = await jwt.sign(userDetails, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
    return token;
  }

  getWallet = async (user: Partial<User>) => {
    if (!user) throw new AppError("User details not found", 400);

    let userBalance = await this.blockService.calculateAvailableBalance(user.walletAddress as string);

    return {
      walletAddress: user.walletAddress,
      balance: userBalance
    };
  }

  getDashboardStat = async () => {
    const totalPendingTransaction = await this.pendingTransactionService.getPendingTransactionCount();
    const totalBlocks = await this.blockService.getBlockChainCount();
    return { totalPendingTransaction, totalBlocks }
  }
}