import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Story {
  id: string;
  name: string;
  description?: string;
  project_id: string;
}

export default function StoriesColumn({
  projectId,
  onSelectStory,
  selectedStory,
}: {
  projectId: string;
  onSelectStory: (id: string) => void;
  selectedStory: string | null;
}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('project_id', projectId);
    if (!error && data) setStories(data);
  };

  useEffect(() => {
    fetchStories();
  }, [projectId]);

  const addStory = async () => {
    if (!newName.trim()) return;

    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !sessionData?.user) {
      console.error('User fetch error:', sessionError?.message);
      return;
    }

    const { error } = await supabase
      .from('stories')
      .insert({
        name: newName,
        description: newDesc,
        project_id: projectId,
        user_id: sessionData.user.id,
      });

    if (!error) {
      setNewName('');
      setNewDesc('');
      fetchStories();
    } else {
      console.error('Add story error:', error.message);
    }
  };

  const deleteStory = async (id: string) => {
    await supabase.from('stories').delete().eq('id', id);
    fetchStories();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Stories</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-[#1b263b] border border-[#415a77] focus:outline-none"
          placeholder="Story title"
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
          onClick={addStory}
        >
          Add Story
        </button>
      </div>

      <ul className="space-y-2">
        {stories.map((story) => (
          <li
            key={story.id}
            className={`flex justify-between items-center p-3 rounded cursor-pointer ${
              selectedStory === story.id ? 'bg-[#415a77]' : 'bg-[#1b263b] hover:bg-[#415a77]'
            }`}
            onClick={() => onSelectStory(story.id)}
          >
            <div>
              <p className="font-semibold">{story.name}</p>
              <p className="text-sm text-[#e0e1dd99]">{story.description}</p>
            </div>
            <button
              className="text-red-400 hover:text-red-600 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                deleteStory(story.id);
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