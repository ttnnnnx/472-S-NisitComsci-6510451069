import {
  Link,
  useLoaderData,
  type LoaderFunction,
} from "react-router";
import SectionFormRepository from "./repositories/SectionFormRepository.server";

interface SectionForm {
  Section_Form_ID: number;
  Section_Form_Name: string;
  Section_Form_Detail: string;
  Section_Form_Max_Number: number;
  Section_Form_Nisit_Number: number;
  Section_Form_Date: string;
  Section_Form_Status: "open" | "close";
  Section_Form_Nisits: { Section_Form_Nisit_ID: number; nisitName: string }[];
}

interface LoaderData {
  sectionForms: SectionForm[];
}

export const loader: LoaderFunction = async () => {
  const sectionFormRepo = new SectionFormRepository();
  const sectionForms = await sectionFormRepo.getAllSectionForms();
  return { sectionForms: sectionForms || [] }; // ส่งกลับ object ที่มี sectionForms เสมอ
};

export default function SectionFormPage() {
  // กำหนด default value เป็น [] หาก useLoaderData ส่งกลับ null
  const { sectionForms = [] } = useLoaderData<LoaderData>() || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">รายการฟอร์มทั้งหมด</h1>
      {sectionForms.length > 0 ? (
        <ul className="space-y-4">
          {sectionForms.map((form) => (
            <li key={form.Section_Form_ID} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{form.Section_Form_Name}</h2>
              <p>{form.Section_Form_Detail}</p>
              <p>
                <strong>จำนวนผู้เข้าร่วมสูงสุด:</strong> {form.Section_Form_Max_Number} |{" "}
                <strong>เข้าร่วมแล้ว:</strong> {form.Section_Form_Nisit_Number}
              </p>
              <p>
                <strong>วันที่สร้าง:</strong>{" "}
                {new Date(form.Section_Form_Date).toLocaleString()}
              </p>
              <p>
                <strong>สถานะ:</strong> {form.Section_Form_Status}
              </p>
              {form.Section_Form_Nisits && form.Section_Form_Nisits.length > 0 ? (
                <div>
                  <strong>รายชื่อนิสิตที่เข้าร่วม:</strong>
                  <ul className="list-disc pl-5">
                    {form.Section_Form_Nisits.map((nisit) => (
                      <li key={nisit.Section_Form_Nisit_ID}>{nisit.nisitName}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>ยังไม่มีนิสิตเข้าร่วม</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>ยังไม่มีฟอร์ม</p>
      )}
      <div className="mt-6">
        <Link to="/choose-course-to-review">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            ไปยังหน้าเลือกคอร์ส
          </button>
        </Link>
      </div>
    </div>
  );
}
