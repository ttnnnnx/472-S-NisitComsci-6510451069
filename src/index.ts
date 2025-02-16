import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import userController from "./controllers/UserController"

const app = new Elysia();

app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: { title: "Nisit Com Sci", version: "1.0.0" },
      tags: [
        { name: "User", description: "User endpoint" },
      ],
    },
  })
);


app.use(userController);

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );