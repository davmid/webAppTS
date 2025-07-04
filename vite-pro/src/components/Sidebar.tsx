import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface SidebarProps {
  selectedProject: string | null;
  onSelectProject: (id: string) => void;
}

interface Project {
  id: string;
  name: string;
}

export default function Sidebar({ selectedProject, onSelectProject }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('id, name');
    if (!error) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProjectName.trim()) return;
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: newProjectName.trim() })
      .select()
      .single();
    if (!error && data) {
      setProjects([...projects, data]);
      setNewProjectName('');
      setAdding(false);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 border-r border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4">Projects</h2>

      <ul className="space-y-2 mb-6">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded transition-colors duration-300
                ${selectedProject === project.id
                  ? 'bg-blue-600 text-white dark:bg-blue-700'
                  : 'bg-gray-700 text-gray-100 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              onClick={() => onSelectProject(project.id)}
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nazwa projektu"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-colors duration-300"
          />
          <div className="flex justify-between">
            <button
              onClick={addProject}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewProjectName('');
              }}
              className="text-sm text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full text-sm py-2 rounded bg-gray-700 text-gray-100 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          ➕ Add Project
        </button>
      )}
    </aside>
  );
}