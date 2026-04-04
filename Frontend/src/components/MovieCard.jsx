import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="group cursor-pointer bg-zinc-800/90 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-zinc-700 hover:border-teal-400">
      {/* Poster */}
      <div className="h-56 bg-gradient-to-br from-teal-500 to-zinc-800 flex items-center justify-center relative overflow-hidden">
        {/* LIGHTER overlay (fixed) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        <div className="text-center relative z-10 px-4">
          <p className="text-4xl font-bold text-slate-100 capitalize transition-colors duration-300 group-hover:text-white">
            {movie.title?.charAt(0)}
          </p>
        </div>
      </div>

      {/* Divider (NEW) */}
      <div className="h-px bg-zinc-700/50" />

      {/* Content */}
      <div className="p-5 space-y-1">
        <h3 className="text-lg font-semibold text-slate-100 truncate group-hover:text-white transition-colors duration-300">
          {movie.title}
        </h3>

        <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300 transition-colors duration-300">
          {movie.director}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs px-2 py-1 bg-zinc-700 text-teal-300 rounded group-hover:bg-zinc-600 group-hover:text-teal-200 transition-colors duration-300">
            {movie.genre}
          </span>

          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            {movie.duration}min
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
