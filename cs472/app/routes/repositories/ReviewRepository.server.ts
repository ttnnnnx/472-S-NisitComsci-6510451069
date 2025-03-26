interface Review {
    review_id: number;
    course_id: string;
    user_uuid: string;
    review: string;
    rating: number;
}
  
export default class ReviewRepository {
    // Method to get all reviews
    public async getAllReviews(): Promise<Review[]> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/api/review/all`);
        const data: Review[] = await response.json();
        return data;
    }

    // Method to get reviews by course ID
    public async getReviewsByCourse(course_id: string): Promise<Review[]> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/api/review/course/${course_id}`);
        const data: Review[] = await response.json();
        return data;
    }

    // Method to add a new review
    public async addReview(
        course_id: string,
        user_uuid: string,
        rating: number,
        review: string,
    ): Promise<Review> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/api/review/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id, user_uuid, rating, review}),
        });
        const data: Review = await response.json();
        return data;
    }

    // Method to delete a review
    public async deleteReview(review_id: number): Promise<Review | null> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(
        `${BACKEND_URL}/api/review/delete/${review_id}`,
        {
            method: "DELETE",
        }
        );

        if (!response.ok) {
        throw new Error("Failed to delete review");
        }

        const data: Review = await response.json();
        return data;
    }
}