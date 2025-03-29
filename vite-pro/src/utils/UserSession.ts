export class UserSession {
    static getLoggedUser() {
        const user = localStorage.getItem("loggedUser");
        return user ? JSON.parse(user) : null;
    }

    static setLoggedUser(user: any) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
    }

    static logout() {
        localStorage.removeItem("loggedUser");
    }
}
