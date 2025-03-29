import MenuBar from "./components/MenuBar";
import ReviewRepository from "./repositories/ReviewRepository.server";
import CourseRepository from "./repositories/CourseRepository.server";
import React, { useEffect, useState } from "react";
import { type LoaderFunctionArgs, Link, redirect, useLoaderData, type LoaderFunction } from "react-router";
import { authCookie } from "~/utils/session.server";

// Loader function to handle data fetching before rendering the component
export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  const courseRepository = new CourseRepository();
  const courses: Course[] = await courseRepository.getAllCourse();
  const reviewRepository = new ReviewRepository();
  const url = new URL(request.url);
  const course_id = url.searchParams.get("course_id") ?? "";
  const reviews = await reviewRepository.getReviewsByCourse(course_id);
  const course = courses.filter(course => course.course_id === course_id);
  // console.log("✅ Loaded course_id:", course_id);
  // console.log("✅ Loaded course:", course);
  // console.log("✅ Loaded Reviews:", reviews);

  return { user, reviews, course};
};

const CourseReviews: React.FC = () => {
  // Use `useLoaderData` to get the loaded data from the loader
  const { user, reviews, course } = useLoaderData<{ user: User, reviews: Review[], course: Course[] }>();
  
  let total = 0;
  reviews.forEach((review) => {
    total += review.rating;  // Assuming review.rating is the score you want to average
  });

  const averageScore = reviews.length > 0 ? total / reviews.length : 0;

  // const time = new Date(reviews.review_date) รอตัดสินใจว่าจะใช้รูปแบบเวลาแบบไหน

  return (
    <div className="flex">
      <MenuBar user={user} />
      <div className="bg-[#C0E0FF] h-screen w-screen p-6 relative mx-auto overflow-y-auto border">
        {/* Course Header */}
        <div className="bg-white p-4 mb-4 rounded-2xl w-full">
          <h1 className="text-lg font-bold text-[#0f1d2a]">{course[0].course_id} {course[0].course_name}</h1>
        </div>

        {/* Course Description */}
        <div className="bg-white p-4 mb-4 rounded-2xl w-full">
          <p>{course[0].course_detail}</p>
        </div>

        {/* Buttons */}
        <div className="flex mb-4">
          <button className="bg-[#7793AE] hover:bg-[#43586c] text-white px-4 py-2 mr-2 rounded-2xl transition">
            รีวิวทั้งหมด
          </button>
          <button className="bg-[#7793AE] hover:bg-[#43586c] text-white px-4 py-2 mr-2 rounded-2xl transition">
            คะแนนรวมวิชานี้ : {averageScore}/10
          </button>
          <Link to={`/create-review?course_id=${course[0].course_id}`}>
            <button className="bg-[#61815D] text-white px-4 py-2 rounded-2xl shadow-md hover:bg-[#263824] transition">
              สร้างรีวิว
            </button>
          </Link>
        </div>

        {/* Reviews Section */}
        {reviews.length === 0 ? (
          <div className="text-[#0f1d2a]">No reviews available.</div>
        ) : (
          reviews.map((review, reviews) => (
              <div key={reviews} className="bg-gray-500 p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="bg-white p-2 flex-1 rounded-2xl">{review.user.name ?? "Anonymous"} - {review.review_date}</div>
                  <div className="bg-[#61815D] p-2 ml-2 rounded-2xl text-white">{review.rating}/10</div>
                </div>
                <div className="bg-white p-4 mb-2 w-full text-left rounded-2xl">
                  <p>{review.review_text}</p>
                </div>

                <br/>
                <button className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 transition rounded-2xl">Delete</button>
              </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;