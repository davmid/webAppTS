import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProjectsColumn from '../components/ProjectColumn';
import StoriesColumn from '../components/StoriesColumn';
import TasksColumn from '../components/TasksColumn';
import TaskDetail from '../components/TaskDetail';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

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
  const { theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('User fetch error:', userError?.message);
        return;
      }

      setUserEmail(userData.user.email ?? null);
      setUserId(userData.user.id ?? null);

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('name, role')
        .eq('user_id', userData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
      } else if (profileData) {
        setUserName(profileData.name ?? null);
        setUserRole(profileData.role ?? null);
      }
    };
    fetchUserAndProfile();
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
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 dark:bg-[#0d1b2a] dark:text-[#e0e1dd] flex transition-colors duration-300">
      <Sidebar selectedProject={selectedProject} onSelectProject={setSelectedProject} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">
            Welcome, {userName || userEmail}{userRole ? ` (${userRole})` : ''}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
          </div>
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

        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-[#e0e1dd]">Backlog</h2>
        <div className="flex flex-wrap gap-2 mb-8 w-full min-h-[60px]">
          {tasks.filter(task => !task.state).length > 0 ? (
            tasks.filter(task => !task.state).map(task => (
              <div
                data-testId="task-backlog"
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                onClick={() => setSelectedTask(task.id)}
                className="px-8 py-4 bg-blue-500 text-white rounded cursor-move hover:bg-blue-600 transition-colors duration-300"
              >
                {task.name}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No tasks available.</p>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-[#e0e1dd]">Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {columns.map(col => (
            <div
              key={col}
              onDrop={(e) => onDrop(e, col)}
              onDragOver={(e) => e.preventDefault()}
              className="p-4 bg-gray-200 dark:bg-gray-700 rounded min-h-[250px] text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-3 capitalize">{col}</h3>
              {tasks.filter(t => t.state === col).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onClick={() => setSelectedTask(task.id)}
                  className="bg-blue-500 p-3 rounded mb-3 cursor-move text-white hover:bg-blue-600 transition-colors duration-300"
                >
                  {task.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <TaskDetail
              taskId={selectedTask}
              onClose={() => setSelectedTask(null)}
              onDeleteTask={() => {
                fetchTasks();
                setSelectedTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}