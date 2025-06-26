
  import { useState } from 'react';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { Textarea } from '@/components/ui/textarea';
  import { Shield, LogOut, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
  import { User as UserType } from '@/pages/Index';
  import { LeaveRequest } from './EmployeeDashboard';
  import { useToast } from '@/hooks/use-toast';

  interface AdminDashboardProps {
    user: UserType;
    onLogout: () => void;
  }

  const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
    const { toast } = useToast();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
      {
        id: '1',
        fromDate: '2024-01-15',
        toDate: '2024-01-17',
        leaveType: 'EL',
        reason: 'Family function',
        status: 'pending',
        appliedDate: '2024-01-10'
      },
      {
        id: '2',
        fromDate: '2024-02-20',
        toDate: '2024-02-22',
        leaveType: 'CL',
        reason: 'Personal work',
        status: 'pending',
        appliedDate: '2024-02-18'
      },
      {
        id: '3',
        fromDate: '2024-01-05',
        toDate: '2024-01-07',
        leaveType: 'SCL',
        reason: 'Examination',
        status: 'approved',
        appliedDate: '2024-01-01',
        adminRemarks: 'Approved for examination purpose'
      }
    ]);

    const [remarks, setRemarks] = useState<Record<string, string>>({});

    const getLeaveTypeName = (code: string) => {
      const leaveTypeNames: Record<string, string> = {
        'CL': 'Casual Leave',
        'EL': 'Earned Leave',
        'HPL': 'Half Pay Leave',
        'SCL': 'Special Casual Leave',
        'PL': 'Paternity Leave',
        'ML': 'Maternity Leave',
        '**': 'Injury Leave',
        'CCL': 'Child Care Leave'
      };
      return leaveTypeNames[code] || code;
    };

    const handleLeaveAction = (requestId: string, action: 'approved' | 'rejected') => {
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === requestId
            ? { ...request, status: action, adminRemarks: remarks[requestId] || '' }
            : request
        )
      );
      
      toast({
        title: `Leave ${action}`,
        description: `Leave request has been ${action} successfully.`,
      });
      
      setRemarks(prev => ({ ...prev, [requestId]: '' }));
    };

    const getStatusColor = (status: LeaveRequest['status']) => {
      switch (status) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800';
      }
    };

    const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
    const processedRequests = leaveRequests.filter(req => req.status !== 'pending');

    const stats = {
      total: leaveRequests.length,
      pending: pendingRequests.length,
      approved: leaveRequests.filter(req => req.status === 'approved').length,
      rejected: leaveRequests.filter(req => req.status === 'rejected').length
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome, {user.name}</p>
                </div>
              </div>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pending Requests ({stats.pending})</TabsTrigger>
              <TabsTrigger value="processed">Processed Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Leave Requests</CardTitle>
                  <CardDescription>
                    Review and approve/reject employee leave requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No pending requests
                      </div>
                    ) : (
                      pendingRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{getLeaveTypeName(request.leaveType)} ({request.leaveType})</h3>
                              <p className="text-gray-600">{request.reason}</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">From:</span>
                                  <p>{new Date(request.fromDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium">To:</span>
                                  <p>{new Date(request.toDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span>
                                  <p>{Math.ceil((new Date(request.toDate).getTime() - new Date(request.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days</p>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Admin Remarks</label>
                              <Textarea
                                placeholder="Add remarks (optional)"
                                value={remarks[request.id] || ''}
                                onChange={(e) => setRemarks(prev => ({ ...prev, [request.id]: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => handleLeaveAction(request.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleLeaveAction(request.id, 'rejected')}
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="processed">
              <Card>
                <CardHeader>
                  <CardTitle>Processed Leave Requests</CardTitle>
                  <CardDescription>
                    View all approved and rejected leave requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {processedRequests.map((request) => (
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
          </Tabs>
        </div>
      </div>
    );
  };

  export default AdminDashboard;
