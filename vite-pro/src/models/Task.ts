export type TaskState = "todo" | "doing" | "done";

export interface Task {
  id: string;
  name: string;                    
  description: string;             
  priority: "low" | "mid" | "high";
  storyId: string;                 
  estimatedTime: number;           
  state: TaskState;                
  createdAt: string;               
  startDate?: string;              
  endDate?: string;                
  assignedTo: string;             
}