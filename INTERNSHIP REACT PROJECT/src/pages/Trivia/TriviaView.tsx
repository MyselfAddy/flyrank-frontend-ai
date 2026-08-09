import React, { useState, useEffect } from 'react';
import { HelpCircle, Trophy, RefreshCw, CheckCircle2, XCircle, Sparkles, Loader2, Film, Award, Star } from 'lucide-react';
import { MovieDetail } from '../../types';
import { fetchMovieDetail } from '../../services/omdbMovieService';

interface Question {
  id: number;
  type: 'plot' | 'director' | 'year' | 'rating' | 'actor';
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  movie: MovieDetail;
}

const TRIVIA_MOVIE_IDS = [
  'tt0372784', // Batman Begins
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt0133093', // The Matrix
  'tt0120338', // Titanic
  'tt0499549', // Avatar
  'tt4154796', // Avengers: Endgame
  'tt0111161', // The Shawshank Redemption
  'tt0096895', // Batman (1989)
];

export const TriviaView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setQuizFinished(false);

    try {
      // Pick 5 random IMDb IDs from pool
      const shuffledIds = [...TRIVIA_MOVIE_IDS].sort(() => Math.random() - 0.5).slice(0, 5);
      const movies = await Promise.all(shuffledIds.map((id) => fetchMovieDetail(id)));

      const generatedQuestions: Question[] = movies.map((movie, index) => {
        const otherTitles = movies.filter((m) => m.imdbID !== movie.imdbID).map((m) => m.Title);
        const shuffledOthers = [...otherTitles].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [...shuffledOthers, movie.Title].sort(() => Math.random() - 0.5);

        // Pick question category based on index
        const types: Array<'plot' | 'director' | 'year' | 'rating' | 'actor'> = [
          'plot',
          'director',
          'year',
          'rating',
          'actor',
        ];
        const qType = types[index % types.length];

        let prompt = '';
        let explanation = '';

        if (qType === 'plot' && movie.Plot && movie.Plot !== 'N/A') {
          // Blur title from plot if present
          const sanitizedPlot = movie.Plot.replace(new RegExp(movie.Title, 'gi'), '___');
          const plotSnippet = sanitizedPlot.length > 180 ? sanitizedPlot.slice(0, 180) + '...' : sanitizedPlot;
          prompt = `Which movie has this plot overview: "${plotSnippet}"?`;
          explanation = `${movie.Title} (${movie.Year}) directed by ${movie.Director}.`;
        } else if (qType === 'director' && movie.Director && movie.Director !== 'N/A') {
          prompt = `Who directed the acclaimed film "${movie.Title}" (${movie.Year})?`;
          const altDirectors = ['Christopher Nolan', 'Steven Spielberg', 'James Cameron', 'Quentin Tarantino', 'Matt Reeves', 'Denis Villeneuve'];
          const filteredAltDirs = altDirectors.filter((d) => d !== movie.Director).slice(0, 3);
          const dirOptions = [...filteredAltDirs, movie.Director].sort(() => Math.random() - 0.5);

          return {
            id: index + 1,
            type: qType,
            prompt,
            options: dirOptions,
            correctAnswer: movie.Director,
            explanation: `${movie.Director} directed ${movie.Title}.`,
            movie,
          };
        } else if (qType === 'year' && movie.Year) {
          prompt = `In which year was "${movie.Title}" officially released?`;
          const baseYear = parseInt(movie.Year, 10) || 2010;
          const yearOptions = Array.from(new Set([
            String(baseYear),
            String(baseYear - 3),
            String(baseYear + 4),
            String(baseYear - 7),
          ])).sort(() => Math.random() - 0.5);

          return {
            id: index + 1,
            type: qType,
            prompt,
            options: yearOptions,
            correctAnswer: movie.Year,
            explanation: `${movie.Title} was released in ${movie.Year}.`,
            movie,
          };
        } else {
          prompt = `Which movie stars key cast members: ${movie.Actors || 'N/A'}?`;
          explanation = `${movie.Title} stars ${movie.Actors}.`;
        }

        return {
          id: index + 1,
          type: qType,
          prompt,
          options,
          correctAnswer: movie.Title,
          explanation,
          movie,
        };
      });

      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate trivia quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);

    const currentQ = questions[currentIndex];
    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 100 + streak * 20);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div id="trivia-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dynamic OMDb Plot Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            CineMatch Movie Trivia
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Test your film knowledge with live questions generated directly from OMDb movie plots and credits.
          </p>
        </div>

        <button
          type="button"
          onClick={generateQuiz}
          disabled={loading}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>New Quiz Round</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-purple-400 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">Generating live plot trivia questions...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-950/40 border border-rose-800 p-4 rounded-xl text-rose-200 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Active Quiz Card */}
      {!loading && !error && !quizFinished && currentQ && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Top Progress Bar & Score Board */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {streak > 1 && (
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold animate-pulse">
                  🔥 {streak}x Streak!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 font-bold text-white">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Score: {score} pts</span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
              {currentQ.prompt}
            </h3>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                const hasAnswered = selectedOption !== null;

                let btnStyle = 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700/80';
                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                  } else {
                    btnStyle = 'bg-slate-800/40 opacity-50 border-slate-800 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Feedback & Explanation */}
          {selectedOption !== null && (
            <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Trivia Fact & Overview
                </p>
                <p className="text-xs text-slate-300">{currentQ.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Final Results 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Finished Quiz Summary Screen */}
      {!loading && quizFinished && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <p className="text-slate-400 text-sm">
              Your final score: <span className="text-amber-400 font-extrabold text-lg">{score} points</span>
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 max-w-md mx-auto">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">CineMatch Title</p>
            <p className="text-base font-bold text-amber-300">
              {score >= 400 ? '🏆 Master Cinephile' : score >= 200 ? '🎬 Movie Buff' : '🍿 Casual Viewer'}
            </p>
          </div>

          <button
            type="button"
            onClick={generateQuiz}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Play Another Round 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default TriviaView;
