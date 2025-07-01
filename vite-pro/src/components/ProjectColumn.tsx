import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectsColumnProps {
  userId: string;
  onSelectProject: (id: string) => void;
  selectedProject: string | null;
}

export default function ProjectsColumn({ userId, onSelectProject, selectedProject }: ProjectsColumnProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const addProject = async () => {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user || !newName.trim()) return;

    const { error } = await supabase.from('projects').insert({
      name: newName,
      description: newDesc,
      user_id: user.id,
    });

    if (!error) {
      setNewName('');
      setNewDesc('');
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Projects</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-gray-200 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          placeholder="Project name"
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
          onClick={addProject}
        >
          Add Project
        </button>
      </div>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors duration-300
              ${selectedProject === project.id
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }
              hover:bg-blue-300 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-100`}
            onClick={() => onSelectProject(project.id)}
          >
            <div>
              <p className="font-semibold">{project.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded bg-transparent dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}