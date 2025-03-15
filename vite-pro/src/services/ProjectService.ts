import { Project } from "../models/Project";

const STORAGE_KEY = "projects";

export class ProjectService {
  static getAll(): Project[] {
    const projects = localStorage.getItem(STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
  }

  static getById(id: string): Project | undefined {
    return this.getAll().find((project) => project.id === id);
  }

  static save(project: Project): void {
    const projects = this.getAll();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  static delete(id: string): void {
    const projects = this.getAll().filter((project) => project.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}
