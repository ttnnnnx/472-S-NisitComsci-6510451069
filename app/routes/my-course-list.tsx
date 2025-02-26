// app/routes/my-course-list.tsx
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import type { Course } from "@prisma/client";

// ฟังก์ชันสมมติสำหรับดึง user จาก session
import { getUserSession } from "~/utils/session.server";
// ฟังก์ชันสมมติสำหรับคุยกับ DB
import {
    getAllCourses,
    getUserCourseList,      // ดึง list ของผู้ใช้
    updateUserCourseList,   // อัปเดต list
} from "~/models/nisitCourseList.server";

type LoaderData = {
    allCourses: Course[];
    selectedCourseIds: string[]; // ID ของคอร์สที่ผู้ใช้ติ๊กไว้
};

export const loader: LoaderFunction = async ({ request }) => {
    // ตรวจสอบ user จาก session
    const userSession = await getUserSession(request);
    if (!userSession) {
        // ถ้าไม่เจอ user ให้ redirect ไปหน้า login
        return redirect("/login");
    }

    // ดึงคอร์สทั้งหมด
    const allCourses = await getAllCourses();

    // สมมติเราดึง "รายการ" ของผู้ใช้มา 1 รายการ (เช่น ชื่อ My Selected Courses)
    // และคืนค่าเป็น array ของคอร์ส
    const selectedCourses = await getUserCourseList(userSession.userId);

    // แปลงให้เหลือแค่ ID
    const selectedCourseIds = selectedCourses.map((course) => course.course_id);

    return json<LoaderData>({
        allCourses,
        selectedCourseIds,
    });
};
