import MenuBar from "./components/MenuBar";
import ReviewRepository from "./repositories/ReviewRepository.server";
import CourseRepository from "./repositories/CourseRepository.server";
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
  const course = courses.filter(course => course.course_id === course_id)
  console.log("✅ Loaded course_id:", course_id);
  console.log("✅ Loaded course:", course);
  console.log("✅ Loaded Reviews:", reviews);
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

  return (
    <div className="flex">
      <MenuBar user={user} />
      <div className="bg-[#C0E0FF] h-screen w-screen p-6 relative">
        {/* Course Header */}
        <div className="bg-gray-400 p-2 mb-4">
          <h1 className="text-lg">{course[0].course_id} {course[0].course_name}</h1>
        </div>

        {/* Course Description */}
        <div className="bg-gray-300 p-4 mb-4">
          <p>{course[0].course_detail}</p>
        </div>

        {/* Buttons */}
        <div className="flex mb-4">
          <button className="bg-gray-400 text-black px-4 py-2 mr-2">
            รีวิวทั้งหมด
          </button>
          <button className="bg-gray-400 text-black px-4 py-2 mr-2">
            คะแนนรวมวิชานี้ : {averageScore}/10
          </button>
          <Link to={`/create-review?course_id=01418111`}>
            <button className="bg-green-500 text-black px-4 py-2 rounded-lg shadow-md hover:bg-[#43586c] transition">
              สร้างรีวิว
            </button>
          </Link>
        </div>

        {/* Reviews Section */}
        {reviews.length === 0 ? (
          <div>No reviews available.</div>
        ) : (
          reviews.map((review, index) => (
              <div key={index} className="bg-gray-500 p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="bg-gray-300 p-2 flex-1">{review.user_uuid}</div>
                  <div className="bg-gray-300 p-2 ml-2">{review.rating}/10</div>
                </div>
                <div className="bg-gray-300 p-4 mb-2 w-full text-left">
                  <p>{review.review_text}</p>
                </div>

                <button className="bg-red-500 text-white px-4 py-2">Delete</button>
              </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;