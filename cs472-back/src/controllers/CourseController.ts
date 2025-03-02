// src/controllers/CourseController.ts
import { Elysia, t } from "elysia";
import CourseRepository from "../repositories/CourseRepository";
import { Course } from "@prisma/client";

const courseController = new Elysia({
  prefix: "/course", // Changed from "/api/course" to just "/course"
  tags: ["Course"],
});

// Schema
courseController.model({
  course_id: t.String(),
  course_name: t.String(),
  course_detail: t.String(),
});

// GET all courses
courseController.get(
  "/all",
  async () => {
    const courseRepository = new CourseRepository();
    const courses: Course[] = await courseRepository.getAllCourse();
    return courses;
  },
  {
    detail: {
      summary: "Get All Courses",
      description: "Get all courses from database",
    },
  }
);

//Create a course
courseController.post(
  "/create",
  async ({ body }) => {
    const courseRepository = new CourseRepository();
    const course: Course = {
      course_id: body.course_id,
      course_name: body.course_name,
      course_detail: body.course_detail,
    };
    const newCourse: Course = await courseRepository.createCourse(course);
    return newCourse;
  },
  {
    body: t.Object({
      course_id: t.String(),
      course_name: t.String(),
      course_detail: t.String(),
    }),
    detail: {
      summary: "Create a Course",
      description: "Create a course in database",
    },
  }
);

export default courseController;
