import { User } from "../models/User";

const mockUsers: User[] = [
  { id: '1', firstName: 'Magda', lastName: 'Admin', role: 'admin' },
  { id: '2', firstName: 'Dawid', lastName: 'Dev', role: 'developer' },
  { id: '3', firstName: 'Olga', lastName: 'Ops', role: 'devops' },
];

const UserService = {
  getCurrentUser(): User {
    return mockUsers[0];
  },
  getAll(): User[] {
    return mockUsers;
  },
};

export default UserService;
