import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authApi, ApiError } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { useToast } from '../components/Toast';
import { Input, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/Modal';
import { Spinner } from '../components/Skeleton';
import { formatDateLong } from '../lib/format';

export function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDescription(user.description || '');
      setLoading(false);
    }
  }, [user]);

  const handleSaveUsername = () => {
    if (!username.trim()) {
      toast('Username cannot be empty.', 'error');
      return;
    }
    if (username.trim() === user?.username) {
      toast('No change to username.', 'info');
      return;
    }
    setSavingUsername(true);
    authApi
      .updateUsername(username.trim())
      .then(() => {
        toast('Username updated.', 'success');
        refreshUser();
      })
      .catch((err) => {
        toast(err instanceof ApiError ? err.message : 'Failed to update username.', 'error');
      })
      .finally(() => setSavingUsername(false));
  };

  const handleSaveDescription = () => {
    setSavingDescription(true);
    authApi
      .updateDescription(description.trim())
      .then(() => {
        toast('Description updated.', 'success');
        refreshUser();
      })
      .catch((err) => {
        toast(err instanceof ApiError ? err.message : 'Failed to update description.', 'error');
      })
      .finally(() => setSavingDescription(false));
  };

  const handleDeleteAccount = () => {
    setDeleting(true);
    authApi
      .deleteUser()
      .then(() => {
        toast('Account deleted.', 'success');
        logout();
        navigate('/', { replace: true });
      })
      .catch((err) => {
        toast(err instanceof ApiError ? err.message : 'Failed to delete account.', 'error');
      })
      .finally(() => {
        setDeleting(false);
        setDeleteOpen(false);
      });
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <h1 className="font-serif text-2xl font-medium text-ink-900 mb-8">Account settings</h1>

      {/* Account info */}
      <section className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-ink-400" />
            <span className="text-ink-500">Email</span>
            <span className="text-ink-800 font-medium ml-auto">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-ink-400" />
            <span className="text-ink-500">Member since</span>
            <span className="text-ink-800 font-medium ml-auto">{formatDateLong(user.createdAt)}</span>
          </div>
        </div>
      </section>

      {/* Username */}
      <section className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-4">Username</h2>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>
          <Button onClick={handleSaveUsername} loading={savingUsername}>
            Save
          </Button>
        </div>
        <p className="text-xs text-ink-400 mt-2">
          This is the name others use to search for your blog.
        </p>
      </section>

      {/* Description */}
      <section className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-4">Description</h2>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell readers a little about yourself..."
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <Button onClick={handleSaveDescription} loading={savingDescription}>
            Save description
          </Button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-xl border border-red-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Danger zone</h2>
        <p className="text-sm text-ink-500 mb-4">
          Permanently delete your account and all of your blog posts. This action cannot be undone.
        </p>
        <button
          onClick={() => setDeleteOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete account
        </button>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        message="This will permanently delete your account and all of your blog posts. This action cannot be undone."
        confirmText="Delete my account"
        loading={deleting}
        danger
      />
    </div>
  );
}
