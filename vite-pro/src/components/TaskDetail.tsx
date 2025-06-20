import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { TaskState, TaskPriority } from '../models/Task';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onDeleteTask: () => void;
}

export default function TaskDetail({ taskId, onClose, onDeleteTask }: TaskDetailProps) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    if (data) setTask(data);
    setLoading(false);
  };

  const updateTask = async (field: string, value: any) => {
    if (!task) return;
    const { error } = await supabase
      .from('tasks')
      .update({ [field]: value })
      .eq('id', task.id);

    if (!error) fetchTask();
  };

  const deleteTask = async () => {
    await supabase.from('tasks').delete().eq('id', taskId);
    onDeleteTask();
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (loading || !task) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="bg-[#0d1b2a] text-[#e0e1dd] p-6 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{task.name}</h2>
        <button onClick={onClose} className="text-sm text-gray-400">✖ Close</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={task.description || ''}
            onChange={(e) => updateTask('description', e.target.value)}
            className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77]"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1">State</label>
            <select
              value={task.state}
              onChange={(e) => updateTask('state', e.target.value)}
              className="bg-[#1b263b] p-2 rounded border border-[#415a77]"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => updateTask('priority', e.target.value)}
              className="bg-[#1b263b] p-2 rounded border border-[#415a77]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Estimated Hours</label>
          <input
            type="number"
            value={task.estimated_hours || ''}
            onChange={(e) => updateTask('estimated_hours', Number(e.target.value))}
            className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77]"
          />
        </div>

        <div className="pt-4 flex justify-between">
          <button
            onClick={deleteTask}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Delete Task
          </button>
          <span className="text-sm text-gray-400 self-center">
            Created: {new Date(task.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
