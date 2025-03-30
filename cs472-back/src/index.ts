import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import userController from "./controllers/UserController";
import courseController from "./controllers/CourseController";
import reviewController from "./controllers/ReviewController";
import enrollmentController from "./controllers/EnrollmentController";
import examController from "./controllers/ExamController"
import authController from "./controllers/AuthController";
import teachController from "./controllers/TeachController";
import sectionFormController from "./controllers/SectionFormController";

const app = new Elysia();

app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: { title: "Nisit Com Sci", version: "1.0.0" },
      tags: [
        { name: "User", description: "User endpoint" },
        { name: "Course", description: "Course endpoint" },
        { name: "Review", description: "Review endpoint" },
        { name: "Enrollment", description: "Enrollment endpoint" },
        { name: "Auth", description: "Auth endpoint" },
        { name: "Teach", description: "Teach endpoint" },
        { name: "sectionForm", description: "sectionForm endpoint"},
      ],
    },
  })
);

app.use(userController);
app.use(courseController);
app.use(reviewController);
app.use(enrollmentController);
app.use(examController);
app.use(authController);
app.use(teachController);
app.use(sectionFormController)

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
