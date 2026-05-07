import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPersonalizedHome } from "../services/personalizedApi";

const IMG = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── drag scroll hook ───────────────────────────────────── */
function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const onMouseDown = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!drag.current.active || !ref.current) return;
    const dx = (e.pageX - ref.current.offsetLeft - drag.current.startX) * 1.5;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.scrollLeft - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!ref.current) return;
    drag.current.active = false;
    ref.current.style.cursor = "grab";
  }, []);

  const onClick = useCallback((e) => {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
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
    <div className="min-h-screen bg-[#0a0a0a] px-8 pt-28 pb-20 md:px-12">
      <div className="mb-2 h-2 w-14 rounded-full bg-white/[0.07] animate-pulse" />
      <div className="mb-10 h-12 w-72 rounded-lg bg-white/[0.07] animate-pulse" />
      <div className="mb-10 h-[240px] rounded-2xl bg-white/[0.07] animate-pulse" />
      <div className="flex gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ width: 96, flexShrink: 0 }}>
            <div className="aspect-[2/3] rounded-xl bg-white/[0.07] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── hero ───────────────────────────────────────────────── */
function Hero({ movie }) {
  if (!movie) return null;
  const bg =
    IMG(movie.backdrop_path, "original") || IMG(movie.poster_path, "w780");

  return (
    <Link
      to={`/movie/tmdb/${movie.id}`}
      className="group relative flex h-[240px] w-full overflow-hidden rounded-2xl md:h-[300px]"
    >
      {bg && (
        <img
          src={bg}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col justify-end gap-2 p-6 md:p-8 md:max-w-[55%]">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,.15)",
              background: "rgba(255,255,255,.07)",
              borderRadius: 100,
              padding: "3px 10px",
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.45)",
            }}
          >
            Featured
          </span>
          {movie.vote_average > 0 && (
            <span
              style={{
                background: "rgba(245,158,11,.15)",
                borderRadius: 100,
                padding: "3px 10px",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#f59e0b",
              }}
            >
              ★ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        <h2 className="text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
          {movie.title}
        </h2>

        {movie.overview && (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-white/40 hidden md:block">
            {movie.overview}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 transition-all duration-200 group-hover:scale-[0.97]"
            style={{
              background: "#fff",
              color: "#000",
              borderRadius: 100,
              padding: "7px 16px",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.05em",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
              <path d="M1 1l7 3.5L1 8V1z" />
            </svg>
            Watch Now
          </span>
          {movie.release_date && (
            <span className="text-[11px] text-white/25">
              {movie.release_date.split("-")[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── poster card ────────────────────────────────────────── */
function PosterCard({ movie, index }) {
  return (
    <Link
      to={`/movie/tmdb/${movie.id}`}
      draggable={false}
      className="group flex flex-col select-none"
      style={{ animation: `fv-up .45s ${index * 35}ms ease both` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/[0.05]">
        {IMG(movie.poster_path) ? (
          <img
            src={IMG(movie.poster_path)}
            alt={movie.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="h-full w-full bg-white/[0.04]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {movie.vote_average > 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-white/50 transition-colors duration-200 group-hover:text-white/80 px-0.5">
        {movie.title}
      </p>
      {movie.release_date && (
        <p className="mt-0.5 text-[10px] text-white/20 px-0.5">
          {movie.release_date.split("-")[0]}
        </p>
      )}
    </Link>
  );
}

/* ─── drag scroll row ────────────────────────────────────── */
function DragRow({ movies, skip = 0 }) {
  const { ref, onMouseDown, onClick } = useDragScroll();
  if (!movies?.length) return null;

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className="flex gap-2.5 overflow-x-auto pb-2"
      style={{
        cursor: "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {movies.slice(skip, skip + 16).map((m, i) => (
        <div key={m.id} style={{ width: 96, flexShrink: 0 }}>
          <PosterCard movie={m} index={i} />
        </div>
      ))}
    </div>
  );
}

/* ─── trending mosaic ────────────────────────────────────── */
function TrendingMosaic({ movies }) {
  if (!movies?.length) return null;
  const list = movies.slice(0, 10);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridAutoRows: "auto",
        gap: 8,
      }}
    >
      {list.map((movie, i) => {
        const big = i < 2;
        const poster = IMG(movie.poster_path);
        const backdrop = IMG(movie.backdrop_path, "w780");
        const src = big ? backdrop || poster : poster;

        return (
          <Link
            key={movie.id}
            to={`/movie/tmdb/${movie.id}`}
            className="group relative overflow-hidden rounded-xl bg-white/[0.05]"
            style={{
              gridColumn: big ? "span 2" : "span 1",
              aspectRatio: big ? "16/9" : "2/3",
              animation: `fv-up .45s ${i * 40}ms ease both`,
            }}
          >
            {src && (
              <img
                src={src}
                alt={movie.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            )}

            {/* always-on dark tint for legibility */}
            <div className="absolute inset-0 bg-black/20" />

            {/* hover reveal overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* rank */}
            <span
              className="absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[9px] font-black text-white/30 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,.55)" }}
            >
              #{i + 1}
            </span>

            {/* rating on hover */}
            {movie.vote_average > 0 && (
              <span className="absolute top-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            )}

            {/* title slides up */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-3">
              <p
                className={`font-bold text-white leading-tight line-clamp-2 ${big ? "text-[13px]" : "text-[10px]"}`}
              >
                {movie.title}
              </p>
              {big && movie.release_date && (
                <p className="mt-0.5 text-[10px] text-white/40">
                  {movie.release_date.split("-")[0]}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── section ────────────────────────────────────────────── */
function Section({ eyebrow, title, children }) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <span
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,.06)",
            borderRadius: 100,
            padding: "4px 10px",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.22)",
            whiteSpace: "nowrap",
          }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.65)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <div className="h-px flex-1 bg-white/[0.07]" />
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

  return (
    <>
      <style>{`
        @keyframes fv-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] px-8 pt-24 pb-28 md:px-12">
        <header className="mb-8" style={{ animation: "fv-up .4s ease both" }}>
          <p
            style={{
              marginBottom: 6,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--color-brand, #e05c2a)",
            }}
          >
            Personalized For You
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            Your FilmVault
          </h1>
        </header>

        {featured && (
          <div
            className="mb-12"
            style={{ animation: "fv-up .4s 60ms ease both" }}
          >
            <Hero movie={featured} />
          </div>
        )}

        {sections?.becauseYouSaved?.length > 1 && (
          <Section eyebrow="Because You Saved" title="More Like What You Love">
            <DragRow movies={sections.becauseYouSaved} skip={1} />
          </Section>
        )}

        {sections?.favoriteGenrePicks?.length > 0 && (
          <Section eyebrow="Your Taste" title="From Your Favorite Genres">
            <DragRow movies={sections.favoriteGenrePicks} />
          </Section>
        )}

        {sections?.trending?.length > 0 && (
          <Section eyebrow="Right Now" title="Trending This Week">
            <TrendingMosaic movies={sections.trending} />
          </Section>
        )}
      </main>
    </>
  );
}
