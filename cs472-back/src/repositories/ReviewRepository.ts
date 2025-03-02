// src/repositories/ReviewRepository.ts
import { Review } from "@prisma/client";
import db from "../database";

class ReviewRepository {
  // ✅ ดึงข้อมูล Review ตาม ID
  public async getReviewByID(review_id: number): Promise<Review | null> {
    return await db.review.findUnique({
      where: { review_id },
    });
  }

  // ✅ ดึงข้อมูล Review ทั้งหมด
  public async getAllReviews(): Promise<Review[]> {
    return await db.review.findMany();
  }

  // ✅ ดึงรีวิวทั้งหมดของรายวิชาหนึ่ง ๆ
  public async getReviewsByCourse(course_id: string): Promise<Review[]> {
    return await db.review.findMany({
      where: { course_id },
    });
  }

  // ✅ เพิ่มรีวิวใหม่ (เฉพาะนักศึกษา)
  public async addReview(
    course_id: string,
    user_uuid: string,
    rating: number,
    review_text: string
  ): Promise<Review> {
    return await db.review.create({
      data: {
        course_id,
        user_uuid,
        rating,
        review_text,
        review_date: new Date(), // บันทึกวันที่รีวิวอัตโนมัติ
      },
    });
  }

  // ✅ ลบรีวิว (เฉพาะเจ้าของรีวิว)
  public async deleteReview(
    review_id: number,
    // user_uuid: string
  ): Promise<Review | null> {
    const review = await db.review.findUnique({
      where: { review_id },
    });

    if (!review) throw new Error("Review not found");

    // if (review.user_uuid !== user_uuid) {
    //   throw new Error("You are not authorized to delete this review");
    // }

    return await db.review.delete({
      where: { review_id },
    });
  }
}

export default ReviewRepository;

