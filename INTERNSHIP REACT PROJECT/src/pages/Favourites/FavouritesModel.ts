import { Movie } from '../../types';
import { getFavourites, addFavourite, removeFavourite } from '../../services/firebaseService';

/**
 * Wrapper model for managing favourite movies via firebaseService.
 */

export async function loadFavourites(userId: string): Promise<Movie[]> {
  return await getFavourites(userId);
}

export async function saveFavourite(userId: string, movie: Movie): Promise<void> {
  return await addFavourite(userId, movie);
}

export async function deleteFavourite(userId: string, imdbID: string): Promise<void> {
  return await removeFavourite(userId, imdbID);
}
