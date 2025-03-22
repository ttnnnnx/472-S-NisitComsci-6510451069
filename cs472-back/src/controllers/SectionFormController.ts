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

// POST /section-form/create -> สร้างฟอร์มใหม่
sectionFormController.post(
    "/create",
    async ({ body }: { body: any }) => {
        const sectionFormRepo = new SectionFormRepository();
        const newForm = await sectionFormRepo.createSectionForm({
            Section_Form_Name: body.Section_Form_Name,
            Section_Form_Detail: body.Section_Form_Detail,
            Section_Form_Max_Number: body.Section_Form_Max_Number,
            Section_Form_Status: body.Section_Form_Status,
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
            Section_Form_Status: t.String(),
        }),
        detail: {
            summary: "Create Section Form",
            description: "สร้างฟอร์มใหม่",
        },
    }
);

export default sectionFormController;
