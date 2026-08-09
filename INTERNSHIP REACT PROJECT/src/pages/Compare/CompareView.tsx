import React, { useState, useEffect } from 'react';
import { Swords, Search, Trophy, Loader2, Star, Calendar, Clock, DollarSign, Award, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { MovieDetail, Movie } from '../../types';
import { searchMovies, fetchMovieDetail } from '../../services/omdbMovieService';

interface PresetMatchup {
  label: string;
  idA: string;
  idB: string;
}

const PRESET_MATCHUPS: PresetMatchup[] = [
  { label: 'The Dark Knight vs. The Batman', idA: 'tt0468569', idB: 'tt1877830' },
  { label: 'Oppenheimer vs. Barbie', idA: 'tt15398776', idB: 'tt1517268' },
  { label: 'Avatar vs. Avengers: Endgame', idA: 'tt0499549', idB: 'tt4154796' },
  { label: 'Inception vs. Interstellar', idA: 'tt1375666', idB: 'tt0816692' },
];

export const CompareView: React.FC = () => {
  // Movie A state
  const [queryA, setQueryA] = useState<string>('The Dark Knight');
  const [resultsA, setResultsA] = useState<Movie[]>([]);
  const [movieA, setMovieA] = useState<MovieDetail | null>(null);
  const [loadingA, setLoadingA] = useState<boolean>(false);

  // Movie B state
  const [queryB, setQueryB] = useState<string>('The Batman');
  const [resultsB, setResultsB] = useState<Movie[]>([]);
  const [movieB, setMovieB] = useState<MovieDetail | null>(null);
  const [loadingB, setLoadingB] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // Initial load preset: The Dark Knight vs The Batman
  useEffect(() => {
    loadPreset(PRESET_MATCHUPS[0].idA, PRESET_MATCHUPS[0].idB);
  }, []);

  const loadPreset = async (idA: string, idB: string) => {
    setError(null);
    setLoadingA(true);
    setLoadingB(true);

    try {
      const [detailA, detailB] = await Promise.all([
        fetchMovieDetail(idA),
        fetchMovieDetail(idB),
      ]);
      setMovieA(detailA);
      setMovieB(detailB);
      setQueryA(detailA.Title);
      setQueryB(detailB.Title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison movies.');
    } finally {
      setLoadingA(false);
      setLoadingB(false);
    }
  };

  const handleSearchA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryA.trim()) return;
    setLoadingA(true);
    try {
      const res = await searchMovies(queryA.trim());
      setResultsA(res.slice(0, 5));
      if (res.length > 0) {
        const detail = await fetchMovieDetail(res[0].imdbID);
        setMovieA(detail);
        setResultsA([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Movie A search failed');
    } finally {
      setLoadingA(false);
    }
  };

  const handleSearchB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryB.trim()) return;
    setLoadingB(true);
    try {
      const res = await searchMovies(queryB.trim());
      setResultsB(res.slice(0, 5));
      if (res.length > 0) {
        const detail = await fetchMovieDetail(res[0].imdbID);
        setMovieB(detail);
        setResultsB([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Movie B search failed');
    } finally {
      setLoadingB(false);
    }
  };

  const selectMovieA = async (imdbID: string) => {
    setLoadingA(true);
    setResultsA([]);
    try {
      const detail = await fetchMovieDetail(imdbID);
      setMovieA(detail);
      setQueryA(detail.Title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed loading movie details');
    } finally {
      setLoadingA(false);
    }
  };

  const selectMovieB = async (imdbID: string) => {
    setLoadingB(true);
    setResultsB([]);
    try {
      const detail = await fetchMovieDetail(imdbID);
      setMovieB(detail);
      setQueryB(detail.Title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed loading movie details');
    } finally {
      setLoadingB(false);
    }
  };

  // Helper numeric parsers
  const parseImdbRating = (m: MovieDetail | null) => parseFloat(m?.imdbRating || '0') || 0;
  const parseMetascore = (m: MovieDetail | null) => parseInt(m?.Metascore || '0', 10) || 0;
  const parseBoxOffice = (m: MovieDetail | null) => {
    if (!m?.BoxOffice || m.BoxOffice === 'N/A') return 0;
    return parseInt(m.BoxOffice.replace(/[\$,]/g, ''), 10) || 0;
  };
  const parseRuntime = (m: MovieDetail | null) => {
    if (!m?.Runtime || m.Runtime === 'N/A') return 0;
    return parseInt(m.Runtime.replace(/\D/g, ''), 10) || 0;
  };

  const scoreA = parseImdbRating(movieA);
  const scoreB = parseImdbRating(movieB);

  const metaA = parseMetascore(movieA);
  const metaB = parseMetascore(movieB);

  const boxA = parseBoxOffice(movieA);
  const boxB = parseBoxOffice(movieB);

  const runA = parseRuntime(movieA);
  const runB = parseRuntime(movieB);

  // Overall winner determination
  let pointsA = 0;
  let pointsB = 0;

  if (scoreA > scoreB) pointsA += 2;
  else if (scoreB > scoreA) pointsB += 2;

  if (metaA > metaB) pointsA += 1;
  else if (metaB > metaA) pointsB += 1;

  if (boxA > boxB) pointsA += 1;
  else if (boxB > boxA) pointsB += 1;

  const winner = pointsA > pointsB ? 'A' : pointsB > pointsA ? 'B' : 'TIE';

  return (
    <div id="compare-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Swords className="w-3.5 h-3.5" />
              <span>Head-to-Head Comparison Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Movie vs. Movie Face-Off
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Compare ratings, box office performance, runtimes, metascores, and awards side-by-side using real OMDb data.
            </p>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Popular Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_MATCHUPS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => loadPreset(p.idA, p.idB)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700/80 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dual Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
          {/* Fighter A Search */}
          <div className="relative space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Contender A</span>
            </label>
            <form onSubmit={handleSearchA} className="flex gap-2">
              <input
                type="text"
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                placeholder="Search Contender A..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                disabled={loadingA}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                {loadingA ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Find</span>
              </button>
            </form>

            {/* Results dropdown A */}
            {resultsA.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl space-y-1 p-2">
                {resultsA.map((res) => (
                  <button
                    key={res.imdbID}
                    type="button"
                    onClick={() => selectMovieA(res.imdbID)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between gap-2"
                  >
                    <span className="font-semibold truncate">{res.Title}</span>
                    <span className="text-slate-400 text-[11px] shrink-0">{res.Year}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fighter B Search */}
          <div className="relative space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Contender B</span>
            </label>
            <form onSubmit={handleSearchB} className="flex gap-2">
              <input
                type="text"
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                placeholder="Search Contender B..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                type="submit"
                disabled={loadingB}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                {loadingB ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Find</span>
              </button>
            </form>

            {/* Results dropdown B */}
            {resultsB.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl space-y-1 p-2">
                {resultsB.map((res) => (
                  <button
                    key={res.imdbID}
                    type="button"
                    onClick={() => selectMovieB(res.imdbID)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between gap-2"
                  >
                    <span className="font-semibold truncate">{res.Title}</span>
                    <span className="text-slate-400 text-[11px] shrink-0">{res.Year}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* VS Badge in center */}
        <div className="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-amber-500 text-slate-950 items-center justify-center font-black text-sm border-4 border-slate-950 shadow-2xl animate-pulse">
          VS
        </div>

        {/* Contender A Card */}
        <div className={`bg-slate-900 border rounded-2xl p-6 space-y-6 shadow-xl transition-all ${
          winner === 'A' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800'
        }`}>
          {loadingA ? (
            <div className="py-20 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">Loading Contender A...</span>
            </div>
          ) : movieA ? (
            <>
              <div className="flex items-start gap-4">
                <img
                  src={movieA.Poster}
                  alt={movieA.Title}
                  className="w-24 h-36 object-cover rounded-xl border border-slate-800 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 flex-1">
                  {winner === 'A' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                      <Trophy className="w-3 h-3" /> Face-Off Winner
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold text-white leading-tight">{movieA.Title}</h3>
                  <p className="text-xs text-slate-400">{movieA.Year} • {movieA.Genre}</p>
                  <p className="text-xs text-slate-500">Dir: {movieA.Director}</p>
                </div>
              </div>

              {/* Metrics Table A */}
              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> IMDb Rating</span>
                  <span className={`font-bold text-sm ${scoreA >= scoreB ? 'text-amber-400' : 'text-slate-300'}`}>
                    {movieA.imdbRating || 'N/A'} {scoreA > scoreB && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Metascore</span>
                  <span className={`font-bold ${metaA >= metaB ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {movieA.Metascore || 'N/A'} {metaA > metaB && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Box Office</span>
                  <span className={`font-bold ${boxA >= boxB ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {movieA.BoxOffice || 'N/A'} {boxA > boxB && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Runtime</span>
                  <span className="font-semibold text-slate-200">{movieA.Runtime || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-start py-1.5">
                  <span className="text-slate-400 flex items-center gap-1 shrink-0"><Award className="w-3.5 h-3.5 text-amber-400" /> Awards</span>
                  <span className="text-slate-300 text-right max-w-[180px]">{movieA.Awards || 'None'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">Search a movie for Contender A</div>
          )}
        </div>

        {/* Contender B Card */}
        <div className={`bg-slate-900 border rounded-2xl p-6 space-y-6 shadow-xl transition-all ${
          winner === 'B' ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-slate-800'
        }`}>
          {loadingB ? (
            <div className="py-20 flex flex-col items-center justify-center text-cyan-400 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">Loading Contender B...</span>
            </div>
          ) : movieB ? (
            <>
              <div className="flex items-start gap-4">
                <img
                  src={movieB.Poster}
                  alt={movieB.Title}
                  className="w-24 h-36 object-cover rounded-xl border border-slate-800 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 flex-1">
                  {winner === 'B' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase">
                      <Trophy className="w-3 h-3" /> Face-Off Winner
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold text-white leading-tight">{movieB.Title}</h3>
                  <p className="text-xs text-slate-400">{movieB.Year} • {movieB.Genre}</p>
                  <p className="text-xs text-slate-500">Dir: {movieB.Director}</p>
                </div>
              </div>

              {/* Metrics Table B */}
              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> IMDb Rating</span>
                  <span className={`font-bold text-sm ${scoreB >= scoreA ? 'text-amber-400' : 'text-slate-300'}`}>
                    {movieB.imdbRating || 'N/A'} {scoreB > scoreA && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Metascore</span>
                  <span className={`font-bold ${metaB >= metaA ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {movieB.Metascore || 'N/A'} {metaB > metaA && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Box Office</span>
                  <span className={`font-bold ${boxB >= boxA ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {movieB.BoxOffice || 'N/A'} {boxB > boxA && '👑'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Runtime</span>
                  <span className="font-semibold text-slate-200">{movieB.Runtime || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-start py-1.5">
                  <span className="text-slate-400 flex items-center gap-1 shrink-0"><Award className="w-3.5 h-3.5 text-amber-400" /> Awards</span>
                  <span className="text-slate-300 text-right max-w-[180px]">{movieB.Awards || 'None'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">Search a movie for Contender B</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareView;
