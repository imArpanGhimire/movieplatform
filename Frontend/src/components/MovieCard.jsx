import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 transition-all duration-300">
      {/* Poster area */}
      <div className="relative h-72 overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Fallback when no poster
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-900/40 to-zinc-800">
            <p className="font-swash text-6xl font-bold text-teal-400/60 capitalize">
              {movie.title?.charAt(0)}
            </p>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <h3 className="font-swash text-center text-base font-bold leading-snug text-white line-clamp-2">
            {movie.title}
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            {movie.releaseYear || ""}
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div
        className="px-4 py-3"
        style={{ backgroundColor: "var(--color-bg-card)" }}
      >
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {movie.title}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {movie.releaseYear || "—"}
          </span>
          {movie.genre && (
            <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-500 border border-teal-500/20">
              {movie.genre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
