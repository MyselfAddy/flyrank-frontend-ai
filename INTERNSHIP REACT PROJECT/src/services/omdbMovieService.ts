import { Movie, MovieDetail, OmdbSearchResponse } from '../types';

export type { Movie, MovieDetail, OmdbSearchResponse };

/**
 * Searches for movies using the OMDb API.
 * 
 * @param query - The search query string
 * @returns Promise resolving to an array of Movie objects
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    console.log('[OMDb Service] Query is empty, returning empty array.');
    return [];
  }

  console.log('[OMDb Service] Initiating search for:', query);

  const encodedQuery = encodeURIComponent(trimmedQuery);
  const url = `/api/movies?s=${encodedQuery}`;

  console.log('[OMDb Service] Fetching URL:', url);

  let response: Response;
  try {
    response = await fetch(url);
    console.log('[OMDb Service] HTTP Status:', response.status, response.statusText);
  } catch (err) {
    console.error('[OMDb Service] Fetch error:', err);
    throw new Error(`Failed to communicate with movie service: ${err instanceof Error ? err.message : 'Network error'}`);
  }

  let data: OmdbSearchResponse;
  try {
    data = await response.json();
    console.log('[OMDb Service] API Response Data:', data);
  } catch {
    if (!response.ok) {
      console.error('[OMDb Service] HTTP Request failed with status:', response.status);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    throw new Error('Failed to parse response from movie service.');
  }

  if (data.Response === 'False') {
    console.warn('[OMDb Service] API returned Response: "False". Error:', data.Error);
    throw new Error(data.Error || 'OMDb API returned an error response.');
  }

  if (!response.ok) {
    console.error('[OMDb Service] HTTP Request failed with status:', response.status);
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  console.log(`[OMDb Service] Successfully retrieved ${data.Search?.length || 0} movies.`);
  return data.Search || [];
}

/**
 * Fetches detailed information for a single movie by its IMDb ID.
 * 
 * @param imdbID - The IMDb ID of the movie
 * @returns Promise resolving to MovieDetail object
 */
export async function fetchMovieDetail(imdbID: string): Promise<MovieDetail> {
  if (!imdbID) {
    throw new Error('IMDb ID is required');
  }

  const url = `/api/movie-detail?i=${encodeURIComponent(imdbID)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Failed to fetch movie details.');
  }

  return data as MovieDetail;
}
