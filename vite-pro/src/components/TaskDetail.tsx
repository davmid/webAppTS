import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onDeleteTask: () => void;
}

export default function TaskDetail({ taskId, onClose, onDeleteTask }: TaskDetailProps) {
  const [task, setTask] = useState<any>(null);
  const [formTask, setFormTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);

  const fetchTask = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    if (error) {
      console.error("Error fetching task:", error.message);
      setTask(null);
      setFormTask(null);
    } else if (data) {
      setTask(data);
      setFormTask(data);
      setAssignedTo(data.assigned_to || undefined);
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    if (!formTask) return;
    setSaving(true);
    const { error } = await supabase
      .from('tasks')
      .update({ ...formTask, assigned_to: assignedTo || null })
      .eq('id', taskId);
    if (error) {
      console.error("Error saving changes:", error.message);
    }
    setSaving(false);
    fetchTask();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, email');
      if (!error && data) {
        setUsers(data);
      } else if (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  const deleteTask = async () => {
    await supabase.from('tasks').delete().eq('id', taskId);
    onDeleteTask();
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (loading || !formTask) return <div className="p-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">Loading...</div>;

  return (
    <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg w-full max-w-4xl dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300"> {/* Zmienione max-w-xl na max-w-4xl */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{formTask.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300">✖ Close</button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            value={formTask.description || ''}
            onChange={(e) => setFormTask({ ...formTask, description: e.target.value })}
            className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">State</label>
            <select
              value={formTask.state || ''}
              onChange={(e) => setFormTask({ ...formTask, state: e.target.value })}
              className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Priority</label>
            <select
              value={formTask.priority || ''}
              onChange={(e) => setFormTask({ ...formTask, priority: e.target.value })}
              className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Assigned To</label>
          <select
            value={assignedTo || ''}
            onChange={(e) => setAssignedTo(e.target.value || undefined)}
            className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="">-- Unassigned --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Estimated Hours</label>
          <input
            type="number"
            value={formTask.estimated_hours || ''}
            onChange={(e) => setFormTask({ ...formTask, estimated_hours: Number(e.target.value) })}
            className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>

        <div className="pt-4 flex justify-between items-center">
          <button
            onClick={deleteTask}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 mr-20 mb-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Delete Task
          </button>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 mb-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {task?.created_at && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Created: {new Date(task.created_at).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}