import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { CategoryChart, WeeklyTrendChart, ResolutionTimeChart } from '@/components/Charts';
import { mockDashboardStats, mockCategoryStats, mockWeeklyTrend } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, CheckCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const stats = mockDashboardStats;

  const handleLogout = () => {
    navigate('/');
  };

  // Mock resolution time data
  const resolutionTimeData = [
    { day: 'Mon', time: 24 },
    { day: 'Tue', time: 18 },
    { day: 'Wed', time: 22 },
    { day: 'Thu', time: 15 },
    { day: 'Fri', time: 20 },
    { day: 'Sat', time: 12 },
    { day: 'Sun', time: 8 }
  ];

  const resolutionRate = Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Insights and trends for better decision making</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Resolution Rate"
              value={`${resolutionRate}%`}
              subtitle="Complaints resolved"
              icon={Target}
              variant="success"
            />
            <StatCard
              title="Avg. Resolution Time"
              value={`${stats.averageResolutionTime}h`}
              subtitle="Hours to resolve"
              icon={Clock}
              variant="primary"
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              title="Weekly Complaints"
              value={57}
              subtitle="This week"
              icon={TrendingUp}
              variant="warning"
              trend={{ value: 12, positive: false }}
            />
            <StatCard
              title="Satisfaction"
              value="87%"
              subtitle="Based on feedback"
              icon={CheckCircle}
              variant="success"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryChart data={mockCategoryStats} />
            <WeeklyTrendChart data={mockWeeklyTrend} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResolutionTimeChart data={resolutionTimeData} />
            
            {/* Key Insights */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-base">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <h4 className="font-medium text-destructive mb-1">Peak Complaint Day</h4>
                  <p className="text-sm text-muted-foreground">
                    Thursday has the highest complaints (15). Consider additional staff.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <h4 className="font-medium text-amber-600 mb-1">Top Issue Category</h4>
                  <p className="text-sm text-muted-foreground">
                    Electricity issues account for 32% of all complaints this week.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="font-medium text-emerald-600 mb-1">Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Average resolution time improved by 8% compared to last week.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
