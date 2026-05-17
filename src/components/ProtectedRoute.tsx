import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    const authPath = requiredRole === 'admin' ? '/admin/auth' : '/student/auth';
    return <Navigate to={redirectTo || authPath} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const authPath = requiredRole === 'admin' ? '/admin/auth' : '/student/auth';
    return <Navigate to={redirectTo || authPath} replace />;
  }

  return <>{children}</>;
}
