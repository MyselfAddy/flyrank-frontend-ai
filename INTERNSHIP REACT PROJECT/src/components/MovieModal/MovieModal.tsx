import React, { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Film, Heart, Award, User, Tag, Loader2, Play, ExternalLink, Tv, Clapperboard } from 'lucide-react';
import { Movie, MovieDetail } from '../../types';
import { fetchMovieDetail } from '../../services/omdbMovieService';

export interface MovieModalProps {
  movie: Movie | null;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  isFavourite,
  onClose,
  onToggleFavourite,
}) => {
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  useEffect(() => {
    if (!movie) {
      setDetail(null);
      setShowTrailer(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setShowTrailer(false);

    fetchMovieDetail(movie.imdbID)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load details');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movie]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const displayMovie = detail || movie;
  const youtubeSearchQuery = encodeURIComponent(`${displayMovie.Title} ${displayMovie.Year || ''} official trailer`);

  return (
    <div
      id="movie-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="movie-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full text-slate-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-8"
      >
        {/* Close button */}
        <button
          id="close-movie-modal-button"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full backdrop-blur-md transition-all border border-slate-700/60 cursor-pointer shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content area */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Trailer View Toggle Section */}
          {showTrailer ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clapperboard className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Official Trailer: {displayMovie.Title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTrailer(false)}
                  className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
                >
                  ← Back to Details
                </button>
              </div>

              {/* YouTube search list embed frame */}
              <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                <iframe
                  title={`${displayMovie.Title} Trailer`}
                  src={`https://www.youtube-nocookie.com/embed?listType=search&list=${youtubeSearchQuery}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="text-xs text-slate-400 text-center">
                Automated search for official trailer. Click play on the video frame above or launch directly on external platforms below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Poster column */}
              <div className="relative aspect-[2/3] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg group">
                {displayMovie.Poster && displayMovie.Poster !== 'N/A' ? (
                  <img
                    src={displayMovie.Poster}
                    alt={displayMovie.Title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-500">
                    <Film className="w-12 h-12 mb-2 text-slate-600" />
                    <span className="text-xs text-center">No Poster Available</span>
                  </div>
                )}

                {/* Trailer Overlay Play Button */}
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 transition-all flex flex-col items-center justify-center gap-2 group-hover:opacity-100 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform pl-1">
                    <Play className="w-7 h-7 fill-slate-950" />
                  </div>
                  <span className="px-3 py-1 bg-slate-900/90 text-white text-xs font-bold rounded-lg border border-slate-700 backdrop-blur-md">
                    Watch Trailer
                  </span>
                </button>

                <button
                  id="modal-toggle-favourite-button"
                  type="button"
                  onClick={() => onToggleFavourite(movie)}
                  className={`absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg z-10 ${
                    isFavourite
                      ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500'
                      : 'bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current text-white' : ''}`} />
                  <span>{isFavourite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>

              {/* Details column */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                      {displayMovie.Type}
                    </span>
                    {detail?.Rated && detail.Rated !== 'N/A' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {detail.Rated}
                      </span>
                    )}
                    {detail?.Runtime && detail.Runtime !== 'N/A' && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {detail.Runtime}
                      </span>
                    )}
                  </div>

                  <h2 id="modal-movie-title" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {displayMovie.Title}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {displayMovie.Year}
                    </span>
                    {detail?.Released && detail.Released !== 'N/A' && (
                      <span>Released: {detail.Released}</span>
                    )}
                  </p>
                </div>

                {/* Ratings */}
                {detail?.imdbRating && detail.imdbRating !== 'N/A' && (
                  <div className="flex items-center gap-4 py-2 border-y border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="text-lg font-bold text-white">{detail.imdbRating}</span>
                      <span className="text-xs text-slate-500">/ 10</span>
                    </div>
                    {detail.imdbVotes && detail.imdbVotes !== 'N/A' && (
                      <span className="text-xs text-slate-400 border-l border-slate-800 pl-4">
                        {detail.imdbVotes} votes
                      </span>
                    )}
                    {detail.Metascore && detail.Metascore !== 'N/A' && (
                      <div className="border-l border-slate-800 pl-4 flex items-center gap-1">
                        <span className="text-xs text-slate-400">Metascore:</span>
                        <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                          {detail.Metascore}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Genre Pills */}
                {detail?.Genre && detail.Genre !== 'N/A' && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                    {detail.Genre.split(',').map((g) => (
                      <span
                        key={g.trim()}
                        className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700/60"
                      >
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Loading details indicator */}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading full plot & details...</span>
                  </div>
                )}

                {/* Error loading details */}
                {error && (
                  <div className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50">
                    {error}
                  </div>
                )}

                {/* Plot */}
                {detail?.Plot && detail.Plot !== 'N/A' && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overview</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{detail.Plot}</p>
                  </div>
                )}

                {/* Credits */}
                {detail && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    {detail.Director && detail.Director !== 'N/A' && (
                      <div>
                        <span className="text-slate-500 font-medium">Director: </span>
                        <span>{detail.Director}</span>
                      </div>
                    )}
                    {detail.Actors && detail.Actors !== 'N/A' && (
                      <div>
                        <span className="text-slate-500 font-medium flex items-center gap-1 inline-flex">
                          <User className="w-3 h-3 text-slate-500" /> Cast:
                        </span>{' '}
                        <span>{detail.Actors}</span>
                      </div>
                    )}
                    {detail.Awards && detail.Awards !== 'N/A' && (
                      <div className="flex items-start gap-1 text-amber-300/90 pt-1">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{detail.Awards}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Direct Stream & External Launchers */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Stream & External Launchers</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowTrailer(!showTrailer)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{showTrailer ? 'Close Trailer' : 'Play Official Trailer'}</span>
              </button>

              <a
                href={`https://www.youtube.com/results?search_query=${youtubeSearchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/80 flex items-center gap-1.5"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(displayMovie.Title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/80 flex items-center gap-1.5"
              >
                <span>JustWatch Stream</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://www.imdb.com/title/${displayMovie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded-lg border border-slate-700/80 flex items-center gap-1.5"
              >
                <span>IMDb Page</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
