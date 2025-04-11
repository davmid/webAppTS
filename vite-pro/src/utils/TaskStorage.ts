import { Task } from "../models/Task";

const KEY = "tasks";

export class TaskStorage {
  static getAll(): Task[] {
    const json = localStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  }

  static save(tasks: Task[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }

  static getByStory(storyId: string) {
    return this.getAll().filter(t => t.storyId === storyId);
  }

  static add(task: Task) {
    const tasks = this.getAll();
    tasks.push(task);
    this.save(tasks);
  }

  static update(updated: Task) {
    const tasks = this.getAll().map(t => (t.id === updated.id ? updated : t));
    this.save(tasks);
  }

  static delete(id: string) {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.save(tasks);
  }
}
