import { Task } from "../models/Task";
import TaskCard from "./TaskCard";

type Props = {
  tasks: Task[];
};

const TaskKanban = ({ tasks }: Props) => {
  const states: { [key: string]: string } = {
    todo: "Do zrobienia",
    doing: "W trakcie",
    done: "Zrobione",
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {Object.entries(states).map(([stateKey, label]) => (
        <div key={stateKey} style={{ flex: 1 }}>
          <h3>{label}</h3>
          {tasks.filter(task => task.state === stateKey).map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskKanban;
