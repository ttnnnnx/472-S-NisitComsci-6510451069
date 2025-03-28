// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import MenuBar from "./components/MenuBar";
// import { Link, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
// import { authCookie } from "~/utils/session.server";

// // Loader to check if user is authenticated
// export async function loader({ request }: LoaderFunctionArgs) {
//   const session = request.headers.get("Cookie");
//   const user: AuthCookie = await authCookie.parse(session);
//   if (!user) return redirect("/login");
//   return { user };
// }

// const CreateReviewPage: React.FC = () => {
//   const { user } = useLoaderData<typeof loader>(); // Get user data from loader
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const courseId = queryParams.get("course_id");

//   const [reviewText, setReviewText] = useState("");
//   const [score, setScore] = useState<string>("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Here you would send the review data to your backend or handle it accordingly.
//     console.log("Submitting review for course:", courseId);
//     console.log("Review:", reviewText);
//     console.log("Score:", score);

//     // After submission, navigate to course reviews or a different page
//     navigate(`/review-each-course?course_id=${courseId}`);
//   };

//   return (
//     <div className="flex">
//       <MenuBar user={user} />
//       <div className="review-container bg-[#C0E0FF] h-screen w-screen p-6 relative ">
//         {/* Course Title */}
//         <div className="title mb-4">
//           <h2 id="course-title" className="text-lg">
//             {courseId ? `Course ${courseId} - Review` : "Loading..."}
//           </h2>
//         </div>

//         {/* Review Heading */}
//         <h2 className="review-heading mb-4 text-xl">เขียนสิ่งที่อยากรีวิวเลย</h2>

//         {/* Textbox for Writing a Review */}
//         <textarea
//           id="review-text"
//           placeholder="เขียนตรงนี้..."
//           value={reviewText}
//           onChange={(e) => setReviewText(e.target.value)}
//           className="w-full p-2 mb-4 border"
//         />

//         {/* Dropdown for Selecting Score (1-10) */}
//         <div className="score-container mb-4">
//           <h3 className="score-heading text-lg">ให้คะแนนเท่าไหร่ดี :</h3>
//           <select
//             id="review-score"
//             value={score}
//             onChange={(e) => setScore(e.target.value)}
//             className="p-2 border"
//           >
//             <option value="">เลือกคะแนนที่นี่</option>
//             <option value="1">1 - ควรปรับปรุง</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//             <option value="5">5 - ปานกลาง</option>
//             <option value="6">6</option>
//             <option value="7">7</option>
//             <option value="8">8</option>
//             <option value="9">9</option>
//             <option value="10">10 - ดีมาก</option>
//           </select>
//         </div>

//         {/* Button Container */}
//         <div className="button-container flex space-x-4">
//           <button
//             id="back-btn"
//             className="btn-cancel bg-gray-400 text-black px-4 py-2 rounded-md"
//             onClick={() => navigate(-1)}
//           >
//             ยกเลิก
//           </button>
//           <button
//             id="submit-review"
//             className="btn-submit bg-blue-500 text-white px-4 py-2 rounded-md"
//             onClick={handleSubmit}
//           >
//             โพสต์เลย
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateReviewPage;