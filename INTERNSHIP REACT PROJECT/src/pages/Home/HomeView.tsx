import React, { useState } from 'react';
import useHomeViewModel from './useHomeViewModel';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { MovieModal } from '../../components/MovieModal/MovieModal';
import { Search, Film, Loader2, AlertCircle, X, Sparkles, Filter } from 'lucide-react';
import { Movie } from '../../types';

const POPULAR_SEARCH_TAGS = [
  'Batman',
  'Avengers',
  'Star Wars',
  'Spider-Man',
  'Jurassic',
  'Matrix',
  'Harry Potter',
  'Horror',
];

export const HomeView: React.FC = () => {
  const { query, setQuery, movies, favouriteIds, loading, error, handleSubmit, handleToggleFavourite } = useHomeViewModel();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleQuickSearch = (tag: string) => {
    setQuery(tag);
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  const filteredMovies = movies.filter((m) => {
    if (selectedType === 'all') return true;
    return m.Type.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div id="home-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header & Form */}
      <div id="search-section" className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 md:p-8 text-slate-100 shadow-xl space-y-6">
        <div id="search-header" className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Unlimited Cinema</span>
          </div>
          <h1 id="search-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Discover Movies & Series
          </h1>
          <p id="search-description" className="text-slate-400 text-sm md:text-base">
            Search titles using the OMDb database to explore movie details, release years, and media types.
          </p>
        </div>

        <form id="search-form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div id="input-container" className="relative flex-1">
            <div id="search-icon-wrapper" className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="movie-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter movie title (e.g. Batman, Inception)..."
              className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm md:text-base shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            id="search-button"
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </button>
        </form>

        {/* Quick popular tags */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <span>Popular:</span>
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickSearch(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                query.toLowerCase() === tag.toLowerCase()
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-amber-400 border-slate-700/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div id="loading-state" className="flex items-center justify-center py-16 text-amber-500 space-x-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-base font-medium text-slate-300">Searching movies, please wait...</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div id="error-state" className="bg-red-950/40 border border-red-800/60 rounded-2xl p-5 flex items-start gap-3 text-red-200 shadow-md">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div id="error-details">
            <h3 id="error-title" className="font-semibold text-red-300 text-sm">Search Request Failed</h3>
            <p id="error-message" className="text-sm mt-1 text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Movies Grid & Filter Header */}
      {!loading && !error && movies.length > 0 && (
        <div id="movies-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <h2 id="movies-count-heading" className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              <span>Results ({filteredMovies.length})</span>
            </h2>

            {/* Type filter controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter:
              </span>
              {(['all', 'movie', 'series'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer border ${
                    selectedType === type
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type === 'movie' ? 'Movies' : 'Series'}
                </button>
              ))}
            </div>
          </div>

          <div id="movies-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavourite={favouriteIds.includes(movie.imdbID)}
                onToggleFavourite={handleToggleFavourite}
                onCardClick={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && !error && movies.length === 0 && (
        <div id="empty-state" className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
          <Film className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <h3 id="empty-state-title" className="text-lg font-semibold text-slate-300">No movies displayed</h3>
          <p id="empty-state-description" className="text-slate-500 text-sm max-w-md mx-auto mt-1">
            Type a movie title in the search bar above and click Search or press Enter to fetch movies.
          </p>
        </div>
      )}

      {/* Movie Details Popup Modal */}
      <MovieModal
        movie={selectedMovie}
        isFavourite={selectedMovie ? favouriteIds.includes(selectedMovie.imdbID) : false}
        onClose={() => setSelectedMovie(null)}
        onToggleFavourite={handleToggleFavourite}
      />
    </div>
  );
};

export default HomeView;

