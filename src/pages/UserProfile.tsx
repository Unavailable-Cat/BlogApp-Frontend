import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, UserX } from 'lucide-react';
import { authApi, blogApi, ApiError } from '../lib/api';
import type { UserResponseDTO, BlogResponseDTO } from '../types';
import { BlogCardGrid } from '../components/BlogCard';
import { BlogListSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { formatDateLong } from '../lib/format';

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProfile = () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setNotFound(false);

    Promise.all([
      authApi.getUserByUsername(username),
      blogApi.getByUsername(username),
    ])
      .then(([userData, blogData]) => {
        setUser(userData);
        setBlogs(blogData);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof ApiError ? err.message : 'Failed to load profile.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full shimmer-bg" />
          <div className="space-y-2">
            <div className="h-6 w-40 shimmer-bg rounded" />
            <div className="h-4 w-28 shimmer-bg rounded" />
          </div>
        </div>
        <BlogListSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <EmptyState
          icon={<UserX className="w-7 h-7" />}
          title="User not found"
          message={`We couldn't find anyone with the username "${username}". Check the spelling and try again.`}
          action={
            <Link
              to="/"
              className="h-11 px-6 inline-flex items-center rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
            >
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <ErrorState message={error || 'Failed to load profile.'} onRetry={fetchProfile} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-full bg-ink-900 text-white flex items-center justify-center text-2xl font-medium shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl font-medium text-ink-900">{user.username}</h1>
            {user.description ? (
              <p className="text-sm text-ink-600 mt-2 leading-relaxed max-w-xl">{user.description}</p>
            ) : (
              <p className="text-sm text-ink-400 mt-2 italic">No description yet.</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDateLong(user.createdAt)}
              </span>
              <span>{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <h2 className="text-lg font-semibold text-ink-900 mb-4">Posts by {user.username}</h2>
      {blogs.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No posts yet"
          message={`${user.username} hasn't published any posts yet.`}
        />
      ) : (
        <BlogCardGrid blogs={blogs} />
      )}
    </div>
  );
}
