export default class CourseRepository {
  // ดึงข้อมูล Course ทั้งหมด
  public async getAllCourse(): Promise<Course[]> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/course/all`);
    const data: Course[] = await response.json();
    return data;
  }

  public async createCourse(
    course_id: string,
    course_name: string,
    course_detail: string
  ): Promise<Course> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/api/course/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id, course_name, course_detail }),
    });
    const data: Course = await response.json();

    return data;
  }
}
