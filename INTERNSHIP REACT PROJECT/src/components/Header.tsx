import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Home, Heart, Film, LogIn, LogOut, User as UserIcon, Swords, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [headerQuery, setHeaderQuery] = useState('');

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(headerQuery.trim())}`);
      setHeaderQuery('');
    }
  };

  return (
    <header id="app-header" className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Navigation & Brand Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight hidden sm:inline-block">
              CineMatch
            </span>
          </NavLink>

          <nav id="header-nav" className="flex items-center gap-1 sm:gap-1.5">
            <NavLink
              id="nav-link-home"
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Home className="w-4 h-4" />
              <span className="hidden xs:inline">Home</span>
            </NavLink>

            <NavLink
              id="nav-link-compare"
              to="/compare"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Face-Off</span>
            </NavLink>

            <NavLink
              id="nav-link-trivia"
              to="/trivia"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Trivia</span>
            </NavLink>

            <NavLink
              id="nav-link-favorites"
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="hidden xs:inline">Favorites</span>
            </NavLink>
          </nav>
        </div>

        {/* User Actions / Search Bar */}
        <div className="flex items-center gap-3">
          <form id="header-search-form" onSubmit={handleHeaderSearch} className="hidden lg:flex items-center gap-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </form>

          {user ? (
            <div id="header-user-menu" className="flex items-center gap-2">
              <div className="hidden xs:flex sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-medium text-slate-200 border border-slate-700/60">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>
              <button
                id="header-logout-button"
                onClick={logout}
                title="Sign Out"
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <NavLink
              id="header-login-link"
              to="/auth"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700'
                }`
              }
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
