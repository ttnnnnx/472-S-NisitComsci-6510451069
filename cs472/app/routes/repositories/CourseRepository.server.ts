export default class CourseRepository {
  // ดึงข้อมูล Course ทั้งหมด
  public async getAllCourse(): Promise<Course[]> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/course/all`);
    const data: Course[] = await response.json();
    return data;
  }
}
