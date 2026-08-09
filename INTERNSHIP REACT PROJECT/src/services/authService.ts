import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver
} from 'firebase/auth';
import { auth } from './firebaseService';

/**
 * Converts Firebase auth error codes into user-friendly error messages.
 */
function formatAuthError(error: unknown): Error {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/email-already-in-use':
        return new Error('This email address is already in use by another account.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      case 'auth/operation-not-allowed':
        return new Error('Email and password accounts are not enabled.');
      case 'auth/weak-password':
        return new Error('The password is too weak. Please use at least 6 characters.');
      case 'auth/user-disabled':
        return new Error('This account has been disabled. Please contact support.');
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('Invalid email or password.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your internet connection.');
      default:
        if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
          return new Error((error as { message: string }).message);
        }
    }
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected authentication error occurred.');
}

/**
 * Registers a new user with email and password using Firebase Authentication.
 * @param email User email address
 * @param password User password
 * @returns Promise resolving to the created Firebase User
 */
export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw formatAuthError(error);
  }
}

/**
 * Logs in an existing user with email and password using Firebase Authentication.
 * @param email User email address
 * @param password User password
 * @returns Promise resolving to the authenticated Firebase User
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw formatAuthError(error);
  }
}

/**
 * Logs out the currently authenticated user from Firebase Authentication.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw formatAuthError(error);
  }
}

/**
 * Subscribes to Firebase Authentication state changes.
 * @param callback Callback function triggered when the auth state changes
 * @returns Unsubscribe function to stop listening to auth changes
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  const observer: NextOrObserver<User> = (user) => callback(user);
  return onAuthStateChanged(auth, observer);
}
