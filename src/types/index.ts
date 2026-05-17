export type UserRole = 'student' | 'admin';

export type ComplaintCategory = 'water' | 'electricity' | 'cleanliness' | 'internet' | 'security';

export type ComplaintPriority = 'low' | 'medium' | 'high';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  studentName: string;
  studentRoom: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  aiClassified?: boolean;
}

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  highPriorityCount: number;
  averageResolutionTime: number;
}

export interface CategoryStats {
  category: ComplaintCategory;
  count: number;
}

export interface WeeklyTrend {
  day: string;
  complaints: number;
}
