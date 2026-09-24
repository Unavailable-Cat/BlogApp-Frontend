import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Feather } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import type { DetailedBlogResponseDTO } from '../types';
import { formatDateLong } from '../lib/format';
import { BlogDetailSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/Modal';
import { useToast } from '../components/Toast';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blog, setBlog] = useState<DetailedBlogResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBlog = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    blogApi
      .getById(id)
      .then((data) => setBlog(data))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setError('This blog post could not be found.');
        } else {
          setError(err instanceof ApiError ? err.message : 'Failed to load this post.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleDelete = () => {
    if (!blog) return;
    setDeleting(true);
    blogApi
      .delete(blog.id)
      .then(() => {
        toast('Post deleted successfully.', 'success');
        navigate('/');
      })
      .catch((err) => {
        toast(err instanceof ApiError ? err.message : 'Failed to delete post.', 'error');
      })
      .finally(() => {
        setDeleting(false);
        setDeleteOpen(false);
      });
  };

  if (loading) return <BlogDetailSkeleton />;

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <ErrorState
          message={error || 'Post not found.'}
          onRetry={fetchBlog}
        />
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ink-900 leading-tight mb-4">
          {blog.title}
        </h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-medium">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-ink-800">{blog.author}</p>
              <p className="text-xs text-ink-400">{formatDateLong(blog.createdAt)}</p>
            </div>
          </div>

          {blog.canDelete && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/blog/${blog.id}/edit`)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium text-ink-700 border border-ink-200 hover:bg-ink-100 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Cover image */}
      <div className="rounded-xl overflow-hidden mb-8 bg-ink-100">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-auto object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Content */}
      <div className="article-content text-lg whitespace-pre-wrap">
        {blog.content}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this post?"
        message="This action cannot be undone. The post and its image will be permanently removed."
        confirmText="Delete"
        loading={deleting}
        danger
      />
    </article>
  );
}
