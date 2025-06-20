import { User } from "../models/User";

const users: User[] = [
  {
    id: "1",
    name: "Admin Magda",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Dawid Developer",
    email: "dev@example.com",
    role: "developer",
  },
  {
    id: "3",
    name: "Kamil DevOps",
    email: "devops@example.com",
    role: "devops",
  },
];

export const UserService = {
  getAll: (): User[] => users,
  getById: (id: string): User | undefined => users.find((u) => u.id === id),
  getCurrentUser: (): User => users[0], // Mock: zalogowany admin
};
