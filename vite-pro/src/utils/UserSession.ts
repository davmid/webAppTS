export type UserRole = 'admin' | 'devops' | 'developer';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

const mockUsers: User[] = [
  { id: '1', firstName: 'Magda', lastName: 'Admin', role: 'admin' },
  { id: '2', firstName: 'Maciek', lastName: 'DevOps', role: 'devops' },
  { id: '3', firstName: 'Justyna', lastName: 'Dev', role: 'developer' },
];

export class UserSession {
  static getLoggedUser(): User {
    return mockUsers[0]; // Zalogowany jako admin
  }

  static getAllUsers(): User[] {
    return mockUsers;
  }
}
