import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Task {
  id: string;
  name: string;
  description?: string;
  story_id: string;
  priority?: string;
  state?: string;
  estimated_hours?: number;
  worked_hours?: number;
  assigned_to?: string;
}

interface TasksColumnProps {
  storyId: string;
  userId: string;
  onSelectTask: (id: string) => void;
  onTaskAdded: () => void;
}

export default function TasksColumn({ storyId, userId, onSelectTask, onTaskAdded }: TasksColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('story_id', storyId);
    if (!error && data) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [storyId]);

  const addTask = async () => {
    if (!newName.trim()) return;

    const { error } = await supabase
      .from('tasks')
      .insert({
        name: newName,
        description: newDesc,
        story_id: storyId,
        user_id: userId,
      });

    if (!error) {
      setNewName('');
      setNewDesc('');
      fetchTasks();
      onTaskAdded();
    } else {
      console.error('Add task error:', error.message);
    }
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Tasks</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-gray-200 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          placeholder="Task title"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-gray-200 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-3 rounded cursor-pointer bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <div onClick={() => onSelectTask(task.id)}>
              <p className="font-semibold">{task.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded bg-transparent dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
              onClick={() => deleteTask(task.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}