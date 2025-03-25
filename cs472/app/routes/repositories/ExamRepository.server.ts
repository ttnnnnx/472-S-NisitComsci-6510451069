export default class ExamRepository {
  public async createExam(
    course_id: string,
    date: Date,
    room: string
  ): Promise<Exam> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/api/exam/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id, date, room }),
    });
    const data: Exam = await response.json();
    return data;
  }
}
