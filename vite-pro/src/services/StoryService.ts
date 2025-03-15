import { Story } from "../models/Story";

const STORAGE_KEY = "stories";

export class StoryService {
  static getAll(): Story[] {
    const stories = localStorage.getItem(STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
  }

  static getByProject(projectId: string): Story[] {
    return this.getAll().filter((story) => story.projectId === projectId);
  }

  static save(story: Story): void {
    const stories = this.getAll();
    const index = stories.findIndex((s) => s.id === story.id);
    if (index !== -1) {
      stories[index] = story;
    } else {
      stories.push(story);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }

  static delete(id: string): void {
    const stories = this.getAll().filter((story) => story.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }
}
