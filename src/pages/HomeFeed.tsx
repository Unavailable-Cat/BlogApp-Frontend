import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, BookOpen } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import type { BlogResponseDTO } from '../types';
import { BlogCardGrid } from '../components/BlogCard';
import { BlogListSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { useAuth } from '../lib/auth-context';

export function HomeFeed() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = () => {
    setLoading(true);
    setError(null);
    blogApi
      .getAll()
      .then((data) => {
        setBlogs(data);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load blogs.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="border-b border-ink-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-100 text-ink-600 text-xs font-medium mb-6 animate-fade-in">
            <Feather className="w-3.5 h-3.5" />
            Stories, ideas, and reflections
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-ink-900 leading-tight mb-4 animate-fade-in-up">
            Where words find their reader.
          </h1>
          <p className="text-base sm:text-lg text-ink-500 max-w-xl mx-auto leading-relaxed animate-fade-in-up">
            Browse the latest posts from our community of writers, or create your own.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in-up">
            {isAuthenticated ? (
              <Link
                to="/blog/new"
                className="h-11 px-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
              >
                <Feather className="w-4 h-4" />
                Write a new post
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="h-11 px-6 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
                >
                  Start writing
                </Link>
                <Link
                  to="/login"
                  className="h-11 px-6 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100 transition-colors"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ink-900">Latest posts</h2>
          <span className="text-sm text-ink-400">{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</span>
        </div>

        {loading ? (
          <BlogListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBlogs} />
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-7 h-7" />}
            title="No posts yet"
            message="Be the first to share a story on Inkwell."
            action={
              isAuthenticated ? (
                <Link
                  to="/blog/new"
                  className="h-11 px-6 inline-flex items-center rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
                >
                  Write a post
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="h-11 px-6 inline-flex items-center rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
                >
                  Join Inkwell
                </Link>
              )
            }
          />
        ) : (
          <div className="animate-fade-in">
            <BlogCardGrid blogs={blogs} />
          </div>
        )}
      </section>
    </div>
  );
}
