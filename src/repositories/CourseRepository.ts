import { Course } from "@prisma/client";
import db from "./database.server"

class CourseRepository {
    public async getCourseByID(uuid: string): Promise<Course | null> {
        return await db.user.findUnique({
            where: { uuid }
        });
    }

    public async getAllCourses(): Promise<Course[]> {
        return await db.course.findMany();
    }
}

export default CourseRepository;