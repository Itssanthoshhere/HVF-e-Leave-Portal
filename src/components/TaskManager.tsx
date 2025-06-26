
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import { Task, TaskFormData } from '@/types/task';
import { User } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface TaskManagerProps {
  user: User;
}

const TaskManager = ({ user }: TaskManagerProps) => {
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'App crashing',
      description: 'App is crashing when users try to add wallet. Please kindly check it and resolve it',
      assignedTo: '2003',
      assignedBy: '1',
      startDate: '2024-08-15',
      endDate: '2024-08-16',
      priority: 'High',
      status: 'Pending',
      department: 'Engineering',
      createdOn: '15 August, 2024'
    },
    {
      id: '2',
      title: 'Chat feature not working',
      description: 'Fix chat functionality in the Leave Management system',
      assignedTo: '2003',
      assignedBy: '1',
      startDate: '2024-08-15',
      endDate: '2024-08-24',
      priority: 'Medium',
      status: 'Completed',
      department: 'Engineering',
      createdOn: '15 August, 2024'
    },
    {
      id: '3',
      title: 'Cashout Implementation',
      description: 'Implement cashout functionality for the mobile application',
      assignedTo: '2004',
      assignedBy: '1',
      startDate: '2024-08-15',
      endDate: '2024-08-23',
      priority: 'High',
      status: 'In Progress',
      department: 'Engineering',
      createdOn: '17 August, 2024'
    },
    {
      id: '4',
      title: 'App Crashing',
      description: 'Fix critical app crashes reported by users',
      assignedTo: '2001',
      assignedBy: '1',
      startDate: '2024-08-15',
      endDate: '2024-08-24',
      priority: 'High',
      status: 'Pending',
      department: 'Engineering',
      createdOn: '17 August, 2024'
    }
  ]);

  const { toast } = useToast();

  const handleCreateTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      assignedBy: user.id,
      status: 'Pending',
      department: 'Engineering',
      createdOn: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    };

    setTasks([newTask, ...tasks]);
    setView('list');
    toast({
      title: "Task Created",
      description: "Task has been successfully assigned.",
    });
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    toast({
      title: "Status Updated",
      description: `Task status changed to ${status}.`,
    });
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setView('list');
      setSelectedTask(null);
      toast({
        title: "Task Deleted",
        description: "Task has been successfully removed.",
      });
    }
  };

  // Filter tasks based on user role
  const filteredTasks = user.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.assignedTo === user.id);

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Task Management</h1>
            {user.role === 'admin' && (
              <Button onClick={() => setView('form')} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Assign New Task
              </Button>
            )}
          </div>
          <TaskList
            tasks={filteredTasks}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setView('detail');
            }}
            onStatusChange={handleStatusChange}
            currentUser={user}
          />
        </>
      )}

      {view === 'form' && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setView('list')}
          currentUser={user}
        />
      )}

      {view === 'detail' && selectedTask && (
        <TaskDetail
          task={selectedTask}
          onBack={() => setView('list')}
          onEdit={() => {
            // TODO: Implement edit functionality
            toast({
              title: "Edit Task",
              description: "Edit functionality will be implemented soon.",
            });
          }}
          onDelete={handleDeleteTask}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default TaskManager;
