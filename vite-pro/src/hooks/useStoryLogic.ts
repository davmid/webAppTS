import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Story, StoryPriority, StoryState } from "../models/Story";
import { StoryStorage } from "../utils/StoryStorage";
import { UserSession } from "../utils/UserSession";

export const useStoryLogic = (activeProject: string | null) => {
    const user = UserSession.getLoggedUser();

    const [stories, setStories] = useState<Story[]>([]);
    const [storyName, setStoryName] = useState("");
    const [storyDescription, setStoryDescription] = useState("");
    const [storyPriority, setStoryPriority] = useState<StoryPriority>("mid");

    useEffect(() => {
        if (activeProject) {
            setStories(StoryStorage.getByProject(activeProject));
        }
    }, [activeProject]);

    const handleAddStory = () => {
        if (!storyName || !activeProject) return;

        const newStory: Story = {
            id: uuidv4(),
            name: storyName,
            description: storyDescription,
            priority: storyPriority,
            projectId: activeProject,
            createdAt: new Date().toISOString(),
            state: "todo",
            ownerId: user.id,
        };

        StoryStorage.add(newStory);
        setStories(StoryStorage.getByProject(activeProject));
        setStoryName("");
        setStoryDescription("");
    };

    const handleChangeStoryState = (storyId: string) => {
        if (!activeProject) return;

        const updatedStories = StoryStorage.getByProject(activeProject).map((story) => {
            if (story.id === storyId) {
                const nextState: StoryState =
                    story.state === "todo" ? "in-progress" :
                    story.state === "in-progress" ? "done" : "todo";
                return { ...story, state: nextState };
            }
            return story;
        });

        localStorage.setItem(
            "stories",
            JSON.stringify([
                ...StoryStorage.getAll().filter((s) => s.projectId !== activeProject),
                ...updatedStories,
            ])
        );
        setStories(updatedStories);
    };

    const filterStoriesByState = (state: StoryState) =>
        stories.filter((story) => story.state === state);

    return {
        storyName,
        storyDescription,
        storyPriority,
        setStoryName,
        setStoryDescription,
        setStoryPriority,
        handleAddStory,
        handleChangeStoryState,
        filterStoriesByState,
    };
};
