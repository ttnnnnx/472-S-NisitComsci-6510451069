import { Role, User } from "@prisma/client";
import db from "./database.server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class UserRepository {
  public async getUserByID(uuid: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { uuid },
    });
  }

  public async getAllUsers(): Promise<User[]> {
    return await db.user.findMany();
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await db.user.findUnique({
        where: { email },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(error.code);
      }
    }
    throw new Error("Internal Server Error");
  }

  public async login(email: string, password: string): Promise<Partial<User>> {
    try {
      const loggingInUser = await this.getUserByEmail(email);

      if (!loggingInUser) {
        throw new Error("Invalid email or password");
      }

      //check if password correct
      const isValidPassword = await Bun.password.verify(
        password + loggingInUser.salt,
        loggingInUser.password
      );

      //Debugging log
      console.log("user's salt: ", loggingInUser.salt);
      console.log("user's password:     ", loggingInUser.password);
      console.log("isValidPassword: ", isValidPassword);

      if (!isValidPassword) {
        console.log("Invalid email or password");
        throw new Error("Invalid email or password");
      }

      const user = (await db.$queryRaw<
        { name: string; surname: string; email: string; year: number; role: Role }
      >`SELECT "name", "surname", "email", "year", "role" FROM "User" WHERE "email" = ${email} LIMIT 1`) as Partial<User>;

      console.log(user);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(error.code);
      }
    }
    throw new Error("Internal Server Error");
  }

  public async createUser({
    name,
    surname,
    password,
    email,
    year,
  }: // salt,
  // role,
  {
    name: string;
    surname: string;
    password: string;
    email: string;
    year: number;
    // salt: string;
    // role: Role;
  }): Promise<User> {
    const salt = Math.random().toString(36).substring(2, 12); //generate random salt
    const hashedPassword = await Bun.password.hash(password + salt, "bcrypt"); //hash password
    try {
      const response = await db.user.create({
        data: {
          name: name,
          surname: surname,
          password: hashedPassword,
          email: email,
          year: year,
          salt: salt,
          // role: role,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new Error("Email already exists");
          default:
            throw new Error("Internal Server Error");
        }
      }
    }
    throw new Error("Internal Server Error");
  }

  public async updatedUser(
    uuid: string,
    updates: {
      name?: string;
      surname?: string;
      password?: string;
      email?: string;
      year?: number;
    }
  ): Promise<User> {
    try {
      if (updates.password) {
        const user = await this.getUserByID(uuid);
        if (user) {
          const hashedPassword = await Bun.password.hash(
            updates.password + user.salt,
            "bcrypt"
          );
          updates.password = hashedPassword;
        }
      }

      const response = await db.user.update({
        where: { uuid },
        data: updates,
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new Error("A bank account with this number already exists.");
          default:
            throw new Error(error.code);
        }
      }
    }
    throw new Error("Internal Server Error");
  }

  public async deleteUser(id: string): Promise<User | null> {
    try {
      const response = await db.user.delete({
        where: { uuid: id },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new Error("Record does not exists.");
          default:
            throw new Error(error.code);
        }
      }
    }
    throw new Error("Internal Server Error");
  }
}

export default UserRepository;
