import { Elysia, t } from "elysia";
import UserRepository from "../repositories/UserRepository";
import { User } from "@prisma/client";

const userController = new Elysia({
    prefix: "/api/user",
    tags: ["User"]
})

userController.model({
    uuid: t.String(),
    username: t.String(),
    email: t.String(),
    password: t.String(),
    name: t.String(),
    surname: t.String()
})

userController.get(
    "/all",
    async () => {
        const userRepository = new UserRepository();
        const users: User[]  = await userRepository.getAllUsers();
        return users;
    },
    {
        detail: {
            summary: "Get All User", //API Name
            description: "Get all user from database" //API Description
        }
    }
);

export default userController;