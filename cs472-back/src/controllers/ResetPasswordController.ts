import Elysia, { t } from "elysia";
import ResetPasswordRepository from "../repositories/ResetPasswordRepository";
import { PasswordResetToken } from "@prisma/client";

const ResetPasswordController = new Elysia({
  prefix: "/api/reset-password",
  tags: ["Reset Password"],
});

ResetPasswordController.model({
  PasswordResetToken: t.Object({
    id: t.Number(),
    user_uuid: t.String(),
    token: t.String(),
    expiresAt: t.Date(),
  }),
});

ResetPasswordController.get(
  "/getAll",
  async () => {
    const resetPasswordRepo = new ResetPasswordRepository();
    const resetPasswordToken: PasswordResetToken[] =
      await resetPasswordRepo.getAllTokens();
    return resetPasswordToken;
  },
  {
    detail: {
      summary: "Get All Token",
      description: "Get all token from database",
    },
  }
);

ResetPasswordController.get(
  "/getToken/:token",
  async ({ params: { token } }) => {
    const resetPasswordRepo = new ResetPasswordRepository();
    const resetPasswordToken: PasswordResetToken | null =
      await resetPasswordRepo.getResetToken(token);
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

export default ResetPasswordController;
