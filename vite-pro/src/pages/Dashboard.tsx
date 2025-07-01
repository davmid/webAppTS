import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProjectsColumn from '../components/ProjectColumn';
import StoriesColumn from '../components/StoriesColumn';
import TasksColumn from '../components/TasksColumn';
import TaskDetail from '../components/TaskDetail';
import Sidebar from '../components/Sidebar';

interface Task {
  id: string;
  name: string;
  description?: string;
  story_id: string;
  user_id: string;
  priority?: string;
  state: 'todo' | 'doing' | 'done' | null;
  estimated_hours?: number;
  worked_hours?: number;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
}

const columns: Task['state'][] = ['todo', 'doing', 'done'];

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error('User fetch error:', error?.message);
      } else {
        setUserEmail(data.user.email ?? null);
        setUserId(data.user.id ?? null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedStory && userId) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [selectedStory, userId]);

  const fetchTasks = async () => {
    if (!selectedStory || !userId) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('story_id', selectedStory)
      .eq('user_id', userId);

    if (error) {
      console.error('Fetch tasks error:', error.message);
    } else {
      setTasks(data ?? []);
    }
  };

  const updateTaskState = async (taskId: string, newState: Task['state']) => {
    if (!userId) return;
    const { error } = await supabase
      .from('tasks')
      .update({ state: newState })
      .eq('id', taskId)
      .eq('user_id', userId);

    if (!error) {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, state: newState } : t))
      );
    } else {
      console.error('Update task error:', error.message);
    }
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDrop = (e: React.DragEvent, column: Task['state']) => {
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskState(taskId, column);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1b2a] text-[#e0e1dd] flex">
      <Sidebar selectedProject={selectedProject} onSelectProject={setSelectedProject} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Welcome, {userEmail}</h1>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>

        <div className="flex gap-6 w-full mb-10">
          <div className="flex-1">
            {userId && (
              <ProjectsColumn
                userId={userId}
                onSelectProject={setSelectedProject}
                selectedProject={selectedProject}
              />
            )}
          </div>
          <div className="flex-1">
            <StoriesColumn
              projectId={selectedProject ?? ''}
              selectedStory={selectedStory}
              onSelectStory={(id) => {
                setSelectedStory(id);
                setSelectedTask(null);
              }}
            />
          </div>
          <div className="flex-1">
            {userId && selectedStory && (
              <TasksColumn
                storyId={selectedStory}
                userId={userId}
                onSelectTask={setSelectedTask}
                onTaskAdded={fetchTasks}
              />
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">Backlog</h2>
        <div className="flex flex-wrap gap-2 mb-8 w-full min-h-[60px]">
          {tasks.filter(task => !task.state).length > 0 ? (
            tasks.filter(task => !task.state).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                onClick={() => setSelectedTask(task.id)}
                className="p-2 bg-[#415a77] text-white rounded cursor-move"
              >
                {task.name}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No tasks available.</p>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {columns.map(col => (
            <div
              key={col}
              onDrop={(e) => onDrop(e, col)}
              onDragOver={(e) => e.preventDefault()}
              className="p-4 bg-[#1b263b] rounded min-h-[250px] text-white"
            >
              <h3 className="text-lg font-semibold mb-3 capitalize">{col}</h3>
              {tasks.filter(t => t.state === col).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onClick={() => setSelectedTask(task.id)}
                  className="bg-[#415a77] p-3 rounded mb-3 cursor-move"
                >
                  {task.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedTask && (
          <TaskDetail
            taskId={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDeleteTask={() => {
              fetchTasks();
              setSelectedTask(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
