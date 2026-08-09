import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Movie } from '../types';

// Initialize Firebase configuration using environment variables with fallback to config file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore
export const db: Firestore = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

/**
 * Adds a movie to the user's favourites collection using its imdbID as the document ID.
 * @param userId The ID of the parent user document
 * @param movie The movie to add to favourites
 */
export async function addFavourite(userId: string, movie: Movie): Promise<void> {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Failed to add favourite: userId is required');
  }

  if (!movie || !movie.imdbID) {
    throw new Error('Failed to add favourite: Movie object with a valid imdbID is required');
  }

  try {
    const favouriteRef = doc(db, 'users', userId, 'favourites', movie.imdbID);
    await setDoc(favouriteRef, {
      imdbID: movie.imdbID,
      Title: movie.Title || '',
      Year: movie.Year || '',
      Type: movie.Type || '',
      Poster: movie.Poster || '',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to add favourite movie "${movie.Title || movie.imdbID}": ${message}`);
  }
}

/**
 * Removes a movie from the user's favourites collection by its imdbID.
 * @param userId The ID of the parent user document
 * @param imdbID The unique IMDb identifier for the movie
 */
export async function removeFavourite(userId: string, imdbID: string): Promise<void> {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Failed to remove favourite: userId is required');
  }

  if (!imdbID) {
    throw new Error('Failed to remove favourite: imdbID is required');
  }

  try {
    const favouriteRef = doc(db, 'users', userId, 'favourites', imdbID);
    await deleteDoc(favouriteRef);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to remove favourite movie (${imdbID}): ${message}`);
  }
}

/**
 * Fetches all favourite movies for a given user from Firestore.
 * @param userId The ID of the parent user document
 * @returns Promise resolving to an array of Movie objects
 */
export async function getFavourites(userId: string): Promise<Movie[]> {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Failed to retrieve favourite movies: userId is required');
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'favourites'));
    const favourites: Movie[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      favourites.push({
        imdbID: data.imdbID || docSnap.id,
        Title: data.Title || '',
        Year: data.Year || '',
        Type: data.Type || '',
        Poster: data.Poster || '',
      });
    });

    return favourites;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve favourite movies: ${message}`);
  }
}

export default app;
