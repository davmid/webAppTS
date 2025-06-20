import TaskService from "../services/TaskService";
import { useNavigate } from "react-router-dom";

export default function TaskKanban() {
  const navigate = useNavigate();
  const tasks = TaskService.getAll();

  const columns = {
    todo: tasks.filter(t => t.state === "todo"),
    doing: tasks.filter(t => t.state === "doing"),
    done: tasks.filter(t => t.state === "done"),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(columns).map(([state, tasks]) => (
        <div key={state} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold capitalize mb-4">{state}</h2>
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="cursor-pointer bg-white dark:bg-gray-700 p-3 mb-3 rounded shadow hover:bg-blue-100 dark:hover:bg-gray-600 transition"
            >
              <div className="font-semibold">{task.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{task.priority}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
