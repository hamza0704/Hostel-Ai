import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PriorityBadge, StatusBadge, CategoryBadge } from '@/components/ui/badges';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Complaint } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MapPin, Sparkles } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
  showActions?: boolean;
  onStatusChange?: (status: 'pending' | 'in_progress' | 'resolved') => void;
}

export function ComplaintCard({ complaint, onClick, showActions = false, onStatusChange }: ComplaintCardProps) {
  return (
    <Card
      className="group transition-all duration-200 hover:shadow-lg hover:border-primary/20 animate-scale-in"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={complaint.category} />
              <PriorityBadge priority={complaint.priority} />
              {complaint.aiClassified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              )}
            </div>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {complaint.title}
            </h3>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {complaint.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {complaint.studentRoom || 'N/A'}
            </span>
            <span>{complaint.studentName}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(complaint.createdAt, { addSuffix: true })}
          </span>
        </div>
        
        {/* Admin Actions */}
        {showActions && onStatusChange && (
          <div className="mt-4 pt-4 border-t flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Update Status:</span>
            <Select
              value={complaint.status}
              onValueChange={(value) => onStatusChange(value as 'pending' | 'in_progress' | 'resolved')}
            >
              <SelectTrigger className="w-[150px]" onClick={(e) => e.stopPropagation()}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
