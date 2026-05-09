import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPersonalizedHome } from "../services/personalizedApi";

const IMG = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── drag scroll hook ───────────────────────────────────── */
function useDragScroll() {
  const ref = useRef(null);
  const d = useRef({ on: false, x: 0, sl: 0, moved: false });

  const onMouseDown = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    d.current = {
      on: true,
      x: e.pageX - el.offsetLeft,
      sl: el.scrollLeft,
      moved: false,
    };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!d.current.on || !ref.current) return;
    const walk = (e.pageX - ref.current.offsetLeft - d.current.x) * 1.4;
    if (Math.abs(walk) > 4) d.current.moved = true;
    ref.current.scrollLeft = d.current.sl - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!ref.current) return;
    d.current.on = false;
    ref.current.style.cursor = "grab";
  }, []);

  const onClick = useCallback((e) => {
    if (d.current.moved) {
      e.preventDefault();
      d.current.moved = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { ref, onMouseDown, onClick };
}

/* ─── skeleton ───────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* hero */}
      <div className="relative h-[420px] overflow-hidden bg-[var(--color-bg-page)]">
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-10">
          <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--color-bg-card)]" />
          <div className="h-11 w-80 animate-pulse rounded bg-[var(--color-bg-card)]" />
          <div className="h-3 w-72 animate-pulse rounded bg-[var(--color-bg-card)]" />
          <div className="h-3 w-52 animate-pulse rounded bg-[var(--color-bg-card)]" />
          <div className="mt-1.5 flex gap-2.5">
            <div className="h-9 w-28 animate-pulse rounded-lg bg-[var(--color-bg-card)]" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--color-bg-card)]" />
          </div>
        </div>
      </div>
      {/* rows */}
      {[0, 1].map((s) => (
        <div key={s} className="px-10 pt-8">
          <div className="mb-5 flex gap-2.5">
            <div className="h-2.5 w-24 animate-pulse rounded bg-[var(--color-bg-card)]" />
            <div className="h-2.5 w-40 animate-pulse rounded bg-[var(--color-bg-card)]" />
          </div>
          <div className="flex gap-2.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] w-[100px] flex-none animate-pulse rounded-xl bg-[var(--color-bg-card)]"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── hero ───────────────────────────────────────────────── */
function Hero({ movie }) {
  if (!movie) return null;
  const backdrop =
    IMG(movie.backdrop_path, "original") || IMG(movie.poster_path, "w780");

  return (
    <div className="relative h-[420px] overflow-hidden bg-[var(--color-bg-page)]">
      {/* backdrop image */}
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
        />
      )}

      {/* gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-[var(--color-bg-base)]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/50 to-transparent" />

      {/* content */}
      <div className="animate-[fv-up_.5s_ease_both] absolute bottom-0 left-0 right-0 max-w-[600px] p-10">
        {/* eyebrow */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
            Featured Pick
          </span>
        </div>

        {/* title */}
        <h2 className="mb-2.5 font-[var(--font-swash)] text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight text-[var(--color-text-primary)]">
          {movie.title}
        </h2>

        {/* overview */}
        {movie.overview && (
          <p className="mb-4 line-clamp-2 max-w-[420px] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
            {movie.overview}
          </p>
        )}

        {/* actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to={`/movie/tmdb/${movie.id}`}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-[18px] py-[9px] text-[12px] font-bold tracking-[0.04em] text-[#09090b] no-underline transition-colors duration-200 hover:bg-[var(--color-brand-hover)]"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M2 1l7 4-7 4V1z" />
            </svg>
            Watch Now
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white/[0.07] px-4 py-[9px] text-[12px] font-semibold text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-white/[0.11]">
            + Add to List
          </button>

          {/* rating */}
          {movie.vote_average > 0 && (
            <div className="ml-auto text-right">
              <div className="text-[28px] font-extrabold leading-none text-[var(--color-text-primary)]">
                {movie.vote_average.toFixed(1)}
              </div>
              <div className="mt-0.5 text-[10px] tracking-[2px] text-[var(--color-brand)]">
                ★★★★★
              </div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                IMDb Score
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── poster card ────────────────────────────────────────── */
function PosterCard({ movie, index }) {
  return (
    <Link
      to={`/movie/tmdb/${movie.id}`}
      draggable={false}
      className="group flex select-none flex-col no-underline"
      style={{ animation: `fv-up .45s ${index * 35}ms ease both` }}
    >
      {/* poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[var(--color-bg-card)]">
        {IMG(movie.poster_path) ? (
          <img
            src={IMG(movie.poster_path)}
            alt={movie.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="h-full w-full bg-[var(--color-bg-elevated)]" />
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,9,11,0.8)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* rating badge */}
        {movie.vote_average > 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-[rgba(9,9,11,0.8)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-brand)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>

      {/* meta */}
      <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--color-text-secondary)] transition-colors duration-200 group-hover:text-[var(--color-text-primary)]">
        {movie.title}
      </p>
      {movie.release_date && (
        <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
          {movie.release_date.split("-")[0]}
        </p>
      )}
    </Link>
  );
}

/* ─── drag row ───────────────────────────────────────────── */
function DragRow({ movies, skip = 0 }) {
  const { ref, onMouseDown, onClick } = useDragScroll();
  if (!movies?.length) return null;

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className="flex gap-2.5 overflow-x-auto pb-2 [cursor:grab] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {movies.slice(skip, skip + 16).map((m, i) => (
        <div key={m.id} className="w-[100px] flex-none">
          <PosterCard movie={m} index={i} />
        </div>
      ))}
    </div>
  );
}

/* ─── trending mosaic ────────────────────────────────────── */
function TrendingMosaic({ movies }) {
  if (!movies?.length) return null;
  const [top2, rest] = [movies.slice(0, 2), movies.slice(2, 10)];

  return (
    <div className="flex flex-col gap-3">
      {/* Top 2 — wide featured cards */}
      <div className="grid grid-cols-2 gap-3">
        {top2.map((movie, i) => (
          <Link
            key={movie.id}
            to={`/movie/tmdb/${movie.id}`}
            className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--color-bg-card)] no-underline"
            style={{ animation: `fv-up .45s ${i * 40}ms ease both` }}
          >
            {IMG(movie.backdrop_path, "w780") && (
              <img
                src={IMG(movie.backdrop_path, "w780")}
                alt={movie.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* rank */}
            <span className="absolute left-3 top-3 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black tracking-widest text-white/40 backdrop-blur-sm">
              #{i + 1}
            </span>

            {/* rating */}
            {movie.vote_average > 0 && (
              <span className="absolute right-3 top-3 rounded-lg border border-[var(--color-brand-border)] bg-[var(--color-brand-subtle)] px-2 py-1 text-[10px] font-bold text-[var(--color-brand)] backdrop-blur-sm">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            )}

            {/* info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-base font-black leading-tight text-white drop-shadow-lg">
                {movie.title}
              </p>
              {movie.release_date && (
                <p className="mt-1 text-[11px] text-white/40">
                  {movie.release_date.split("-")[0]}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Rest — compact horizontal scroll row */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rest.map((movie, i) => (
          <Link
            key={movie.id}
            to={`/movie/tmdb/${movie.id}`}
            className="group relative block flex-none overflow-hidden rounded-xl bg-[var(--color-bg-card)] no-underline"
            style={{
              width: 110,
              aspectRatio: "2/3",
              animation: `fv-up .45s ${(i + 2) * 40}ms ease both`,
            }}
          >
            {IMG(movie.poster_path) && (
              <img
                src={IMG(movie.poster_path)}
                alt={movie.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* rank chip */}
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white/35 backdrop-blur-sm">
              #{i + 3}
            </span>

            {/* title on hover */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="line-clamp-2 text-[10px] font-bold leading-snug text-white">
                {movie.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── section wrapper ────────────────────────────────────── */
function Section({ eyebrow, title, count, children }) {
  return (
    <section className="px-10 pt-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex-none text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
          {eyebrow}
        </span>
        <span className="flex-none text-[15px] font-bold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        {count && (
          <span className="flex-none text-[10px] font-semibold tracking-[0.1em] text-[var(--color-text-muted)]">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

/* ─── page ───────────────────────────────────────────────── */
export default function PersonalizedHome() {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPersonalizedHome()
      .then((d) => setSections(d.sections))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  const featured = sections?.becauseYouSaved?.[0];
  const saved = sections?.becauseYouSaved ?? [];
  const genre = sections?.favoriteGenrePicks ?? [];
  const trending = sections?.trending ?? [];

  return (
    <>
      <style>{`
        @keyframes fv-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg-base)] pb-20">
        {featured && <Hero movie={featured} />}

        {saved.length > 1 && (
          <Section
            eyebrow="Because You Saved"
            title="More Like What You Love"
            count={`${Math.min(saved.length - 1, 16)} FILMS`}
          >
            <DragRow movies={saved} skip={1} />
          </Section>
        )}

        {genre.length > 0 && (
          <Section
            eyebrow="Your Taste"
            title="From Your Selected Genre"
            count={`${Math.min(genre.length, 16)} FILMS`}
          >
            <DragRow movies={genre} />
          </Section>
        )}

        {trending.length > 0 && (
          <Section
            eyebrow="Right Now"
            title="Trending This Week"
            count="TOP 10"
          >
            <TrendingMosaic movies={trending} />
          </Section>
        )}
      </div>
    </>
  );
}
