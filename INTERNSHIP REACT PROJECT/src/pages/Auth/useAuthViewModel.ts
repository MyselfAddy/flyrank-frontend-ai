import { useState, useEffect, FormEvent } from 'react';
import { User } from 'firebase/auth';
import { AuthModel } from './AuthModel';

export interface UseAuthViewModelResult {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  user: User | null;
  handleSubmit: (e?: FormEvent) => Promise<void>;
  toggleMode: () => void;
}

export function useAuthViewModel(): UseAuthViewModelResult {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = AuthModel.subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMode = () => {
    setError(null);
    setPassword('');
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setError(null);
    setLoading(true);

    try {
      let authenticatedUser: User;
      if (mode === 'login') {
        authenticatedUser = await AuthModel.login(email, password);
      } else {
        authenticatedUser = await AuthModel.register(email, password);
      }
      setUser(authenticatedUser);
      setPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    setMode,
    loading,
    error,
    setError,
    user,
    handleSubmit,
    toggleMode,
  };
}

