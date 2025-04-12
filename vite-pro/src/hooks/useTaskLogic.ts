import { useState } from "react";
import { Task } from "../models/Task";
import { TaskService } from "../services/TaskService";
import { v4 as uuidv4 } from "uuid";

export const useTaskLogic = (storyId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>(storyId ? TaskService.getByStory(storyId) : []);

  const refresh = () => {
    if (storyId) {
      setTasks(TaskService.getByStory(storyId));
    }
  };

  const createTask = (name: string, description: string, priority: Task["priority"], estimatedTime: number) => {
    if (!storyId) return;
    const newTask: Task = {
      id: uuidv4(),
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      state: "todo",
      addedAt: new Date().toISOString(),
    };
    TaskService.add(newTask);
    refresh();
  };

  const updateTask = (task: Task) => {
    TaskService.update(task);
    refresh();
  };

  const deleteTask = (id: string) => {
    TaskService.delete(id);
    refresh();
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask
  };
};
