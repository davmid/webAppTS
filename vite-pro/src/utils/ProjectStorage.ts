import { Project } from "../models/Project";

export class ProjectStorage {
    static getAll(): Project[] {
        const data = localStorage.getItem("projects");
        return data ? JSON.parse(data) : [];
    }

    static add(project: Project) {
        const all = this.getAll();
        localStorage.setItem("projects", JSON.stringify([...all, project]));
    }
}
