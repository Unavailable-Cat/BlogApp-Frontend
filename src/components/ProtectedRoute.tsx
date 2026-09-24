import { type ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { useToast } from './Toast';
import { Spinner } from './Skeleton';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const notified = useRef(false);

  // Instead of silently bouncing guests to /login, let them know why they landed
  // there. Fires once per redirect (not on every re-render).
  useEffect(() => {
    if (!loading && !isAuthenticated && !notified.current) {
      notified.current = true;
      toast('Log in or register to get started.', 'info');
    }
  }, [loading, isAuthenticated, toast]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
