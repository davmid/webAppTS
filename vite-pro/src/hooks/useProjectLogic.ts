import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "../models/Project";
import { ProjectStorage } from "../utils/ProjectStorage";
import { ActiveProject } from "../utils/ActiveProject";

export const useProjectLogic = () => {
    const [projects, setProjects] = useState<Project[]>(ProjectStorage.getAll());
    const [activeProject, setActiveProject] = useState<string | null>(ActiveProject.getActive());
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const handleAddProject = () => {
        if (!projectName || !projectDescription) return;

        const newProject: Project = {
            id: uuidv4(),
            name: projectName,
            description: projectDescription,
        };

        ProjectStorage.add(newProject);
        setProjects(ProjectStorage.getAll());
        setProjectName("");
        setProjectDescription("");
    };

    const handleProjectSelect = (id: string) => {
        ActiveProject.setActive(id);
        setActiveProject(id);
    };

    return {
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
    };
};
