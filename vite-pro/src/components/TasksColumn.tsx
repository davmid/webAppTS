import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Task {
  id: number;
  title: string;
  detail?: string;
  status: 'todo' | 'doing' | 'done';
  story_id: number;
}

export default function TasksColumn({
  storyId,
  onSelectTask,
}: {
  storyId: number;
  onSelectTask: (id: number) => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

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
    if (!title.trim()) return;
    const { error } = await supabase.from('tasks').insert({
      title,
      detail,
      status: 'todo',
      story_id: storyId,
    });
    if (!error) {
      setTitle('');
      setDetail('');
      fetchTasks();
    }
  };

  const deleteTask = async (id: number) => {
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  };

  return (
    <div className="bg-[#0d1b2a] text-[#e0e1dd] p-4 w-full max-w-md rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      <div className="space-y-2 mb-6">
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
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
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-[#e0e1dd99]">{task.detail}</p>
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
