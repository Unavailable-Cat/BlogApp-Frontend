import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { Spinner } from '../components/Skeleton';

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      login(token)
        .then(() => navigate('/', { replace: true }))
        .catch(() => {
          setError('Failed to complete Google sign-in. Please try again.');
          setTimeout(() => {
            navigate('/login', {
              replace: true,
              state: { oauthError: 'Google sign-in failed. Please try again.' },
            });
          }, 2500);
        });
    } else {
      setError('No authentication token received from Google sign-in.');
      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { oauthError: 'No authentication token received. Please try again.' },
        });
      }, 2500);
    }
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <p className="text-ink-600 text-sm mb-2">{error}</p>
        <p className="text-ink-400 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner className="w-10 h-10" />
      <p className="text-sm text-ink-500">Completing sign-in...</p>
    </div>
  );
}
