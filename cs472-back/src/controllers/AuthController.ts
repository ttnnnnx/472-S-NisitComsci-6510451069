import Elysia, { t } from "elysia";
import AuthRepository from "../repositories/AuthRepository";
import UserRepository from "../repositories/UserRepository";
import { PasswordResetToken } from "@prisma/client";

const AuthController = new Elysia({
  prefix: "/api/auth",
  tags: ["Auth"],
});

AuthController.model({
  PasswordResetToken: t.Object({
    id: t.Number(),
    user_uuid: t.String(),
    token: t.String(),
    expiresAt: t.Date(),
  }),
});

AuthController.get(
  "/getAll",
  async () => {
    const authRepo = new AuthRepository();
    const resetToken: PasswordResetToken[] = await authRepo.getAllTokens();
    return resetToken;
  },
  {
    detail: {
      summary: "Get All Token",
      description: "Get all token from database",
    },
  }
);

AuthController.get(
  "/getToken/:token",
  async ({ params: { token } }) => {
    const authRepo = new AuthRepository();
    const resetToken: PasswordResetToken | null = await authRepo.getResetToken(
      token
    );
    return resetToken ?? { error: "Token not found", status: 200 };
  },
  {
    params: t.Object({ token: t.String() }),
    detail: {
      summary: "Get Token",
      description: "Get token from database",
    },
  }
);

AuthController.post(
  "/forgot-password",
  async ({ body }) => {
    const userRepo = new UserRepository();
    const authRepo = new AuthRepository();

    const user = await userRepo.getUserByEmail(body.email);
    if (!user) return { error: "User not found" };

    const resetToken = await authRepo.generateResetToken(user.uuid);
    //TODO: send email with resetToken.token

    return resetToken;
  },
  {
    body: t.Object({
      email: t.String(),
    }),
    detail: {
      summary: "Request Password Reset",
      description:
        "Generates a password reset link and rend it to user's email",
    },
  }
);

AuthController.post(
  "/reset-password",
  async ({ body }) => {
    const userRepo = new UserRepository();
    const authRepo = new AuthRepository();

    const tokenEntry = await authRepo.getResetToken(body.token);
    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
      return { error: "Invalid or expired token" };
    }

    const updatedUser = await userRepo.updateUserPassword(
      tokenEntry.user_uuid,
      body.newPassword
    );
    await authRepo.deleteResetToken(body.token);

    return { message: "Password updated successfully", updatedUser: updatedUser };
  },
  {
    body: t.Object({
      token: t.String(),
      newPassword: t.String(),
    }),
    detail: {
      summary: "Reset Password",
      description: "Resets the user's password using a token.",
    },
  }
);

export default AuthController;
