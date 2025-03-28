import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import ReviewRepository from "./repositories/ReviewRepository.server";
import CourseRepository from "./repositories/CourseRepository.server";
import { type LoaderFunctionArgs, Link, redirect, useLoaderData, type LoaderFunction } from "react-router";
import { authCookie } from "~/utils/session.server";

// Loader to check if user is authenticated
export async function loader({ request }: LoaderFunctionArgs) {
  const session = request.headers.get("Cookie");
  const user: AuthCookie = await authCookie.parse(session);
  if (!user) return redirect("/login");
  console.log("✅ Loaded user_uuid:", user);
  const courseRepository = new CourseRepository();
  const courses: Course[] = await courseRepository.getAllCourse();
  const url = new URL(request.url);
  const course_id = url.searchParams.get("course_id") ?? "";
  const course = courses.filter(course => course.course_id === course_id);
  console.log("✅ Loaded course_id:", course);
  return { user, course};
}

const CreateReviewPage: React.FC = () => {
  const { user, course } = useLoaderData<{ user: User, course: Course[] }>();
  const navigate = useNavigate();
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState<string>("");

  // Submit handler for posting the review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if score and review text are provided
    if (!score || !reviewText) {
      alert("กรุณากรอกคะแนนและข้อความรีวิว");
      return;
    }

    try {
      // Create a new Review object
      const reviewData = {
        course_id: course[0].course_id,  // Use the course id from the loader
        user_uuid: user.uuid,       // Use the user's uuid from the loader
        review_text: reviewText,
        rating: parseInt(score),
      };

      // Create an instance of ReviewRepository to post the review
      const reviewRepository = new ReviewRepository();
      await reviewRepository.addReview(course[0].course_id, user.uuid, reviewText, parseInt(score)); // Call the function to post the review

      // Redirect to the course page or show a success message
      navigate(`/course/${course[0].course_id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("เกิดข้อผิดพลาดในการโพสต์รีวิว");
    }
  };

  return (
    <div className="flex">
      <MenuBar user={user} />
      <div className="review-container bg-[#C0E0FF] h-screen w-screen p-6 relative ">
        {/* Course Title */}
        <div className="bg-gray-400 p-2 mb-4">
          <h2 id="course-title" className="text-lg">
            {course[0].course_id} - {course[0].course_name}
          </h2>
        </div>

        {/* Review Heading */}
        <h2 className="review-heading w-[200px] bg-gray-400 p-2 mb-4 text-xl">เขียนสิ่งที่อยากรีวิวเลย</h2>

        {/* Textbox for Writing a Review */}
        <textarea
          id="review-text "
          placeholder="เขียนตรงนี้..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full h-[100px] bg-gray-400 p-2 mb-4"
        />

        {/* Dropdown for Selecting Score (1-10) */}
        <div className="score-container w-[170px] bg-gray-400 p-2 mb-4">
          <h3 className="score-heading text-lg">ให้คะแนนเท่าไหร่ดี :</h3>
          <select
            id="review-score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="p-2 border">
            <option value="">เลือกคะแนนที่นี่</option>
            <option value="1">1 - ควรปรับปรุง</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 - ปานกลาง</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10 - ดีมาก</option>
          </select>
        </div>

        {/* Button Container */}
        <div className="button-container flex space-x-4">
          <button
            id="back-btn"
            className="btn-cancel bg-red-500 text-black px-4 py-2 rounded-md"
            onClick={() => navigate(-1)}> ยกเลิก
          </button>
          <button
            id="submit-review"
            className="btn-submit bg-green-500 text-black px-4 py-2 rounded-md"
            onClick={handleSubmit}>โพสต์เลย
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewPage;