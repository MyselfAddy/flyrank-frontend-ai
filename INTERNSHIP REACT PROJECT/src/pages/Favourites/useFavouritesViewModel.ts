import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../../types';
import { loadFavourites, deleteFavourite } from './FavouritesModel';
import { useAuth } from '../../context/AuthContext';

export function useFavouritesViewModel() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    if (!user) {
      setFavourites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loadFavourites(user.uid);
      setFavourites(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while loading favourites.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeMovie = useCallback(async (imdbID: string) => {
    if (!user) return;

    setError(null);
    try {
      await deleteFavourite(user.uid, imdbID);
      setFavourites((prev) => prev.filter((movie) => movie.imdbID !== imdbID));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while removing favourite.';
      setError(message);
    }
  }, [user]);

  const handleToggleFavourite = useCallback(async (movie: Movie) => {
    await removeMovie(movie.imdbID);
  }, [removeMovie]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return {
    favourites,
    loading,
    error,
    loadMovies,
    removeMovie,
    handleToggleFavourite,
  };
}
