import { useProjectLogic } from "./useProjectLogic";
import { useStoryLogic } from "./useStoryLogic";
import { useTaskLogic } from "./useTaskLogic";
import { UserSession } from "../utils/UserSession";

export const useAppLogic = () => {
    const user = UserSession.getLoggedUser();

    const {
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
    } = useProjectLogic();

    const {
        storyName,
        storyDescription,
        storyPriority,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
    } = useStoryLogic(activeProject);

    const {
        tasks,
        createTask,
        updateTask,
        deleteTask,
    } = useTaskLogic();

    return {
        user,
        projects,
        activeProject,
        projectName,
        projectDescription,
        setProjectName,
        setProjectDescription,
        handleAddProject,
        handleProjectSelect,
        storyName,
        storyDescription,
        storyPriority,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
        tasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
