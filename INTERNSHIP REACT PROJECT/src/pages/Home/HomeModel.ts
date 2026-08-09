import { searchMovies } from '../../services/omdbMovieService';
import { Movie } from '../../types';
import { getFavourites, addFavourite, removeFavourite } from '../../services/firebaseService';

export interface HomeModelData {
  // Placeholder for Home data structure
}

const SEED_KEYWORDS = [
  'Batman',
  'Avengers',
  'Harry Potter',
  'Star Wars',
  'Spider-Man',
  'Marvel',
  'Disney',
  'Matrix',
  'Lord of the Rings',
  'Fast',
  'Mission Impossible',
  'Pixar',
  'Horror',
  'Comedy',
  'Action',
  'Avatar',
  'Jurassic',
  'Superman'
];

/**
 * Helper to select N random unique keywords from the seed list
 */
function getRandomKeywords(count: number = 4): string[] {
  const shuffled = [...SEED_KEYWORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Automatically fetches at least 20 unique movies using randomly selected keywords in parallel.
 *
 * @returns Promise resolving to an array of up to 20 unique Movie objects
 */
export async function initialMovies(): Promise<Movie[]> {
  // Select random search keywords from the seed list
  const keywords = getRandomKeywords(4);
  console.log('[HomeModel] Selected seed keywords for initial load:', keywords);

  // Use Promise.all to execute requests in parallel
  const searchPromises = keywords.map((keyword) =>
    searchMovies(keyword).catch((err) => {
      console.warn(`[HomeModel] Search failed for keyword "${keyword}":`, err);
      return [] as Movie[];
    })
  );

  const resultsArrays = await Promise.all(searchPromises);

  // Merge all results into a single array
  const allMovies = resultsArrays.flat();

  // Remove duplicate movies using imdbID
  const uniqueMoviesMap = new Map<string, Movie>();
  for (const movie of allMovies) {
    if (movie && movie.imdbID && !uniqueMoviesMap.has(movie.imdbID)) {
      uniqueMoviesMap.set(movie.imdbID, movie);
    }
  }

  const uniqueMovies = Array.from(uniqueMoviesMap.values());

  // Shuffle the final array
  const shuffledMovies = [...uniqueMovies].sort(() => 0.5 - Math.random());

  console.log(`[HomeModel] Generated ${shuffledMovies.length} unique initial movies.`);

  // Return exactly 20 unique movies
  return shuffledMovies.slice(0, 20);
}

/**
 * Validates and fetches movies for the Home screen using OMDb API service.
 *
 * @param query - The search query
 * @returns Promise resolving to an array of Movie objects
 */
export async function getMovies(query: string): Promise<Movie[]> {
  const cleanedQuery = query.trim();

  // Validate that the query contains at least two characters
  if (cleanedQuery.length < 2) {
    console.log('[HomeModel] Query too short (less than 2 characters), skipping search.');
    return [];
  }

  console.log('[HomeModel] Fetching movies for query:', cleanedQuery);
  return await searchMovies(cleanedQuery);
}

/**
 * Fetches all favourite movie IDs for a user from Firestore.
 */
export async function getFavouriteIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const favourites = await getFavourites(userId);
    return favourites.map((m) => m.imdbID);
  } catch (error) {
    console.error('[HomeModel] Failed to fetch favourite IDs:', error);
    return [];
  }
}

/**
 * Adds or removes a movie from favourites in Firestore for a user.
 */
export async function toggleFavourite(userId: string, movie: Movie, isCurrentlyFavourite: boolean): Promise<void> {
  if (!userId) return;
  if (isCurrentlyFavourite) {
    await removeFavourite(userId, movie.imdbID);
  } else {
    await addFavourite(userId, movie);
  }
}

export class HomeModel {
  static initialMovies = initialMovies;
  static getMovies = getMovies;
  static getFavouriteIds = getFavouriteIds;
  static toggleFavourite = toggleFavourite;
}



