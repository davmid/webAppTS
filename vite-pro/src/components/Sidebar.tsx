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

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <aside className="w-64 bg-[#0d1b2a] text-[#e0e1dd] p-4 border-r border-[#415a77]">
      <h2 className="text-lg font-semibold mb-4">Projekty</h2>

      <ul className="space-y-2 mb-6">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded hover:bg-[#1b263b] ${
                selectedProject === project.id ? 'bg-[#415a77]' : ''
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
            className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] text-sm"
          />
          <div className="flex justify-between">
            <button
              onClick={addProject}
              className="bg-[#415a77] hover:bg-[#324960] px-3 py-1 rounded text-sm"
            >
              Dodaj
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewProjectName('');
              }}
              className="text-sm text-gray-400 hover:text-red-400"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full text-sm py-2 rounded bg-[#1b263b] hover:bg-[#415a77]"
        >
          ➕ Dodaj projekt
        </button>
      )}
    </aside>
  );
}
