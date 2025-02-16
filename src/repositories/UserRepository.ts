import { User } from "@prisma/client";
import db from "./database.server"

class UserRepository {
    public async getUserByID(uuid: string): Promise<User | null> {
        return await db.user.findUnique({
            where: {uuid}
        });
    }

    public async getAllUsers(): Promise<User[]> {
        return await db.user.findMany();
    }
}

export default UserRepository;