// src/controllers/ReviewController.ts
import { Elysia, t } from "elysia";
import ReviewRepository from "../repositories/ReviewRepository";
import { Review } from "@prisma/client";
import { Role, User } from "@prisma/client";

const reviewController = new Elysia({
  prefix: "/review",
  tags: ["Review"],
});

// Schema (แก้ไขให้ตรงกับ Prisma Model)
reviewController.model({
  Review: t.Object({
    review_id: t.Number(), // Prisma ใช้ Int
    review_text: t.String(),
    rating: t.Number({ minimum: 0, maximum: 10 }), // ตรวจสอบให้คะแนนอยู่ในช่วง 0-10
    review_date: t.String(),
    user_uuid: t.String(),
    course_id: t.String(),
  }),
});

// ✅ GET all reviews (ดึงรีวิวทั้งหมด)
reviewController.get(
  "/all",
  async () => {
    const reviewRepository = new ReviewRepository();
    return await reviewRepository.getAllReviews();
  },
  {
    detail: {
      summary: "Get All Reviews",
      description: "Get all reviews from database",
    },
  }
);

// ✅ GET reviews by course ID (ดึงรีวิวของรายวิชา)
reviewController.get(
  "/course/:course_id",
  async ({ params }) => {
    const reviewRepository = new ReviewRepository();
    return await reviewRepository.getReviewsByCourse(params.course_id);
  },
  {
    detail: {
      summary: "Get Reviews by Course ID",
      description: "Get all reviews for a specific course",
    },
  }
);

// ✅ POST Add a new review (ให้นักศึกษาเพิ่มรีวิวได้)
reviewController.post(
  "/add",
  async ({ body }) => {
    const { uuid, course_id, rating, review_text } = body;
    
    // ตรวจสอบค่าคะแนนต้องอยู่ในช่วง 0-10
    if (rating < 0 || rating > 10) {
      throw new Error("Rating must be between 0 and 10");
    }

    const reviewRepository = new ReviewRepository();
    return await reviewRepository.addReview(course_id, uuid, rating, review_text);
  },
  {
    body: t.Object({
      course_id: t.String(),
      rating: t.Number({ minimum: 0, maximum: 10 }), // จำกัดค่า Rating ให้อยู่ระหว่าง 0-10
      review_text: t.String(),
      uuid: t.String(),
    }),
    detail: {
      summary: "Add Review",
      description: "Allow students to add a review to a course",
    },
  }
);

// ✅ DELETE Review (ลบรีวิวได้เฉพาะเจ้าของรีวิว)
reviewController.delete(
  "/delete/:id",
  async ({ params}) => {
    const reviewRepository = new ReviewRepository();
    return await reviewRepository.deleteReview(Number(params.id));
  },

  {
    detail: {
      summary: "Delete Review",
      description: "Allow users to delete their own review",
    },
  }
);

export default reviewController;