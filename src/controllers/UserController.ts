import { Elysia, t } from "elysia";
import UserRepository from "../repositories/UserRepository";
import { User } from "@prisma/client";

const userController = new Elysia({
  prefix: "/api/user",
  tags: ["User"],
});

userController.model({
  User: t.Object({
    uuid: t.String(),
    name: t.String(),
    surname: t.String(),
    password: t.String(),
    email: t.String(),
    year: t.Number(),
    role: t.Enum({ student: "student", teacher: "teacher" }),
    salt: t.String(),
  }),
});

userController.get(
  "/all",
  async () => {
    const userRepository = new UserRepository();
    const users: User[] = await userRepository.getAllUsers();
    return users;
  },
  {
    detail: {
      summary: "Get All User", //API Name
      description: "Get all user from database", //API Description
    },
  }
);

userController.get(
  "/byID",
  async ({ params: { id } }) => {
    const userRepository = new UserRepository();
    const user: User | null = await userRepository.getUserByID(id);
    return user ?? { error: "User not found", status: 200 };
  },
  {
    params: t.Object({ id: t.String() }),
    detail: {
      summary: "Get User By ID",
      description: "Get user by id from database",
    },
  }
);

export default userController;
