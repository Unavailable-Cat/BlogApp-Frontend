import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Feather, LogOut, Settings, BookOpen, ChevronDown, PenSquare } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    navigate(`/user/${encodeURIComponent(trimmed)}`);
    setSearchValue('');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-[100] bg-ink-50/85 backdrop-blur-md border-b border-ink-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 text-ink-900 hover:text-ink-700"
        >
          <Feather className="w-6 h-6" />
          <span className="font-serif text-xl font-medium hidden sm:inline">Inkwell</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by username..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-ink-200 bg-white/80 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-400 focus:bg-white focus:ring-2 focus:ring-ink-900/5 transition-all"
            />
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Write CTA — always visible. Guests are routed through ProtectedRoute,
              which explains why they're being asked to log in rather than just
              bouncing them there silently. */}
          <Link
            to="/blog/new"
            className="flex items-center gap-1.5 h-10 px-3 sm:px-4 rounded-full text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
          >
            <PenSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Write</span>
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-full hover:bg-ink-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-ink-800 max-w-[120px] truncate">
                  {user.username}
                </span>
                <ChevronDown className={`w-4 h-4 text-ink-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-ink-200 py-2 animate-scale-in origin-top-right">
                  <Link
                    to="/my-blogs"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <BookOpen className="w-4 h-4 text-ink-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <Settings className="w-4 h-4 text-ink-400" />
                    Settings
                  </Link>
                  <div className="my-1 border-t border-ink-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <LogOut className="w-4 h-4 text-ink-400" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="h-10 px-4 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="h-10 px-4 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
