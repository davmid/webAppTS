import { useState } from "react";
import { Task } from "../models/Task";

export const useTaskLogic = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const createTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
    };

    const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((task) => task.id === taskId ? { ...task, ...updatedTask } : task)
        );
    };

    const deleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    return {
        tasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
