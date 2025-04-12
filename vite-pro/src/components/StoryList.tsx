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
      state: "todo",
      ownerId: "1",
    };

    StoryService.addStory(newStory);
    setStories(StoryService.getByProject(activeProject));
    setName("");
    setDescription("");
  };

  const deleteStory = (id: string) => {
    StoryService.deleteStory(id);
    setStories(StoryService.getByProject(activeProject!));
  };

  const updateStoryState = (story: Story, newState: Story["state"]) => {
    const updated = { ...story, state: newState };
    StoryService.updateStory(updated);
    setStories(StoryService.getByProject(activeProject!));
  };

  const grouped = {
    todo: stories.filter(s => s.state === "todo"),
    inProgress: stories.filter(s => s.state === "in-progress"),
    done: stories.filter(s => s.state === "done"),
  };

  return (
    <div>
      <h3>Dodaj nową historyjkę</h3>
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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as "low" | "mid" | "high")}
      >
        <option value="low">Niski</option>
        <option value="mid">Średni</option>
        <option value="high">Wysoki</option>
      </select>
      <button onClick={addStory}>Dodaj</button>

      <hr />

      <div style={{ display: "flex", gap: "40px" }}>
        {/* TODO */}
        <div>
          <h4>📋 Do zrobienia</h4>
          {grouped.todo.length === 0 && <p>Brak zadań</p>}
          <ul>
            {grouped.todo.map((story) => (
              <li key={story.id}>
                <strong>{story.name}</strong> - {story.description} [{story.priority}]
                <br />
                <button onClick={() => updateStoryState(story, "in-progress")}>
                  Rozpocznij
                </button>
                <button onClick={() => deleteStory(story.id)}>Usuń</button>
              </li>
            ))}
          </ul>
        </div>

        {/* IN PROGRESS */}
        <div>
          <h4>🚧 W trakcie</h4>
          {grouped.inProgress.length === 0 && <p>Brak zadań</p>}
          <ul>
            {grouped.inProgress.map((story) => (
              <li key={story.id}>
                <strong>{story.name}</strong> - {story.description} [{story.priority}]
                <br />
                <button onClick={() => updateStoryState(story, "done")}>Zakończ</button>
                <button onClick={() => deleteStory(story.id)}>Usuń</button>
              </li>
            ))}
          </ul>
        </div>

        {/* DONE */}
        <div>
          <h4>✅ Zrobione</h4>
          {grouped.done.length === 0 && <p>Brak zadań</p>}
          <ul>
            {grouped.done.map((story) => (
              <li key={story.id}>
                <strong>{story.name}</strong> - {story.description} [{story.priority}]
                <br />
                <button onClick={() => deleteStory(story.id)}>Usuń</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoryList;
