import { Link } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import type { BlogResponseDTO } from '../types';
import { formatDate } from '../lib/format';

interface BlogCardProps {
  blog: BlogResponseDTO;
  showActions?: boolean;
}

export function BlogCard({ blog, showActions }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group block rounded-xl border border-ink-200 bg-white overflow-hidden hover:shadow-md hover:border-ink-300 transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden bg-ink-100 relative">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-medium text-ink-900 leading-snug line-clamp-2 group-hover:text-ink-700 transition-colors">
          {blog.title}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-xs text-ink-500">
          <span className="font-medium text-ink-600">{blog.author}</span>
          <span className="text-ink-300">·</span>
          <span>{formatDate(blog.createdAt)}</span>
          {showActions && (
            <>
              <span className="text-ink-300">·</span>
              <span className="inline-flex items-center gap-1 text-ink-400">
                <PenSquare className="w-3 h-3" />
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function BlogCardGrid({ blogs, showActions }: { blogs: BlogResponseDTO[]; showActions?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} showActions={showActions} />
      ))}
    </div>
  );
}
