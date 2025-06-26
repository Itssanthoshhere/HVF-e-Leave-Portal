import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CheckCircle, XCircle, Clock, User as UserIcon, ClipboardList, Plus, LogOut, Info } from 'lucide-react';
import LeaveApplicationForm from './LeaveApplicationForm';
import { User } from '@/pages/Index';
import TaskManager from './TaskManager';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmployeeDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface LeaveRequest {
  id: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  adminRemarks?: string;
}

const EmployeeDashboard = ({ user, onLogout }: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      fromDate: '2025-01-15',
      toDate: '2025-01-17',
      leaveType: 'EL',
      reason: 'Family function',
      status: 'approved',
      appliedDate: '2025-01-10',
      adminRemarks: 'Approved for family function'
    },
    {
      id: '2',
      fromDate: '2025-02-20',
      toDate: '2025-02-22',
      leaveType: 'CL',
      reason: 'Personal work',
      status: 'pending',
      appliedDate: '2025-02-18'
    }
  ]);

  // Initialize leave balance based on HVF rules
  const initialLeaveBalance = {
    'CL': 10,   // Casual Leave
    'EL': 30,   // Earned Leave
    'HPL': 20,  // Half Pay Leave
    'SCL': 3,   // Special Casual Leave
    'PL': 15,   // Paternity Leave
    'ML': 180,  // Maternity Leave
    'IL': 999,  // Injury Leave (as per rules)
    'CCL': 730  // Child Care Leave (total service period)
  };

  // Calculate used leaves and remaining balance
  const calculateLeaveBalance = () => {
    const usedLeaves: Record<string, number> = {};
    
    leaveRequests
      .filter(req => req.status === 'approved')
      .forEach(req => {
        const days = Math.ceil((new Date(req.toDate).getTime() - new Date(req.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        usedLeaves[req.leaveType] = (usedLeaves[req.leaveType] || 0) + days;
      });

    const remainingBalance: Record<string, number> = {};
    Object.keys(initialLeaveBalance).forEach(leaveType => {
      remainingBalance[leaveType] = initialLeaveBalance[leaveType] - (usedLeaves[leaveType] || 0);
    });

    return remainingBalance;
  };

  const leaveBalance = calculateLeaveBalance();

  const handleLeaveSubmission = (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: Date.now().toString(),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    setLeaveRequests(prev => [newLeave, ...prev]);
    toast({
      title: "Leave Application Submitted",
      description: "Your leave request has been submitted successfully and is pending approval.",
    });
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLeaveTypeName = (code: string) => {
    const leaveTypeNames: Record<string, string> = {
      'CL': 'Casual Leave',
      'EL': 'Earned Leave',
      'HPL': 'Half Pay Leave',
      'SCL': 'Special Casual Leave',
      'PL': 'Paternity Leave',
      'ML': 'Maternity Leave',
      'IL': 'Injury Leave',
      'CCL': 'Child Care Leave'
    };
    return leaveTypeNames[code] || code;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Employee Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Leave Balance Summary */}
        <div className="mb-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Total Leave Balance Summary:</strong> 
              CL: {leaveBalance.CL} days | EL: {leaveBalance.EL} days | HPL: {leaveBalance.HPL} days | SCL: {leaveBalance.SCL} days
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.CL}</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earned Leave</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.EL}</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Half Pay Leave</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.HPL}</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Special CL</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.SCL}</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply Leave</TabsTrigger>
            <TabsTrigger value="history">Leave History</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  View your leave balance and recent leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Leave Balance</h3>
                      <p className="text-sm text-gray-600">Check your remaining leave days</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {leaveBalance.CL} days
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Recent Leave Applications</h3>
                      <p className="text-sm text-gray-600">View your recent leave requests</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      2 applications
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Apply for Leave</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below to submit your leave request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveApplicationForm 
                  onSubmit={handleLeaveSubmission}
                  leaveBalance={leaveBalance}
                  existingLeaves={leaveRequests}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
                <CardDescription>
                  View all your leave applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{getLeaveTypeName(request.leaveType)} ({request.leaveType})</h3>
                          <p className="text-sm text-gray-600">{request.reason}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">From:</span>
                          <p>{new Date(request.fromDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">To:</span>
                          <p>{new Date(request.toDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span>
                          <p>{new Date(request.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>
                          <p>{Math.ceil((new Date(request.toDate).getTime() - new Date(request.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days</p>
                        </div>
                      </div>
                      
                      {request.adminRemarks && (
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="font-medium text-sm">Admin Remarks:</span>
                          <p className="text-sm mt-1">{request.adminRemarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <TaskManager user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
