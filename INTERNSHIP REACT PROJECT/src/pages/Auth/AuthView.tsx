import React from 'react';
import { useAuthViewModel } from './useAuthViewModel';
import { Loader2, AlertCircle, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export const AuthView: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel();

  const isLogin = mode === 'login';

  return (
    <div id="auth-view" className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div id="auth-card" className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
        <div id="auth-header" className="text-center mb-6">
          <div id="auth-icon-badge" className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h1 id="auth-title" className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Login' : 'Create Account'}
          </h1>
          <p id="auth-subtitle" className="text-slate-500 text-sm mt-1">
            {isLogin
              ? 'Sign in to access your saved favorite movies'
              : 'Create a new account to save your favorite movies'}
          </p>
        </div>

        {error && (
          <div
            id="auth-error-alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span id="auth-error-message">{error}</span>
          </div>
        )}

        <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 text-sm"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
          </div>

          <button
            id="auth-submit-button"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-950 font-semibold rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
              </>
            ) : (
              <span>{isLogin ? 'Login' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div id="auth-toggle-container" className="mt-6 text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              id="auth-toggle-button"
              type="button"
              onClick={toggleMode}
              className="ml-1.5 font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;

