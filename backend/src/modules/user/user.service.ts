import bcrypt from "bcryptjs";
import { AppDataSource } from "../../config/db.config";
import { User } from "./user.entity";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

type createUserDto = {
  email: string,
  password: string
}


export class UserService {
  private readonly userRepo = AppDataSource.getRepository(User);

  async createUser(userPayload: createUserDto) {
    if (!userPayload) throw new Error("Email and Password is missing");

    const { email, password } = userPayload;
    if (!email || !password) throw new Error("Both email and password are required")

    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) throw new Error("User already Exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const walletAddress = randomUUID();

    const user = this.userRepo.create({
      email, password: hashedPassword, walletAddress
    })

    await this.userRepo.save(user);

    const { password: _, ...newUser } = user;

    return newUser
  }

  async loginUser(loginPayload: createUserDto) {
    if (!loginPayload) throw new Error("Email and Password is missing")

    const { email, password } = loginPayload;
    if (!email || !password) throw new Error("Both email and password are required")

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error("Invalid Credentials")

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) throw new Error("Invalid Credentials")

    const { password: _, ...userDetails } = user;
    const token = await jwt.sign(userDetails, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
    return token;
  }
}