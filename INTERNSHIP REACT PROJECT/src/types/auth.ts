import { User } from 'firebase/auth';
import { FormEvent } from 'react';

export interface AuthModelData {
  user: User | null;
}

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

