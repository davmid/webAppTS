import { Task } from "../models/Task";

const STORAGE_KEY = "tasks";

export class TaskService {
  static getAll(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static add(task: Task) {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  }

  static update(updated: Task) {
    const tasks = this.getAll().map(t => t.id === updated.id ? updated : t);
    this.saveAll(tasks);
  }

  static delete(id: string) {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.saveAll(tasks);
  }

  static getByStory(storyId: string): Task[] {
    return this.getAll().filter(t => t.storyId === storyId);
  }
}
