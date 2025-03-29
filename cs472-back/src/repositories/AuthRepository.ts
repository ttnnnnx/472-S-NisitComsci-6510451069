import { PasswordResetToken } from "@prisma/client";
import db from "../database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomBytes } from "crypto";

export interface AuthCookie {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  year: number;
}

class AuthRepository {
  public async generateResetToken(userId: string) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(); //current date
    expiresAt.setHours(expiresAt.getHours() + 1); //+1 hour to current date

    return await db.passwordResetToken.upsert({
      where: { user_uuid: userId }, // Find the reset token by userId
      update: { token, expiresAt }, // If found, update token and expiry time
      create: { user_uuid: userId, token, expiresAt }, // If not found, create a new token entry
    });
  }

  public async getResetToken(token: string) {
    return await db.passwordResetToken.findUnique({
      where: { token },
    });
  }

  public async getAllTokens(){
    return await db.passwordResetToken.findMany();
  }

  // public async getUserFromToken(token: string): Promise<AuthCookie | null> {
  //   try {
  //     // Decode token จาก base64 กลับมาเป็น JSON string
  //     const decodedString = Buffer.from(token, 'base64').toString('utf8');
  //     // Parse JSON string เพื่อให้ได้ object ที่ตรงกับ AuthCookie
  //     const user = JSON.parse(decodedString) as AuthCookie;
  //     return user;
  //   } catch (error) {
  //     // หากเกิดข้อผิดพลาดในการ decode หรือ parse ให้คืนค่า null
  //     return null;
  //   }
  // }

  // public async getUserIdFromToken(token: string): Promise<string | null> {
  //   const resetToken = await db.passwordResetToken.findUnique({
  //     where: { token },
  //     select: { user_uuid: true },
  //   });

  //   return resetToken ? resetToken.user_uuid : null;
  // }


  public async deleteResetToken(
    token: string
  ): Promise<PasswordResetToken | null> {
    try {
      const response = await db.passwordResetToken.delete({
        where: { token },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new Error("Record does not exists.");
          default:
            throw new Error(error.code);
        }
      }
    }
    throw new Error("Internal Server Error");
  }
}

export default AuthRepository;