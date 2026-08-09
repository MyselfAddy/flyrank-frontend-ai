import { registerUser, loginUser, logoutUser, subscribeToAuthChanges } from '../../services/authService';
import { User } from 'firebase/auth';

export interface AuthModelData {
  user: User | null;
}

/**
 * Trims and normalizes an email address string.
 */
function normalizeEmail(email: string): string {
  return email ? email.trim().toLowerCase() : '';
}

/**
 * Validates email and password inputs before calling authentication services.
 */
function validateCredentials(email: string, password: string): { normalizedEmail: string } {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error('Email address is required.');
  }

  if (!password) {
    throw new Error('Password is required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  return { normalizedEmail };
}

/**
 * Registers a new user after validating credentials.
 * @param email User email
 * @param password User password
 * @returns Authenticated Firebase User
 */
export async function register(email: string, password: string): Promise<User> {
  const { normalizedEmail } = validateCredentials(email, password);
  return await registerUser(normalizedEmail, password);
}

/**
 * Logs in an existing user after validating credentials.
 * @param email User email
 * @param password User password
 * @returns Authenticated Firebase User
 */
export async function login(email: string, password: string): Promise<User> {
  const { normalizedEmail } = validateCredentials(email, password);
  return await loginUser(normalizedEmail, password);
}

/**
 * Logs out the currently authenticated user.
 */
export async function logout(): Promise<void> {
  return await logoutUser();
}

export class AuthModel {
  static register = register;
  static login = login;
  static logout = logout;
  static subscribeToAuthChanges = subscribeToAuthChanges;
}

