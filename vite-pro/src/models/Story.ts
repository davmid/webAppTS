export interface Story {
    id: string;
    name: string;
    description: string;
    priority: "low" | "mid" | "high";
    projectId: string;
    createdAt: string;
    status: "todo" | "done";
    ownerId: string;
  }
  