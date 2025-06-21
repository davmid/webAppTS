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
}

export default function ProjectsColumn({ userId, onSelectProject }: ProjectsColumnProps) {
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

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Projects</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Project name"
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
          onClick={addProject}
        >
          Add Project
        </button>
      </div>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-[#1b263b] p-3 rounded hover:bg-[#415a77] cursor-pointer"
            onClick={() => onSelectProject(project.id)}
          >
            <p className="font-semibold">{project.name}</p>
            <p className="text-sm text-[#e0e1dd99]">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
