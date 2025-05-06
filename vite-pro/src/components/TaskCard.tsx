import React, { useState } from 'react';
import { Task } from '../models/Task';
import TaskService from '../services/TaskService';
import UserService from '../services/UserService';
import { User } from '../models/User';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [assignees] = useState<User[]>(UserService.getAll());
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleAssign = () => {
    const user = assignees.find((u) => u.id === selectedUser);
    if (user) {
      const updated = {
        ...task,
        assignedTo: user.id,
        startDate: new Date().toISOString(),
        status: 'doing',
      };
      TaskService.update(updated);
      onUpdate(updated);
    }
  };

  const handleMarkDone = () => {
    const updated = {
      ...task,
      status: 'done',
      endDate: new Date().toISOString(),
    };
    TaskService.update(updated);
    onUpdate(updated);
  };

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{task.name} ({task.priority})</h3>
      <p>{task.description}</p>
      <p>Status: <strong>{task.state}</strong></p>

      {task.state === 'todo' && (
        <div>
          <label>Przypisz użytkownika: </label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value=''>-- wybierz --</option>
            {assignees
              .filter((u) => u.role === 'devops' || u.role === 'developer')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </option>
              ))}
          </select>
          <button onClick={handleAssign}>Przypisz i rozpocznij</button>
        </div>
      )}

      {task.state === 'doing' && (
        <div>
          <p>Start: {task.startedAt}</p>
          <button onClick={handleMarkDone}>Zakończ zadanie</button>
        </div>
      )}

      {task.state === 'done' && (
        <div>
          <p>Zakończone: {task.completedAt}</p>
          <p>Wykonawca: {task.assigneeId}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
