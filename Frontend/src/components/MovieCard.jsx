const MovieCard = ({ movie }) => {
  const firstLetter = movie.title?.charAt(0) || "?";
  const posterSrc =
    movie.poster ||
    (movie.poster_path
      ? movie.poster_path.startsWith("http")
        ? movie.poster_path
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null);

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[var(--color-bg-card)] transition-all duration-300">
      {/* Poster */}
      <div className="relative h-72 overflow-hidden">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PosterFallback firstLetter={firstLetter} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Info — no separate bg, inherits card bg */}
      <div className="px-4 py-3">
        <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
          {movie.title}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">
            {movie.releaseYear || "—"}
          </span>
          {movie.genre && (
            <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-500">
              {movie.genre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PosterFallback = ({ firstLetter }) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-900/40 to-zinc-800">
      <p className="font-swash text-6xl font-bold text-teal-400/60 capitalize">
        {firstLetter}
      </p>
    </div>
  );
};

export default MovieCard;
