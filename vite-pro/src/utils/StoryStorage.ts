import { Story } from "../models/Story";

export class StoryStorage {
    static getAll(): Story[] {
        const data = localStorage.getItem("stories");
        return data ? JSON.parse(data) : [];
    }

    static getByProject(projectId: string): Story[] {
        return this.getAll().filter((story) => story.projectId === projectId);
    }

    static add(story: Story) {
        const all = this.getAll();
        localStorage.setItem("stories", JSON.stringify([...all, story]));
    }
}
