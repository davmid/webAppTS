import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../models/Task";
import { TaskStorage } from "../utils/TaskStorage";
import { UserSession } from "../utils/UserSession";

export const useTaskLogic = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const user = UserSession.getLoggedUser();

  const loadTasks = () => {
    setTasks(TaskStorage.getAll());
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = (taskData: Omit<Task, "id" | "addedAt" | "state">) => {
    const task: Task = {
      ...taskData,
      id: uuidv4(),
      addedAt: new Date().toISOString(),
      state: "todo",
    };

    TaskStorage.add(task);
    loadTasks();
  };

  const updateTask = (task: Task) => {
    TaskStorage.update(task);
    loadTasks();
  };

  const deleteTask = (id: string) => {
    TaskStorage.delete(id);
    loadTasks();
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
