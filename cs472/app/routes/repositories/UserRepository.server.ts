interface LoginRespones {
  message: string;
  error: string;
  user: User;
}

export default class UserRepository {
  public async login(
    email: string,
    password: string
  ): Promise<LoginRespones> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data: LoginRespones = await response.json();
    return data;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const BACKEND_URL = process.env.BACKEND_URL as string;
    const response = await fetch(`${BACKEND_URL}/api/user/getByEmail/${email}`);
    const data: User = await response.json();
    return data;
  }
}
