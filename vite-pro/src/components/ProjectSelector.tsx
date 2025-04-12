import React, { useState, useEffect } from "react";
import { ProjectService } from "../services/ProjectService";
import { ActiveProjectService } from "../services/ActiveProjectService";
import { Project } from "../models/Project";

const ProjectSelector: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    setProjects(ProjectService.getProjects());
    setActiveProject(ActiveProjectService.getActiveProject());
  }, []);

  const handleSelect = (projectId: string) => {
    ActiveProjectService.setActiveProject(projectId);
    setActiveProject(projectId);
  };

  return (
    <div>
      <h3>Wybierz projekt: </h3>
      <select value={activeProject || ""} onChange={(e) => handleSelect(e.target.value)}>
        <option value=""> Wybierz </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
