import { readCSV } from "../csv";
import { User } from "../types";

const FILE = "users.csv";
const HEADERS = ["id", "username", "password"];

export const UserModel = {
  async all(): Promise<User[]> {
    return readCSV<User>(FILE, HEADERS);
  },
  async findByUsername(username: string) {
    const all = await this.all();
    return all.find((u) => u.username === username) || null;
  },
};
