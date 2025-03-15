import { User } from "../models/User";

export class UserService {
  private static user: User = { id: "1", firstName: "Jan", lastName: "Kowalski" };

  static getCurrentUser(): User {
    return this.user;
  }
}
