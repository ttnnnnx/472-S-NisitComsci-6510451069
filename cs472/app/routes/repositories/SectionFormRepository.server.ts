// repositories/SectionFormRepository.server.ts
export default class SectionFormRepository {
    public async getAllSectionForms(): Promise<any> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/section-form/all`);
        if (!response.ok) {
            throw new Error("Failed to fetch section forms");
        }
        return await response.json();
    }

    public async getSectionFormById(formId: number): Promise<any> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/section-form/${formId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch section form");
        }
        return await response.json();
    }

    public async createSectionForm(formData: {
        Section_Form_Name: string;
        Section_Form_Detail: string;
        Section_Form_Max_Number: number;
        Section_Form_Status: "open" | "close";
        Section_Form_Date: string;
        Section_Form_Nisit_Number?: number;
    }): Promise<any> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/section-form/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error("Failed to create section form");
        }
        return await response.json();
    }

    public async joinSectionForm(formId: number, Section_Form_Nisit_Name: string): Promise<any> {
        const BACKEND_URL = process.env.BACKEND_URL as string;
        const response = await fetch(`${BACKEND_URL}/section-form/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formId, Section_Form_Nisit_Name }),
        });
        if (!response.ok) {
            throw new Error("Failed to join section form");
        }
        return await response.json();
    }
}
