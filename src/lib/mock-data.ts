import { Complaint, DashboardStats, CategoryStats, WeeklyTrend, ComplaintCategory } from '@/types';

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'No water supply since morning',
    description: 'There is no water supply in the entire second floor since 6 AM. This is urgent as we cannot use washrooms.',
    category: 'water',
    priority: 'high',
    status: 'in_progress',
    studentName: 'Rahul Kumar',
    studentRoom: 'Room 204',
    createdAt: new Date('2024-01-15T06:00:00'),
    updatedAt: new Date('2024-01-15T08:30:00'),
    aiClassified: true
  },
  {
    id: '2',
    title: 'WiFi connectivity issues',
    description: 'The internet connection is very slow and keeps disconnecting every few minutes. Unable to attend online classes.',
    category: 'internet',
    priority: 'medium',
    status: 'pending',
    studentName: 'Priya Sharma',
    studentRoom: 'Room 312',
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    aiClassified: true
  },
  {
    id: '3',
    title: 'Broken light in corridor',
    description: 'The light in the corridor near room 105 is not working. It gets very dark at night.',
    category: 'electricity',
    priority: 'low',
    status: 'resolved',
    studentName: 'Amit Patel',
    studentRoom: 'Room 105',
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    aiClassified: true
  },
  {
    id: '4',
    title: 'Cockroach infestation in kitchen',
    description: 'There are many cockroaches in the common kitchen area. This is a serious hygiene issue.',
    category: 'cleanliness',
    priority: 'high',
    status: 'pending',
    studentName: 'Sneha Gupta',
    studentRoom: 'Room 401',
    createdAt: new Date('2024-01-15T12:00:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
    aiClassified: true
  },
  {
    id: '5',
    title: 'Main gate lock broken',
    description: 'The main entrance gate lock is broken and not closing properly. Security concern.',
    category: 'security',
    priority: 'high',
    status: 'in_progress',
    studentName: 'Vikram Singh',
    studentRoom: 'Room 102',
    createdAt: new Date('2024-01-15T07:30:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    aiClassified: true
  },
  {
    id: '6',
    title: 'AC not cooling properly',
    description: 'The air conditioner in my room is running but not cooling. The room temperature remains high.',
    category: 'electricity',
    priority: 'medium',
    status: 'pending',
    studentName: 'Kavya Reddy',
    studentRoom: 'Room 305',
    createdAt: new Date('2024-01-14T16:00:00'),
    updatedAt: new Date('2024-01-14T16:00:00'),
    aiClassified: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalComplaints: 47,
  pendingComplaints: 12,
  inProgressComplaints: 8,
  resolvedComplaints: 27,
  highPriorityCount: 5,
  averageResolutionTime: 18
};

export const mockCategoryStats: CategoryStats[] = [
  { category: 'water', count: 12 },
  { category: 'electricity', count: 15 },
  { category: 'cleanliness', count: 8 },
  { category: 'internet', count: 9 },
  { category: 'security', count: 3 }
];

export const mockWeeklyTrend: WeeklyTrend[] = [
  { day: 'Mon', complaints: 8 },
  { day: 'Tue', complaints: 12 },
  { day: 'Wed', complaints: 6 },
  { day: 'Thu', complaints: 15 },
  { day: 'Fri', complaints: 9 },
  { day: 'Sat', complaints: 4 },
  { day: 'Sun', complaints: 3 }
];

export const categoryConfig: Record<ComplaintCategory, { label: string; color: string; bgColor: string }> = {
  water: { label: 'Water', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
  electricity: { label: 'Electricity', color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  cleanliness: { label: 'Cleanliness', color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
  internet: { label: 'Internet', color: 'text-violet-600', bgColor: 'bg-violet-500/10' },
  security: { label: 'Security', color: 'text-red-600', bgColor: 'bg-red-500/10' }
};
