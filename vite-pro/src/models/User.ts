export type UserRole = "admin" | "developer" | "devops";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
