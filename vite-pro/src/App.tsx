import React, { useEffect, useState } from 'react';
import './App.css';
import UserProfile from './components/UserProfile';
import ProjectSelector from './components/ProjectSelector';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import TaskKanban from './components/TaskKanban';
import TaskService from './services/TaskService';
import { Task } from './models/Task';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const allTasks = TaskService.getAll();
    setTasks(allTasks);
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>ManagMe Dashboard</h1>
        <UserProfile />
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Wybierz aktywny projekt</h2>
        <ProjectSelector />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Lista projektów</h2>
        <ProjectList />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Historyjki projektu</h2>
        <StoryList />
      </section>

      <section>
        <h2>Tablica zadań (Kanban)</h2>
        <TaskKanban tasks={tasks} />
      </section>
    </div>
  );
}

export default App;
