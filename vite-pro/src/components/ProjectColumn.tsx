
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
}

export default function ProjectsColumn({
  onSelectProject,
}: {
  onSelectProject: (id: string) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    if (!error && data) setProjects(data);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const addProject = async () => {
    if (!newName.trim() || !userId) return;
    const { error } = await supabase.from('projects').insert({
      name: newName,
      description: newDesc,
      user_id: userId,
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
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="flex justify-between items-center bg-[#1b263b] p-3 rounded hover:bg-[#415a77] cursor-pointer"
            onClick={() => onSelectProject(proj.id)}
          >
            <div>
              <p className="font-semibold">{proj.name}</p>
              <p className="text-sm text-[#e0e1dd99]">{proj.description}</p>
            </div>
            <button
              className="text-red-400 hover:text-red-600 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(proj.id);
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
