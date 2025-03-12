import { Exam } from "@prisma/client";

import db from "../database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class ExamRepository {
  public async getExamById(exam_id: number): Promise<Exam | null> {
    return await db.exam.findUnique({
      where: { exam_id },
    });
  }

  public async getAllExams(): Promise<Exam[]> {
    return await db.exam.findMany();
  }

  public async createExam({
    course_id,
    date,
    room,
  }: {
    course_id: string;
    date: Date;
    room: string;
  }): Promise<Exam> {
    try {
      const response = await db.exam.create({
        data: {
          course_id: course_id,
          date: date,
          room: room,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          default:
            throw new Error("Internal Server Error");
        }
      }
    }
    throw new Error("Internal Server Error");
  }

  public async deleteExam(exam_id: number): Promise<Exam | null> {
    try {
      const response = await db.exam.delete({
        where: { exam_id: exam_id },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new Error("Record does not exists.");
          default:
            throw new Error(error.code);
        }
      }
    }
    throw new Error("Internal Server Error");
  }
}

export default ExamRepository;
