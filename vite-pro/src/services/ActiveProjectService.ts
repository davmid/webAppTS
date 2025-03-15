export class ActiveProjectService {
    private static STORAGE_KEY = "activeProject";
  
    static setActiveProject(projectId: string) {
      localStorage.setItem(this.STORAGE_KEY, projectId);
    }
  
    static getActiveProject(): string | null {
      return localStorage.getItem(this.STORAGE_KEY);
    }
  }
  