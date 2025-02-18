import { Elysia, t } from "elysia";
import CourseRepository from "../repositories/CourseRepository";
import { Course } from "@prisma/client";

const courseController = new Elysia({
    prefix: "/api/course",
    tags: ["Course"]
});

// ✅ กำหนด Schema ของ Course
courseController.model({
    course_id: t.String(),
    course_name: t.String(),
    course_detail: t.String()
});

// ✅ API ดึงข้อมูล Course ทั้งหมด
courseController.get(
    "/all",
    async () => {
        const courseRepository = new CourseRepository();
        const courses: Course[] = await courseRepository.getAllCourses();
        return courses;
    },
    {
        detail: {
            summary: "Get All Courses", // API Name
            description: "Get all courses from database" // API Description
        }
    }
);

export default courseController;
