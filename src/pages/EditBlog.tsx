import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import type { DetailedBlogResponseDTO } from '../types';
import { useToast } from '../components/Toast';
import { BlogForm } from '../components/BlogForm';
import { BlogDetailSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/EmptyState';

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [blog, setBlog] = useState<DetailedBlogResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    blogApi
      .getById(id)
      .then((data) => {
        if (!data.canDelete) {
          setError('You do not have permission to edit this post.');
          return;
        }
        setBlog(data);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setError('This post could not be found.');
        } else {
          setError(err instanceof ApiError ? err.message : 'Failed to load post.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (data: { title: string; content: string; image: File | null }) => {
    if (!blog || !id) return;
    setSaving(true);

    // Use PUT to replace everything at once if a new image is provided,
    // otherwise use individual PATCH calls for title and content.
    const hasNewImage = !!data.image;
    const titleChanged = data.title !== blog.title;
    const contentChanged = data.content !== blog.content;

    if (hasNewImage && data.image) {
      // Full update via PUT
      blogApi
        .update(id, { title: data.title, content: data.content, image: data.image })
        .then(() => {
          toast('Post updated successfully!', 'success');
          navigate(`/blog/${id}`);
        })
        .catch((err) => {
          toast(err instanceof ApiError ? err.message : 'Failed to update post.', 'error');
        })
        .finally(() => setSaving(false));
    } else {
      // Patch individual fields
      const ops: Promise<void>[] = [];
      if (titleChanged) ops.push(blogApi.updateTitle(id, data.title));
      if (contentChanged) ops.push(blogApi.updateContent(id, data.content));

      if (ops.length === 0) {
        toast('No changes to save.', 'info');
        setSaving(false);
        navigate(`/blog/${id}`);
        return;
      }

      Promise.all(ops)
        .then(() => {
          toast('Post updated successfully!', 'success');
          navigate(`/blog/${id}`);
        })
        .catch((err) => {
          toast(err instanceof ApiError ? err.message : 'Failed to update post.', 'error');
        })
        .finally(() => setSaving(false));
    }
  };

  if (loading) return <BlogDetailSkeleton />;

  if (error || !blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <ErrorState message={error || 'Post not found.'} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/blog/${id}`} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to post
      </Link>

      <h1 className="font-serif text-2xl font-medium text-ink-900 mb-6">Edit post</h1>

      <div className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm">
        <BlogForm
          initialTitle={blog.title}
          initialContent={blog.content}
          initialImageUrl={blog.imageUrl}
          submitLabel="Save changes"
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/blog/${id}`)}
        />
      </div>
    </div>
  );
}
