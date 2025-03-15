import React, { useState, useEffect } from "react";
import { Story } from "../models/Story";
import { StoryService } from "../services/StoryService";
import { ActiveProjectService } from "../services/ActiveProjectService";
import { v4 as uuidv4 } from "uuid";

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "mid" | "high">("mid");
  const activeProject = ActiveProjectService.getActiveProject();

  useEffect(() => {
    if (activeProject) {
      setStories(StoryService.getByProject(activeProject));
    }
  }, [activeProject]);

  const addStory = () => {
    if (!name.trim() || !description.trim() || !activeProject) return;

    const newStory: Story = {
      id: uuidv4(),
      name,
      description,
      priority,
      projectId: activeProject,
      createdAt: new Date().toISOString(),
      status: "todo",
      ownerId: "1",
    };

    StoryService.save(newStory);
    setStories(StoryService.getByProject(activeProject));
    setName("");
    setDescription("");
  };

  const deleteStory = (id: string) => {
    StoryService.delete(id);
    setStories(StoryService.getByProject(activeProject!));
  };

  return (
    <div>
      <h3>History</h3>
      <input
        type="text"
        placeholder="Nazwa historyjki"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "mid" | "high")}>
        <option value="niski">Low</option>
        <option value="średni">Mid</option>
        <option value="wysoki">High</option>
      </select>
      <button onClick={addStory}>Add</button>

      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            {story.name} - {story.description} - {story.priority}
            <button onClick={() => deleteStory(story.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
