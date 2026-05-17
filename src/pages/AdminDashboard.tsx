import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { ComplaintCard } from '@/components/ComplaintCard';
import { CategoryChart, WeeklyTrendChart } from '@/components/Charts';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Complaint = Tables<'complaints'>;

interface ComplaintWithProfile extends Complaint {
  profiles: {
    student_name: string;
    room_id: string | null;
  } | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      navigate('/admin/auth');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchComplaints();
    }
  }, [user, role]);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, profiles(student_name, room_id)')
        .order('created_at', { ascending: false });

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

  // Calculate stats
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'high' && c.status !== 'resolved').length;

  // Get high priority complaints
  const highPriorityComplaints = complaints.filter(c => c.priority === 'high' && c.status !== 'resolved');

  // Calculate category stats
  const categoryStats = ['water', 'electricity', 'cleanliness', 'internet', 'security'].map(category => ({
    category: category as any,
    count: complaints.filter(c => c.category === category).length,
  }));

  // Calculate weekly trend (last 7 days)
  const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const count = complaints.filter(c => {
      const created = new Date(c.created_at);
      return created >= dayStart && created <= dayEnd;
    }).length;

    return { day: dayName, complaints: count };
  });

  // Format complaint for UI
  const formatComplaint = (c: ComplaintWithProfile) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    priority: c.priority,
    status: c.status,
    studentName: c.profiles?.student_name || 'Unknown',
    studentRoom: c.profiles?.room_id || '',
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
    imageUrl: c.image_url || undefined,
    aiClassified: c.ai_classified || false,
  });

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
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of hostel complaint management system</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Complaints"
              value={totalComplaints}
              icon={FileText}
              variant="primary"
            />
            <StatCard
              title="Pending"
              value={pendingComplaints}
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="In Progress"
              value={inProgressComplaints}
              icon={TrendingUp}
              variant="primary"
            />
            <StatCard
              title="Resolved"
              value={resolvedComplaints}
              icon={CheckCircle}
              variant="success"
            />
            <StatCard
              title="High Priority"
              value={highPriorityCount}
              icon={AlertTriangle}
              variant="danger"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryChart data={categoryStats} />
            <WeeklyTrendChart data={weeklyTrend} />
          </div>

          {/* High Priority Complaints */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              High Priority Issues
            </h2>
            <div className="grid gap-4">
              {highPriorityComplaints.length > 0 ? (
                highPriorityComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={formatComplaint(complaint)} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-status-resolved opacity-50" />
                  <p>No high priority issues at the moment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
