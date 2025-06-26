
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  startDate: string;
  endDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  department: string;
  createdOn: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  priority: 'High' | 'Medium' | 'Low';
}
