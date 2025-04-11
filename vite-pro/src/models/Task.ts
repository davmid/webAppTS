export type TaskState = "todo" | "doing" | "done";

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: "low" | "mid" | "high";
  storyId: string;
  estimatedTime: number;
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
  assigneeId?: string;
  state: TaskState;
};
