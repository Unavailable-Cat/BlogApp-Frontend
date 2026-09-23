import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogApi, ApiError } from '../lib/api';
import { useToast } from '../components/Toast';
import { BlogForm } from '../components/BlogForm';

export function CreateBlog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data: { title: string; content: string; image: File | null }) => {
    if (!data.image) {
      toast('Please upload a cover image.', 'error');
      return;
    }
    setLoading(true);
    blogApi
      .create({ title: data.title, content: data.content, image: data.image })
      .then(() => {
        toast('Post published successfully!', 'success');
        navigate('/my-blogs');
      })
      .catch((err) => {
        toast(err instanceof ApiError ? err.message : 'Failed to create post.', 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/my-blogs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to my blogs
      </Link>

      <h1 className="font-serif text-2xl font-medium text-ink-900 mb-6">Write a new post</h1>

      <div className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm">
        <BlogForm
          submitLabel="Publish post"
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/my-blogs')}
        />
      </div>
    </div>
  );
}
