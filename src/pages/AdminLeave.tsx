import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle, XCircle, Phone, User, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeaveApplicationWithStudent {
  id: string;
  profile_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_phone: string | null;
  parent_consent_obtained: boolean;
  admin_notes: string | null;
  created_at: string;
  profiles: {
    student_name: string;
    phone_number: string;
    room_id: string | null;
  };
}

export default function AdminLeave() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplicationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplicationWithStudent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [parentConsent, setParentConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeaveApplications();
    } else if (!authLoading && !user) {
      navigate('/admin/auth');
    }
  }, [authLoading, user, navigate]);

  const fetchLeaveApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .select(`
          *,
          profiles (
            student_name,
            phone_number,
            room_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveApplications((data as LeaveApplicationWithStudent[]) || []);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (leave: LeaveApplicationWithStudent) => {
    setSelectedLeave(leave);
    setAdminNotes(leave.admin_notes || '');
    setParentConsent(leave.parent_consent_obtained);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
    if (!selectedLeave || !user) return;

    if (!parentConsent && newStatus === 'approved') {
      toast({
        title: 'Parent Consent Required',
        description: 'Please confirm parent consent before approving the leave.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('leave_applications')
        .update({
          status: newStatus,
          parent_consent_obtained: parentConsent,
          admin_notes: adminNotes.trim() || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', selectedLeave.id);

      if (error) throw error;

      toast({
        title: `Leave ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The leave application has been ${newStatus}.`,
      });

      setDialogOpen(false);
      fetchLeaveApplications();
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leave status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string, parentConsent: boolean) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return parentConsent ? (
          <Badge className="bg-amber-500">Awaiting Decision</Badge>
        ) : (
          <Badge variant="outline">Pending Consent</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filter applications
  const filteredApplications = leaveApplications.filter((leave) => {
    if (statusFilter === 'all') return true;
    return leave.status === statusFilter;
  });

  // Stats
  const pendingCount = leaveApplications.filter(l => l.status === 'pending').length;
  const approvedCount = leaveApplications.filter(l => l.status === 'approved').length;
  const rejectedCount = leaveApplications.filter(l => l.status === 'rejected').length;

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
              <p className="text-muted-foreground">Review and approve student leave applications</p>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{leaveApplications.length}</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{approvedCount}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rejectedCount}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Applications List */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Applications</CardTitle>
              <CardDescription>Click on an application to review and take action</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenReview(leave)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{leave.profiles.student_name}</span>
                              {leave.profiles.room_id && (
                                <Badge variant="secondary" className="text-xs">
                                  Room: {leave.profiles.room_id}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">
                              {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                              <span className="ml-2 text-muted-foreground">
                                ({calculateDays(leave.start_date, leave.end_date)} days)
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{leave.reason}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(leave.status, leave.parent_consent_obtained)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(leave.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No leave applications found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Leave Application</DialogTitle>
            <DialogDescription>
              Review the application details and contact parent for consent before approval.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4 mt-4">
              {/* Student Info */}
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{selectedLeave.profiles.student_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Student Phone:</span>
                    <p>{selectedLeave.profiles.phone_number}</p>
                  </div>
                  {selectedLeave.parent_phone && (
                    <div>
                      <span className="text-muted-foreground">Parent Phone:</span>
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedLeave.parent_phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Leave Period:</span>
                  <Badge variant="secondary">
                    {calculateDays(selectedLeave.start_date, selectedLeave.end_date)} days
                  </Badge>
                </div>
                <p className="text-sm">
                  {formatDate(selectedLeave.start_date)} - {formatDate(selectedLeave.end_date)}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Reason:</span>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                  {selectedLeave.reason}
                </p>
              </div>

              {/* Parent Consent Checkbox */}
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <Checkbox
                  id="parentConsent"
                  checked={parentConsent}
                  onCheckedChange={(checked) => setParentConsent(checked as boolean)}
                  disabled={selectedLeave.status !== 'pending'}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="parentConsent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Parent Consent Obtained
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Confirm you have contacted and received consent from the parent
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add any notes about this application..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  disabled={selectedLeave.status !== 'pending'}
                />
              </div>

              {/* Action Buttons */}
              {selectedLeave.status === 'pending' ? (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={submitting}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={submitting || !parentConsent}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    This application has already been {selectedLeave.status}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
