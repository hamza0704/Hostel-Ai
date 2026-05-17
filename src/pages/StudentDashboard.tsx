import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ComplaintCard } from '@/components/ComplaintCard';
import { StatCard } from '@/components/StatCard';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertTriangle, CalendarCheck, CalendarDays } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Complaint = Tables<'complaints'>;

interface Attendance {
  id: string;
  profile_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile) {
      fetchComplaints();
      fetchAttendance();
    } else if (!authLoading && !user) {
      navigate('/student/auth');
    }
  }, [profile, authLoading, user, navigate]);

  const fetchAttendance = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('profile_id', profile.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAttendance((data as Attendance[]) || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchComplaints = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  // Attendance stats
  const attendanceStats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    leave: attendance.filter(a => a.status === 'leave').length,
    total: attendance.length,
  };
  const attendancePercentage = attendanceStats.total > 0 
    ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100) 
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-emerald-500">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">Late</Badge>;
      case 'leave':
        return <Badge variant="outline">Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Convert DB complaint to UI format
  const formatComplaint = (c: Complaint) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    priority: c.priority,
    status: c.status,
    studentName: profile?.student_name || 'Unknown',
    studentRoom: profile?.room_id || '',
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
    imageUrl: c.image_url || undefined,
    aiClassified: c.ai_classified || false,
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="student" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome Back, {profile?.student_name || 'Student'}!
            </h1>
            <p className="text-muted-foreground">Track and manage your hostel complaints</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Complaints"
              value={complaints.length}
              icon={FileText}
              variant="primary"
            />
            <StatCard
              title="Pending"
              value={pendingCount}
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="In Progress"
              value={inProgressCount}
              icon={AlertTriangle}
              variant="primary"
            />
            <StatCard
              title="Resolved"
              value={resolvedCount}
              icon={CheckCircle}
              variant="success"
            />
          </div>

          {/* Attendance Overview */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Your attendance record for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Attendance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-2xl font-bold text-primary">{attendancePercentage}%</p>
                    <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{attendanceStats.present}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 text-center">
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 text-center">
                    <p className="text-2xl font-bold text-amber-600">{attendanceStats.late}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">{attendanceStats.leave}</p>
                    <p className="text-xs text-muted-foreground">Leave</p>
                  </div>
                </div>

                {/* Recent Attendance History */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Recent History
                  </h3>
                  {attendance.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {attendance.slice(0, 14).map((record) => (
                        <div 
                          key={record.id} 
                          className="p-2 rounded-lg border text-center hover:bg-muted/50 transition-colors"
                        >
                          <p className="text-xs text-muted-foreground mb-1">{formatDate(record.date)}</p>
                          {getStatusBadge(record.status)}
                          {record.check_in_time && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {record.check_in_time.slice(0, 5)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No attendance records yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Complaints */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
            <div className="grid gap-4">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={formatComplaint(complaint)} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No complaints yet. Submit your first complaint!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
