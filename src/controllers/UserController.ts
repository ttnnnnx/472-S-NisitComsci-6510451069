import { Elysia, t } from "elysia";
import UserRepository from "../repositories/UserRepository";
import { Role, User } from "@prisma/client";

const UserController = new Elysia({
  prefix: "/api/user",
  tags: ["User"],
});

UserController.model({
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

UserController.get(
  "/getAll",
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

UserController.get(
  "/get/:id",
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

UserController.post(
  "/create",
  async ({ body }) => {
    const userRepository = new UserRepository();
    try {
      body.salt === undefined
        ? (body.salt = Math.random().toString(36).substring(2, 12))
        : ""; //generate random
      const newBody = { ...body, salt: body.salt };
      const password = await Bun.password.hash(
        newBody.password + newBody.salt,
        "bcrypt"
      );//hash password
      newBody.password = password; //set password
      const user: User = await userRepository.createUser(newBody);
      return user;
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      surname: t.String(),
      password: t.String(),
      email: t.String(),
      year: t.Number(),
      role: t.Enum(Role),
      salt: t.Optional(t.String()),
    }),
  }
);

export default UserController;
