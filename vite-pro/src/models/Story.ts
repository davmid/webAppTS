export interface Story {
    id: string;
    name: string;
    description: string;
    priority: "low" | "mid" | "high";
    projectId: string;
    createdAt: string;
    state: "todo" | "in-progress" | "done";
    ownerId: string;
}

export type StoryPriority = "low" | "mid" | "high";
export type StoryState = "todo" | "in-progress" | "done";
