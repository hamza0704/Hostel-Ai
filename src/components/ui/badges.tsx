import { cn } from '@/lib/utils';
import { ComplaintPriority, ComplaintStatus, ComplaintCategory } from '@/types';
import { categoryConfig } from '@/lib/mock-data';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = {
    high: { label: 'High', className: 'priority-badge-high' },
    medium: { label: 'Medium', className: 'priority-badge-medium' },
    low: { label: 'Low', className: 'priority-badge-low' }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config[priority].className,
        className
      )}
    >
      {config[priority].label}
    </span>
  );
}

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    pending: { label: 'Pending', className: 'status-pending' },
    in_progress: { label: 'In Progress', className: 'status-progress' },
    resolved: { label: 'Resolved', className: 'status-resolved' }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config[status].className,
        className
      )}
    >
      {config[status].label}
    </span>
  );
}

interface CategoryBadgeProps {
  category: ComplaintCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
