export type StoryState = 'todo' | 'doing' | 'done';

export type Story = {
  id: string;
  name: string;
  description: string;
  priority: number;
  state: StoryState;
  projectId: string;
};

const STORAGE_KEY = 'stories';

export class StoryService {
  static getStories(): Story[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveStories(stories: Story[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }

  static addStory(story: Story) {
    const stories = this.getStories();
    stories.push(story);
    this.saveStories(stories);
  }

  static updateStory(updatedStory: Story) {
    const stories = this.getStories().map(story =>
      story.id === updatedStory.id ? updatedStory : story
    );
    this.saveStories(stories);
  }

  static deleteStory(id: string) {
    const stories = this.getStories().filter(story => story.id !== id);
    this.saveStories(stories);
  }
}
