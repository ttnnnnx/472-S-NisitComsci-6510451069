// controllers/SectionFormController.ts
import { Elysia, t } from "elysia";
import SectionFormRepository from "../repositories/SectionFormRepository";

const sectionFormController = new Elysia({
    prefix: "/section-form",
    tags: ["SectionForm"],
});

sectionFormController.model({
    Section_Form_ID: t.Number(),
    Section_Form_Name: t.String(),
    Section_Form_Detail: t.String(),
    Section_Form_Max_Number: t.Number(),
    Section_Form_Nisit_Number: t.Number(),
    Section_Form_Date: t.String(),
    Section_Form_Status: t.String(),
});

// GET /section-form/all -> ดึงฟอร์มทั้งหมด
sectionFormController.get(
    "/all",
    async () => {
        const sectionFormRepo = new SectionFormRepository();
        const forms = await sectionFormRepo.getAllSectionForms();
        return forms;
    },
    {
        tags: ["SectionForm"],
        detail: {
            summary: "Get all Section Forms",
            description: "ดึงรายการฟอร์มทั้งหมดพร้อมรายชื่อนิสิตที่เข้าร่วม",
        },
    }
);

// GET /section-form/:id -> ดึงฟอร์มตาม ID
sectionFormController.get(
    "/:id",
    async ({ params }) => {
        const sectionFormRepo = new SectionFormRepository();
        const form = await sectionFormRepo.getSectionFormById(Number(params.id));

        if (!form) {
            return new Response(JSON.stringify({ error: "Form not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return form;
    },
    {
        tags: ["SectionForm"],
        params: t.Object({
            id: t.String(),
        }),
        detail: {
            summary: "Get Section Form by ID",
            description: "ดึงข้อมูลฟอร์มตาม ID พร้อมรายชื่อนิสิตที่เข้าร่วม",
        },
    }
);

// POST /section-form/create -> สร้างฟอร์มใหม่
sectionFormController.post(
    "/create",
    async ({ body }: { body: any }) => {
        const sectionFormRepo = new SectionFormRepository();
        const newForm = await sectionFormRepo.createSectionForm({
            Section_Form_Name: body.Section_Form_Name,
            Section_Form_Detail: body.Section_Form_Detail,
            Section_Form_Max_Number: body.Section_Form_Max_Number,
            Section_Form_Status: "open",
            Section_Form_Nisit_Number: 0,
            Section_Form_Date: new Date().toISOString(),
        });
        return newForm;
    },
    {
        tags: ["SectionForm"],
        body: t.Object({
            Section_Form_Name: t.String(),
            Section_Form_Detail: t.String(),
            Section_Form_Max_Number: t.Number(),
        }),
        detail: {
            summary: "Create Section Form",
            description: "สร้างฟอร์มใหม่",
        },
    }
);

// POST /section-form/join -> เข้าร่วมฟอร์ม
sectionFormController.post(
    "/join",
    async ({ body }: { body: any }) => {
        const { formId, Section_Form_Nisit_Name } = body;

        if (!formId || !Section_Form_Nisit_Name) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const sectionFormRepo = new SectionFormRepository();

        // ตรวจสอบว่าฟอร์มมีอยู่หรือไม่
        const form = await sectionFormRepo.getSectionFormById(Number(formId));

        if (!form) {
            return new Response(JSON.stringify({ error: "Form not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        // ตรวจสอบว่าฟอร์มยังเปิดรับสมัครอยู่หรือไม่
        if (form.Section_Form_Status !== "open") {
            return new Response(JSON.stringify({ error: "Form is closed" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // ตรวจสอบว่าฟอร์มยังมีที่ว่างหรือไม่
        if (form.Section_Form_Nisit_Number >= form.Section_Form_Max_Number) {
            return new Response(JSON.stringify({ error: "Form is full" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // เพิ่มนิสิตเข้าร่วมฟอร์ม
        const result = await sectionFormRepo.joinSectionForm(formId, Section_Form_Nisit_Name);

        return result;
    },
    {
        tags: ["SectionForm"],
        body: t.Object({
            formId: t.Number(),
            Section_Form_Nisit_Name: t.String(),
        }),
        detail: {
            summary: "Join Section Form",
            description: "เข้าร่วมฟอร์ม",
        },
    }
);

export default sectionFormController;