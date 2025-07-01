import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Task {
  id: string;
  name: string;
  description?: string;
  storyId: string;
  priority?: string;
  state?: string;
  estimated_hours?: number;
  worked_hours?: number;
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
      <h2 className="text-lg font-semibold mb-2">Tasks</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Task title"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button
          className="w-full bg-[#415a77] hover:bg-[#324960] text-white py-2 rounded font-semibold"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-[#1b263b] p-3 rounded hover:bg-[#415a77] cursor-pointer"
          >
            <div onClick={() => onSelectTask(task.id)}>
              <p className="font-semibold">{task.name}</p>
              <p className="text-sm text-[#e0e1dd99]">{task.description}</p>
            </div>
            <button
              className="text-red-400 hover:text-red-600 ml-2"
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