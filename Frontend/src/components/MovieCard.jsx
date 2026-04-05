import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="group capitalize relative cursor-pointer rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-teal-400">
      {/* Poster */}
      <div className="relative h-80 bg-gradient-to-br from-teal-500 to-zinc-800 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105">
        {/* Big letter */}
        <p className="relative z-10 text-5xl font-bold text-slate-100 capitalize transition-all duration-500 group-hover:scale-105 group-hover:opacity-5 group-hover:blur-sm">
          {movie.title?.charAt(0)}
        </p>

        {/* Softer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* Centered content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <h3 className="max-w-[85%] text-xl font-bold text-slate-100 truncate">
            {movie.title}
          </h3>

          <p className="mt-2 text-sm text-slate-200">{movie.duration} min</p>

          <span className="mt-3 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-300 border border-teal-400/20 shadow-sm">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
