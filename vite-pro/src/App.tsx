import { useAppLogic } from "./hooks/useApplogic";

function App() {
  const {
    user,
    activeProject,
    projects,
    projectName,
    projectDescription,
    setProjectName,
    setProjectDescription,
    handleAddProject,
    handleProjectSelect,
  } = useAppLogic();

  return (
    <div>
      <h1>Projekciki</h1>
      <p>Zalogowany jako: {user.firstName} {user.lastName} ({user.role})</p>

      {!activeProject && (
        <>
          <h2>Wybierz lub dodaj projekt</h2>
          <ul>
            {projects.map(p => (
              <li key={p.id}>
                {p.name} <button onClick={() => handleProjectSelect(p.id)}>Wybierz</button>
              </li>
            ))}
          </ul>

          <input
            placeholder="Nazwa projektu"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            placeholder="Opis"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <button onClick={handleAddProject}>Dodaj projekt</button>
        </>
      )}

      {activeProject && (
        <>
          <h2>Aktualny projekt: {activeProject.name}</h2>
          <p>Opis: {activeProject.description}</p>
        </>
      )}
    </div>
  );
}

export default App;
