import { Elysia, t } from "elysia";
import UserRepository from "../repositories/UserRepository";
import { Role, User } from "@prisma/client";
import { pattern } from "isbot";

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
      ); //hash password
      newBody.password = password; //set password
      const user: User = await userRepository.createUser(newBody);
      return user;
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    body: t.Object({
      name: t.String({
        pattern: "^[a-zA-Z]*$",
        minLength: 2,
        maxLength: 15,
        error: {
          pattern: "Name must contain only characters",
          minLenght: "Name should has at least 2 characters",
          maxLenght: "Name should has at most 15 characters",
        },
      }),
      surname: t.String({
        pattern: "^[a-zA-Z]*$",
        minLength: 2,
        maxLength: 15,
        error: {
          pattern: "Surname must contain only characters",
          minLenght: "Surname should has at least 2 characters",
          maxLenght: "Surname should has at most 15 characters",
        },
      }),
      password: t.String({
        minLength: 8,
        maxLength: 12,
        pattern:
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,12}$',
        error: {
          minLength: "Password should have at least 8 characters",
          maxLength: "Password should have at most 12 characters",
          pattern:
            "Password should be 8-12 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        },
      }),
      email: t.String(),
      year: t.Number({
        minimum: 1,
        maximum: 8,
        error: {
          minimum: "Year should be 1-8",
          maximum: "Year should be 1-8"
        }
      }),
      role: t.Enum(Role),
      salt: t.Optional(t.String()),
    }),
    detail: {
      summary: "Create User",
      description: "Create new User in database",
    },
  }
);

export default UserController;
