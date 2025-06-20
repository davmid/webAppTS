import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProjectsColumn from '../components/ProjectColumn';
import StoriesColumn from '../components/StoriesColumn';
import TasksColumn from '../components/TasksColumn';
import TaskDetail from '../components/TaskDetail';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a] text-[#e0e1dd]">
      <header className="p-4 bg-[#1b263b] shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">ManagMe</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm">{userEmail ? `Welcome, ${userEmail}` : 'Welcome'}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          <div className="col-span-1 bg-[#1b263b] p-4 rounded shadow overflow-y-auto">
            <ProjectsColumn
              onSelectProject={(id) => {
                setSelectedProject(id);
                setSelectedStory(null);
                setSelectedTask(null);
              }}
            />
          </div>

          {selectedProject && (
            <div className="col-span-1 bg-[#1b263b] p-4 rounded shadow overflow-y-auto">
              <StoriesColumn
                projectId={selectedProject}
                onSelectStory={(id) => {
                  setSelectedStory(id);
                  setSelectedTask(null);
                }}
              />
            </div>
          )}

          {selectedStory && (
            <div className="col-span-1 bg-[#1b263b] p-4 rounded shadow overflow-y-auto">
              <TasksColumn
                storyId={selectedStory}
                onSelectTask={setSelectedTask}
              />
            </div>
          )}

          {selectedTask && (
            <div className="col-span-1 bg-[#1b263b] p-4 rounded shadow overflow-y-auto">
              <TaskDetail
                taskId={selectedTask}
                onClose={() => setSelectedTask(null)}
                onDeleteTask={() => setSelectedTask(null)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
