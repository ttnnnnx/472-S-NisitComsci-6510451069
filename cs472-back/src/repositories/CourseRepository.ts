import { Course } from "@prisma/client";
import db from "../database";

class CourseRepository {
  // ดึงข้อมูล Course ตาม ID
  public async getCourseByID(course_id: string): Promise<Course | null> {
    return await db.course.findUnique({
      where: { course_id }
    });
  }

  public async getCourseByName(course_name: string): Promise<Course|null> {
    return await db.course.findUnique({
      where: { course_name: course_name }
    });
  }

  public async getCourseListById(course_id: string[]): Promise<Course[]|null> {
    return await db.course.findMany({
      where: {course_id: {in: course_id}}
    });
  }

  // ดึงข้อมูล Course ทั้งหมด
  public async getAllCourse(): Promise<Course[]> {
    return await db.course.findMany();
  }

  // สร้าง Course
  public async createCourse(course: Course): Promise<Course> {
    // console.log("Course Data to Create:", course);
    return await db.course.create({
      data: course
    });
  }
}

export default CourseRepository;