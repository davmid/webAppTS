import { useState, useEffect } from "react";
import { ProjectService, Project } from "../services/ProjectService";
import { v4 as uuidv4 } from "uuid";

export const useProjectLogic = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const saved = ProjectService.getProjects();
    setProjects(saved);

    const activeId = localStorage.getItem("activeProjectId");
    if (activeId) {
      const project = saved.find(p => p.id === activeId);
      if (project) setActiveProject(project);
    }
  }, []);

  const handleAddProject = () => {
    if (!projectName.trim()) return;

    const newProject: Project = {
      id: uuidv4(),
      name: projectName,
      description: projectDescription,
    };

    ProjectService.addProject(newProject);
    const updated = ProjectService.getProjects();
    setProjects(updated);
    setProjectName("");
    setProjectDescription("");
  };

  const handleProjectSelect = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setActiveProject(project);
      localStorage.setItem("activeProjectId", project.id);
    }
  };

  return {
    projects,
    activeProject,
    projectName,
    projectDescription,
    setProjectName,
    setProjectDescription,
    handleAddProject,
    handleProjectSelect
  };
};
