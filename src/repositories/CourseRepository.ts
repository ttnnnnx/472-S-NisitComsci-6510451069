import { Course } from "@prisma/client";
import db from "../../app/utils/database.server"

class CourseRepository {
    // ดึงข้อมูล Course ตาม ID
    public async getCourseByID(course_id: string): Promise<Course | null> {
        return await db.course.findUnique({
            where: { course_id }
        });
    }

    // ดึงข้อมูล Course ทั้งหมด
    public async getAllCourse(): Promise<Course[]> {
        return await db.course.findMany();
    }
}

export default CourseRepository;
