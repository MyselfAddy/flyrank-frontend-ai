import React from 'react';
import { Film, Heart } from 'lucide-react';
import { Movie } from '../../types';

export interface MovieCardProps {
  movie: Movie;
  isFavourite?: boolean;
  onToggleFavourite?: (movie: Movie) => void;
  onCardClick?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavourite = false,
  onToggleFavourite,
  onCardClick,
}) => {
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavourite) {
      onToggleFavourite(movie);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(movie);
    }
  };

  return (
    <div
      id={`movie-card-${movie.imdbID}`}
      onClick={handleCardClick}
      className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all duration-300 group relative ${
        onCardClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Poster Image Container */}
      <div id={`poster-wrapper-${movie.imdbID}`} className="relative aspect-[2/3] bg-slate-950 overflow-hidden">
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <img
            id={`movie-poster-${movie.imdbID}`}
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            id={`no-poster-${movie.imdbID}`}
            className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-500 bg-slate-950"
          >
            <Film className="w-12 h-12 mb-2 text-slate-600" />
            <span className="text-xs text-center">No Poster Available</span>
          </div>
        )}

        {/* Hover overlay hint */}
        {onCardClick && (
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 bg-slate-900/90 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/30 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              View Details
            </span>
          </div>
        )}

        {/* Type Badge */}
        <span
          id={`movie-type-badge-${movie.imdbID}`}
          className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-900/90 text-amber-400 border border-amber-500/30 rounded-md backdrop-blur-sm shadow-sm"
        >
          {movie.Type}
        </span>

        {/* Favourite Button */}
        <button
          id={`favourite-button-${movie.imdbID}`}
          type="button"
          onClick={handleFavouriteClick}
          aria-label={`Mark ${movie.Title} as favourite`}
          className={`absolute top-3 left-3 p-2 rounded-full border transition-all cursor-pointer backdrop-blur-md z-10 ${
            isFavourite
              ? 'bg-rose-500/90 text-white border-rose-400 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 border-slate-700/80 hover:border-rose-500/50 hover:bg-slate-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Movie Details */}
      <div id={`movie-info-${movie.imdbID}`} className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3
            id={`movie-title-${movie.imdbID}`}
            className="font-bold text-white text-base line-clamp-2 group-hover:text-amber-400 transition-colors"
          >
            {movie.Title}
          </h3>
        </div>

        <div id={`movie-meta-${movie.imdbID}`} className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span id={`movie-year-${movie.imdbID}`}>Year: <strong className="text-slate-200">{movie.Year}</strong></span>
          <span id={`movie-imdb-${movie.imdbID}`} className="text-slate-500 font-mono">#{movie.imdbID}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
