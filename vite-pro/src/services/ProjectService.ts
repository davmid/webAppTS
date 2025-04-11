export type Project = {
  id: string;
  name: string;
  description: string;
};

const STORAGE_KEY = 'projects';

export class ProjectService {
  static getProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  static addProject(project: Project) {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static deleteProject(id: string) {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  }
}
