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
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Stories</h2>
      <div className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-gray-200 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          placeholder="Story title"
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
          onClick={addStory}
        >
          Add Story
        </button>
      </div>

      <ul className="space-y-2">
        {stories.map((story) => (
          <li
            key={story.id}
            className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors duration-300
              ${selectedStory === story.id
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }
              hover:bg-blue-300 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-100`}
            onClick={() => onSelectStory(story.id)}
          >
            <div>
              <p className="font-semibold">{story.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{story.description}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded bg-transparent dark:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
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