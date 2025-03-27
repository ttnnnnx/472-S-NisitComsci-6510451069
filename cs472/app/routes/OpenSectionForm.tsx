import { useState, useEffect } from "react";
import {
    Link,
    redirect,
    useLoaderData,
    useRevalidator,
    useFetcher,
    type LoaderFunction,
    type MetaFunction,
    type ActionFunction,
} from "react-router";
import MenuBar from "./components/MenuBar";
import { authCookie } from "~/utils/session.server";
import SectionFormRepository from "./repositories/SectionFormRepository.server";

export interface Form {
    Section_Form_ID: number;
    Section_Form_Name: string;
    Section_Form_Detail: string;
    Section_Form_Max_Number: number;
    Section_Form_Nisit_Number: number;
    Section_Form_Date: string;
    Section_Form_Status: "open" | "close";
}

interface LoaderData {
    user: any; // AuthCookie
    forms: Form[];
}

export const meta: MetaFunction = () => {
    return [
        { title: "Open Section Form" },
        { name: "description", content: "เลือกแบบฟอร์มที่ต้องการเข้าร่วม" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = request.headers.get("Cookie");
    const user = await authCookie.parse(session);
    if (!user) return redirect("/login");

    const sectionFormRepository = new SectionFormRepository();
    const forms: Form[] = await sectionFormRepository.getAllSectionForms();

    return { user, forms };
};

export const action: ActionFunction = async ({ request }) => {
    const data = await request.formData();
    const _action = data.get("_action");

    if (_action === "saveForm") {
        const Section_Form_Name = data.get("Section_Form_Name") as string;
        const Section_Form_Detail = data.get("Section_Form_Detail") as string;
        const Section_Form_Max_Number = parseInt(
            data.get("Section_Form_Max_Number") as string,
            10
        );

        const sectionFormRepository = new SectionFormRepository();
        const newForm = await sectionFormRepository.createSectionForm({
            Section_Form_Name,
            Section_Form_Detail,
            Section_Form_Max_Number,
            Section_Form_Status: "open",
            Section_Form_Date: new Date().toISOString(),
            Section_Form_Nisit_Number: 0,
        });
        return newForm;
    } else {
        return { message: "", error: "Action not found", data: null };
    }
};

export default function OpenSectionForm() {
    const { user, forms } = useLoaderData<LoaderData>();
    const revalidator = useRevalidator();
    const fetcher = useFetcher();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        Section_Form_Name: "",
        Section_Form_Detail: "",
        Section_Form_Max_Number: 0,
    });

    // ปิด scroll ของ body เมื่อ modal เปิดอยู่
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (fetcher.data) {
            revalidator.revalidate();
            setIsModalOpen(false);
            setFormValues({
                Section_Form_Name: "",
                Section_Form_Detail: "",
                Section_Form_Max_Number: 0,
            });
        }
    }, [fetcher.data, revalidator]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]:
                name === "Section_Form_Max_Number" ? parseInt(value, 10) || 0 : value,
        }));
    };

    return (
        <div className="flex">
            <MenuBar user={user} />
            <div className="bg-[#C0E0FF] h-screen w-screen p-6 relative">
                <h1 className="text-[#0f1d2a] font-bold text-2xl mb-6">
                    Open Section Form
                </h1>

                {/* แสดงรายการฟอร์มที่ดึงมาจาก backend */}
                <div className="bg-white p-4 rounded-lg shadow-lg h-[600px] overflow-y-auto border border-gray-300 mb-6">
                    <ul className="space-y-4">
                        {forms.map((form) => (
                            <li
                                key={form.Section_Form_ID}
                                className="bg-gray-100 p-4 rounded shadow"
                            >
                                <h2 className="text-xl font-semibold">
                                    {form.Section_Form_Name}
                                </h2>
                                <p className="mt-2">{form.Section_Form_Detail}</p>
                                <Link to={`/section-form/${form.Section_Form_ID}`}>
                                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                                        Join Form
                                    </button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ปุ่ม + ที่อยู่มุมขวาล่าง */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full text-2xl"
                >
                    +
                </button>

                {/* Modal Popup สำหรับกรอกข้อมูลฟอร์มใหม่ */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
                            <h2 className="text-xl font-bold mb-4">
                                Create New Section Form
                            </h2>
                            <fetcher.Form method="post" className="space-y-4">
                                <input type="hidden" name="_action" value="saveForm" />
                                <div>
                                    <label className="block text-sm font-medium">
                                        Section Form Name
                                    </label>
                                    <input
                                        type="text"
                                        name="Section_Form_Name"
                                        value={formValues.Section_Form_Name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Section Form Detail
                                    </label>
                                    <textarea
                                        name="Section_Form_Detail"
                                        value={formValues.Section_Form_Detail}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Section Form Max Number
                                    </label>
                                    <input
                                        type="number"
                                        name="Section_Form_Max_Number"
                                        value={formValues.Section_Form_Max_Number}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="mt-4 px-4 py-2 bg-[#7793AE] text-white font-semibold rounded-lg shadow-md hover:bg-[#43586c] transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </fetcher.Form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
