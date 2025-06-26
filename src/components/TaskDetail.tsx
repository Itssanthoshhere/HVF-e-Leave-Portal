
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { User } from '@/pages/Index';

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  currentUser: User;
}

const TaskDetail = ({ task, onBack, onEdit, onDelete, currentUser }: TaskDetailProps) => {
  const getEmployeeName = (employeeId: string) => {
    const employees = [
      { id: '2001', name: 'John Doe' },
      { id: '2002', name: 'Jane Smith' },
      { id: '2003', name: 'Hackman Adu Gyamfi' },
      { id: '2004', name: 'Micheal Nkrumah' },
    ];
    return employees.find(emp => emp.id === employeeId)?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Task Detail</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>{task.title}</span>
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status}
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">{task.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Assigned By:</label>
                <p className="text-gray-600">{getEmployeeName(task.assignedBy)}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Assigned To:</label>
                <p className="text-gray-600">{getEmployeeName(task.assignedTo)}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Created On:</label>
                <p className="text-gray-600">{task.createdOn}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Start Date:</label>
                <p className="text-gray-600">{task.startDate}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Due Date:</label>
                <p className="text-gray-600">{task.endDate}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Priority:</label>
                <p className="text-gray-600">{task.priority} priority</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Status:</label>
                <p className="text-gray-600">{task.status}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Department:</label>
                <p className="text-gray-600">{task.department}</p>
              </div>
            </CardContent>
          </Card>

          {currentUser.role === 'admin' && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button onClick={onEdit} className="w-full bg-teal-600 hover:bg-teal-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </Button>
                  <Button onClick={onDelete} variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
