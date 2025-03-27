export default function TeacherCourseCard() {
    return (
        <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg p-4">
            
            <div>
                <h3 className="text-gray-500 font-semibold">
                    Course Id
                </h3>
                <p className="text-gray-500 font-semibold">
                    01418497-65
                </p>
            </div>

            <div>
                <h3 className="text-gray-500 font-semibold">
                    Course Name
                </h3>
                <p className="text-[#0f1d2a] font-bold text-lg">
                    Mobile Application Desin and Development
                </p>
            </div>

            <div>
                <h3 className="text-gray-500 font-semibold">
                    Details
                </h3>
                <p className="text-gray-700">
                    ห้อง: SC45-710
                </p>
            </div>

        </div>

    );
}