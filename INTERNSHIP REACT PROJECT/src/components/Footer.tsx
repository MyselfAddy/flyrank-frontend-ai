import React from 'react';
import { Film, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">CineMatch</span>
            <p className="text-xs text-slate-500">Discover and save your favorite movies and series.</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <Link to="/favourites" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Favorites</span>
          </Link>
        </div>

        {/* Powered tag */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Powered by OMDb Database API</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
