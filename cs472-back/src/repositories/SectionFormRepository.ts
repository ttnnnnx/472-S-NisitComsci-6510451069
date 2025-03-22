// repositories/SectionFormRepository.ts
import { OpenSectionForm, SectionFormNisit, SectionFormStatus } from "@prisma/client";
import db from "../database";

interface CreateSectionFormInput {
    Section_Form_Name: string;
    Section_Form_Detail: string;
    Section_Form_Max_Number: number;
    Section_Form_Nisit_Number: number;
    Section_Form_Date: string;
    Section_Form_Status: SectionFormStatus;
}

class SectionFormRepository {
    // ดึงรายการฟอร์มทั้งหมดพร้อม relation ของนิสิต
    public async getAllSectionForms(): Promise<(OpenSectionForm & { Section_Form_Nisits: SectionFormNisit[] })[]> {
        return await db.openSectionForm.findMany({
            include: { Section_Form_Nisits: true },
        });
    }

    // ดึงฟอร์มเดียวตาม ID พร้อม relation ของนิสิต
    public async getSectionFormById(
        id: number
    ): Promise<(OpenSectionForm & { Section_Form_Nisits: SectionFormNisit[] }) | null> {
        return await db.openSectionForm.findUnique({
            where: { Section_Form_ID: id },
            include: { Section_Form_Nisits: true },
        });
    }

    // สร้างฟอร์มใหม่
    public async createSectionForm(
        data: CreateSectionFormInput
    ): Promise<OpenSectionForm> {
        return await db.openSectionForm.create({
            data,
        });
        //Code เพื่อทำการ Join อัตโนมัติเมื่อสร้าง
    }
}

export default SectionFormRepository;
