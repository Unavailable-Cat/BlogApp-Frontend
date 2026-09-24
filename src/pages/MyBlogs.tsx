import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, ArrowLeft } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import type { BlogResponseDTO } from '../types';
import { useAuth } from '../lib/auth-context';
import { BlogCardGrid } from '../components/BlogCard';
import { BlogListSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/EmptyState';

export function MyBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = () => {
    setLoading(true);
    setError(null);
    blogApi
      .getMyBlogs()
      .then((data) => setBlogs(data))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load your blogs.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink-900">My Profile</h1>
          <p className="text-sm text-ink-500 mt-1">
            {loading ? 'Loading...' : `${blogs.length} ${blogs.length === 1 ? 'post' : 'posts'}`}
            {user?.description && <span className="block mt-1 text-ink-600">{user.description}</span>}
          </p>
        </div>
        <Link
          to="/blog/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New blog
        </Link>
      </div>

      {loading ? (
        <BlogListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBlogs} />
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No blogs yet"
          message="You haven't published any posts yet. Start writing your first one."
          action={
            <Link
              to="/blog/new"
              className="h-11 px-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write your first post
            </Link>
          }
        />
      ) : (
        <div className="animate-fade-in">
          <BlogCardGrid blogs={blogs} showActions />
        </div>
      )}
    </div>
  );
}
