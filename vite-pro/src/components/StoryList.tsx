import React, { useEffect, useState } from 'react';
import { Story } from '../models/Story';
import StoryService from '../services/StoryService';

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all');

  useEffect(() => {
    const allStories = StoryService.getStories();
    setStories(allStories);
  }, []);
  

  const filteredStories =
    filter === 'all' ? stories : stories.filter((s) => s.state === filter);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Filtruj: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">Wszystkie</option>
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zakończone</option>
        </select>
      </div>

      {filteredStories.length === 0 ? (
        <p>Brak historyjek.</p>
      ) : (
        <ul>
          {filteredStories.map((story) => (
            <li key={story.id}>
              <strong>{story.name}</strong> ({story.priority}) – {story.state}
              <p>{story.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoryList;
