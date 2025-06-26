
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';
import { User } from '@/pages/Index';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  currentUser: User;
}

const TaskList = ({ tasks, onTaskClick, onStatusChange, currentUser }: TaskListProps) => {
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || 
      (filter === 'By Due Date' && true) || 
      (filter === 'By Status' && true);
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesFilter && matchesStatus;
  });

  const getEmployeeName = (employeeId: string) => {
    const employees = [
      { id: '2001', name: 'John Doe' },
      { id: '2002', name: 'Jane Smith' },
      { id: '2003', name: 'Hackman Adu Gyamfi' },
      { id: '2004', name: 'Micheal Nkrumah' },
    ];
    return employees.find(emp => emp.id === employeeId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Task List</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filter:</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="By Due Date">By Due Date</SelectItem>
                <SelectItem value="By Status">By Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Task Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTaskClick(task)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {getEmployeeName(task.assignedTo).split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{getEmployeeName(task.assignedTo)}</p>
                    <p className="text-sm text-gray-500">{task.createdOn}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status}
                  </Badge>
                  {currentUser.role === 'admin' && (
                    <Select 
                      value={task.status} 
                      onValueChange={(value) => {
                        onStatusChange(task.id, value as Task['status']);
                      }}
                    >
                      <SelectTrigger className="w-32" onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Subject: {task.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">Start Date:</span> {task.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span> {task.endDate}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                    {task.priority} Priority
                  </Badge>
                  <div className="flex space-x-2">
                    <Badge className="bg-teal-500" variant="secondary">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
