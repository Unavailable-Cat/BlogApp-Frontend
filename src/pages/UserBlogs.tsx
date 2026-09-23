import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, UserX } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import type { BlogResponseDTO } from '../types';
import { BlogCardGrid } from '../components/BlogCard';
import { BlogListSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/EmptyState';

export function UserBlogs() {
  const { username } = useParams<{ username: string }>();
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchBlogs = () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    blogApi
      .getByUsername(username)
      .then((data) => {
        setBlogs(data);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setBlogs([]);
        } else {
          setError(err instanceof ApiError ? err.message : 'Failed to load blogs.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, [username]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-ink-900 text-white flex items-center justify-center text-xl font-medium">
          {username ? username.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink-900">{username}</h1>
          <p className="text-sm text-ink-400">
            {loading ? 'Loading...' : `${blogs.length} ${blogs.length === 1 ? 'post' : 'posts'}`}
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <BlogListSkeleton />
      ) : notFound ? (
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
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBlogs} />
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No posts yet"
          message={`${username} hasn't published any posts yet.`}
        />
      ) : (
        <div className="animate-fade-in">
          <BlogCardGrid blogs={blogs} />
        </div>
      )}
    </div>
  );
}
