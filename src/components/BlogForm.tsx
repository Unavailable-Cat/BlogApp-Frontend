import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Input, Textarea } from './Input';
import { Button } from './Button';

interface BlogFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string;
  submitLabel: string;
  loading: boolean;
  onSubmit: (data: { title: string; content: string; image: File | null }) => void;
  onCancel: () => void;
}

export function BlogForm({
  initialTitle = '',
  initialContent = '',
  initialImageUrl,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: BlogFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(initialImageUrl || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    onSubmit({ title: title.trim(), content: content.trim(), image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give your post a title..."
        required
        className="font-serif text-lg"
      />

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">Cover image</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-ink-200 group">
            <img src={imagePreview} alt="Cover preview" className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={() => {
                handleImageChange(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink-950/60 text-white flex items-center justify-center hover:bg-ink-950/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 rounded-xl border-2 border-dashed border-ink-300 flex flex-col items-center justify-center gap-2 text-ink-400 hover:border-ink-400 hover:bg-ink-50 transition-colors"
          >
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm font-medium">Click to upload a cover image</span>
            <span className="text-xs text-ink-400">PNG, JPG up to 10MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {/* Content */}
      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
        required
        rows={16}
        className="font-serif text-base leading-relaxed"
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
