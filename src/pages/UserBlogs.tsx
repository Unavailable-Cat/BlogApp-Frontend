import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, UserX, ChevronRight } from 'lucide-react';
import { authApi, blogApi, ApiError } from '../lib/api';
import type { UserResponseDTO, BlogResponseDTO } from '../types';
import { BlogCardGrid } from '../components/BlogCard';
import { BlogListSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { formatDateLong } from '../lib/format';

export function UserBlogs() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchData = () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProfile(null);

    Promise.all([
      authApi.getUserByUsername(username).catch((err) => {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }),
      blogApi.getByUsername(username),
    ])
      .then(([userData, blogData]) => {
        if (!userData) {
          setNotFound(true);
          setBlogs([]);
        } else {
          setProfile(userData);
          setBlogs(blogData);
        }
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load results.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {loading ? (
        <>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full shimmer-bg" />
            <div className="space-y-2">
              <div className="h-5 w-36 shimmer-bg rounded" />
              <div className="h-4 w-24 shimmer-bg rounded" />
            </div>
          </div>
          <BlogListSkeleton />
        </>
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
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          {/* Compact profile header */}
          {profile && (
            <div className="bg-white rounded-xl border border-ink-200 p-5 sm:p-6 shadow-sm mb-8 animate-fade-in">
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to={`/profile/${encodeURIComponent(profile.username)}`}
                  className="w-14 h-14 rounded-full bg-ink-900 text-white flex items-center justify-center text-xl font-medium shrink-0 hover:opacity-90 transition-opacity"
                >
                  {profile.username.charAt(0).toUpperCase()}
                </Link>
                <div className="flex-1 min-w-0">
                  <h1 className="font-serif text-xl font-medium text-ink-900">{profile.username}</h1>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} · Joined {formatDateLong(profile.createdAt)}
                  </p>
                  {profile.description && (
                    <p className="text-sm text-ink-600 mt-1.5 line-clamp-2 max-w-xl">{profile.description}</p>
                  )}
                </div>
                <Link
                  to={`/profile/${encodeURIComponent(profile.username)}`}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 transition-colors shrink-0"
                >
                  View profile
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Blogs */}
          {blogs.length === 0 ? (
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
        </>
      )}
    </div>
  );
}
