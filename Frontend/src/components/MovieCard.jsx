import React from "react";

const MovieCard = () => {
  return (
    <div className="group cursor-pointer bg-zinc-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-zinc-700 hover:border-teal-500">
      {/* Poster Placeholder */}
      <div className="h-56 bg-gradient-to-br from-teal-500 to-zinc-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="text-center relative z-10 px-4">
          <p className="text-4xl font-bold text-teal-500">I</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-100 truncate group-hover:text-teal-500 transition-colors">
          Inception
        </h3>
        <p className="text-sm text-slate-400 mt-1">Christopher Nolan</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs px-2 py-1 bg-zinc-700 text-teal-400 rounded">
            Sci-Fi
          </span>
          <span className="text-xs text-slate-400">148 min</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
