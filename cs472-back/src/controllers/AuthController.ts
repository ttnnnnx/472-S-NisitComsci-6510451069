import Elysia, { t } from "elysia";
import AuthRepository from "../repositories/AuthRepository";
import { PasswordResetToken } from "@prisma/client";

const AuthController = new Elysia({
  prefix: "/api/reset-password",
  tags: ["Reset Password"],
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
    const resetPasswordToken: PasswordResetToken[] =
      await authRepo.getAllTokens();
    return resetPasswordToken;
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
    const resetPasswordToken: PasswordResetToken | null =
      await authRepo.getResetToken(token);
    return resetPasswordToken ?? { error: "Token not found", status: 200 };
  },
  {
    params: t.Object({ token: t.String() }),
    detail: {
      summary: "Get Token",
      description: "Get token from database",
    },
  }
);

export default AuthController;
