import { PasswordResetToken } from "@prisma/client";
import db from "../database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomBytes } from "crypto";

export class PasswordResetRepository {
  public async generateResetToken(userId: string) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

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
