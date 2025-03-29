export class ActiveProject {
    static getActive(): string | null {
        return localStorage.getItem("activeProject");
    }

    static setActive(projectId: string) {
        localStorage.setItem("activeProject", projectId);
    }
}
