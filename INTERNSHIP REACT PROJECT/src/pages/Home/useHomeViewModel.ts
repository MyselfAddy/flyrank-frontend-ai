import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies, initialMovies, getFavouriteIds, toggleFavourite } from './HomeModel';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function useHomeViewModel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [results, favIds] = await Promise.all([
          initialMovies(),
          user ? getFavouriteIds(user.uid) : Promise.resolve([])
        ]);
        if (isMounted) {
          setMovies(results);
          setFavouriteIds(favIds);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading initial movies.';
          setError(errorMessage);
          setMovies([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const [results, favIds] = await Promise.all([
        getMovies(query),
        user ? getFavouriteIds(user.uid) : Promise.resolve([])
      ]);
      setMovies(results);
      setFavouriteIds(favIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while searching.';
      setError(errorMessage);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    handleSearch();
  };

  const handleToggleFavourite = async (movie: Movie) => {
    if (!user) {
      navigate('/favourites');
      return;
    }

    const isFav = favouriteIds.includes(movie.imdbID);

    // Optimistically toggle state in UI
    setFavouriteIds((prev) =>
      isFav ? prev.filter((id) => id !== movie.imdbID) : [...prev, movie.imdbID]
    );

    try {
      await toggleFavourite(user.uid, movie, isFav);
    } catch (err) {
      console.error('[useHomeViewModel] Failed to toggle favourite:', err);
      // Revert optimistic update on failure
      setFavouriteIds((prev) =>
        isFav ? [...prev, movie.imdbID] : prev.filter((id) => id !== movie.imdbID)
      );
    }
  };

  return {
    query,
    setQuery,
    movies,
    favouriteIds,
    loading,
    error,
    handleSearch,
    handleSubmit,
    handleToggleFavourite,
  };
}

export default useHomeViewModel;


