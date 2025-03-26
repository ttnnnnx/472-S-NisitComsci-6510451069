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

//get course ที่ต้องการพร้อมกันหลายตัว input = course_id1,course_id2,... ไม่ต้อง space
courseController.get(
  "/getList/:course_id",
  async ({params}) => {
    const courseRepository = new CourseRepository();

    const courseIds = params.course_id.split(",");
    const courses = await courseRepository.getCourseListById(courseIds);
    return courses;
  },
  {
    detail: {
      summary: "Get Course list by course_id",
      description: "Get list of Course from database by using course_id"
    }
  }
)

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
