export type TaskState = "todo" | "doing" | "done";
export type TaskPriority = "low" | "mid" | "high";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedTime: number;
  state: TaskState;
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
  assigneeId?: string;
}
