import React, { useState } from 'react';
import { Heart, Loader2, AlertCircle, Film, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { MovieModal } from '../../components/MovieModal/MovieModal';
import { useFavouritesViewModel } from './useFavouritesViewModel';
import { Movie } from '../../types';

export const FavouritesView: React.FC = () => {
  const { favourites, loading, error, loadMovies, handleToggleFavourite } = useFavouritesViewModel();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div id="favourites-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div id="favourites-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 id="favourites-title" className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>Favourite Movies</span>
          </h1>
          <p id="favourites-subtitle" className="text-sm text-slate-400 mt-1">
            Your saved collection of favourite movies and shows.
          </p>
        </div>

        {!loading && (
          <button
            id="reload-favourites-button"
            type="button"
            onClick={() => loadMovies()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div id="favourites-loading" className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Loading your favourite movies...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          id="favourites-error"
          className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-rose-300">Failed to load favourites</h4>
            <p className="text-sm text-rose-200 mt-0.5">{error}</p>
            <button
              id="retry-favourites-button"
              type="button"
              onClick={() => loadMovies()}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-900 rounded-lg transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && favourites.length === 0 && (
        <div id="favourites-empty" className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 id="favourites-empty-title" className="text-lg font-bold text-white mb-1">
            No favourite movies yet
          </h3>
          <p id="favourites-empty-description" className="text-sm text-slate-400 max-w-md mb-6">
            You haven't saved any movies to your favourites list. Explore movies on the home screen and click the heart icon to save them here!
          </p>
          <Link
            id="explore-movies-link"
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md"
          >
            <Film className="w-4 h-4" />
            <span>Explore Movies</span>
          </Link>
        </div>
      )}

      {/* Favourites Grid */}
      {!loading && !error && favourites.length === 0 ? null : (
        !loading && !error && (
          <div id="favourites-grid-container" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span id="favourites-count-badge" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Saved Items ({favourites.length})
              </span>
            </div>
            <div
              id="favourites-grid"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {favourites.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  isFavourite={true}
                  onToggleFavourite={handleToggleFavourite}
                  onCardClick={(m) => setSelectedMovie(m)}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        isFavourite={true}
        onClose={() => setSelectedMovie(null)}
        onToggleFavourite={(m) => {
          handleToggleFavourite(m);
          setSelectedMovie(null);
        }}
      />
    </div>
  );
};

export default FavouritesView;

