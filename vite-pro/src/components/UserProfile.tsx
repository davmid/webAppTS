import React from "react";
import { UserService } from "../services/UserService";

const UserProfile: React.FC = () => {
  const user = UserService.getCurrentUser();

  return (
    <div>
      <h3>Zalogowany użytkownik:</h3>
      <p>{user.firstName} {user.lastName}</p>
    </div>
  );
};

export default UserProfile;
