import React, { useState, useEffect } from "react";
import { Project } from "../models/Project";
import { ProjectService } from "../services/ProjectService";
import { v4 as uuidv4 } from "uuid";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setProjects(ProjectService.getProjects());
  }, []);

  const addProject = () => {
    if (!name.trim() || !description.trim()) return;

    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
    };

    ProjectService.addProject(newProject);
    setProjects(ProjectService.getProjects());
    setName("");
    setDescription("");
  };

  const deleteProject = (id: string) => {
    ProjectService.deleteProject(id);
    setProjects(ProjectService.getProjects());
  };

  return (
    <div>
      <h2>Lista Projektów</h2>
      <input
        type="text"
        placeholder="Nazwa projektu"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addProject}>Dodaj projekt</button>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.description}
            <button onClick={() => deleteProject(project.id)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
