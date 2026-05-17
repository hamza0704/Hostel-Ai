import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Building2, Home, FileText, BarChart3, LogOut, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

export function Sidebar({ role, onLogout }: SidebarProps) {
  const location = useLocation();
  const { profile, user } = useAuth();
  
  // Get display name from profile or fallback to email
  const displayName = profile?.student_name || user?.email?.split('@')[0] || role;
  const studentLinks = [
    { href: '/student', label: 'Dashboard', icon: Home },
    { href: '/student/new', label: 'New Complaint', icon: FileText },
    { href: '/student/complaints', label: 'My Complaints', icon: BarChart3 },
    { href: '/student/leave', label: 'Leave', icon: Calendar },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/complaints', label: 'All Complaints', icon: FileText },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/leave', label: 'Leave Management', icon: Calendar },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HostelAI</h1>
            <p className="text-xs text-sidebar-foreground/60">Smart Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="px-4 py-2 text-sm text-sidebar-foreground/60">
          Logged in as <span className="font-medium">{displayName}</span>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
