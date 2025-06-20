import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../services/TaskService";
import { UserService } from "../services/UserService";
import { useState } from "react";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = TaskService.getById(id || "");
  const users = UserService.getAll().filter(u => u.role !== "admin");

  const [selectedUserId, setSelectedUserId] = useState("");

  if (!task) return <div>Nie znaleziono zadania</div>;

  const handleAssign = () => {
    if (selectedUserId) {
        TaskService.update({
          ...task,
          userId: selectedUserId,
          startedAt: new Date().toISOString(),
          state: "doing"
        });
      navigate("/tasks");
    }
  };

  const handleFinish = () => {
      TaskService.update({
        ...task,
        finishedAt: new Date().toISOString(),
        state: "done"
      });
    navigate("/tasks");
  };

  const assignedUser = task.userId
    ? UserService.getById(task.userId)?.name
    : "Brak";

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">{task.name}</h1>
      <p>{task.description}</p>
      <p><strong>Priorytet:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.state}</p>
      <p><strong>Przypisana osoba:</strong> {assignedUser}</p>
      <p><strong>Dodano:</strong> {new Date(task.createdAt).toLocaleString()}</p>
      {task.startedAt && (
        <p><strong>Rozpoczęto:</strong> {new Date(task.startedAt).toLocaleString()}</p>
      )}
      {task.finishedAt && (
        <p><strong>Zakończono:</strong> {new Date(task.finishedAt).toLocaleString()}</p>
      )}
      <p><strong>Estymacja:</strong> {task.estimatedHours}h</p>

      {task.state === "todo" && (
        <div className="flex items-center gap-2">
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Wybierz osobę --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Przypisz
          </button>
        </div>
      )}

      {task.state === "doing" && (
        <button
          onClick={handleFinish}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Oznacz jako zakończone
        </button>
      )}
    </div>
  );
}
