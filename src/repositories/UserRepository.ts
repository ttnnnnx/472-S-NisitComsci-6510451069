import { Role, User } from "@prisma/client";
import db from "./database.server";

class UserRepository {
  public async getUserByID(uuid: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { uuid },
    });
  }

  public async getAllUsers(): Promise<User[]> {
    return await db.user.findMany();
  }

  public async createUser({
    name,
    surname,
    password,
    email,
    year,
    salt,
    role,
  }: {
    name: string;
    surname: string;
    password: string;
    email: string;
    year: number;
    salt: string;
    role: Role;
  }): Promise<User> {
    try {
      const response = await db.user.create({
        data: {
          name: name,
          surname: surname,
          password: password,
          email: email,
          year: year,
          salt: salt,
          role: role,
        },
      });
      return response;
    } catch (error) {
      console.error("Error createing user: ", error);
      throw new Error("Failed to create user");
    }
  }
}

export default UserRepository;
