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
  const bar = (w, h = "10px", r = "6px") => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: "var(--color-bg-card)",
        animation: "fv-pulse 1.6s ease infinite",
      }}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)" }}>
      {/* hero skeleton */}
      <div
        style={{
          height: 420,
          background: "var(--color-bg-page)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {bar("80px")}
          {bar("320px", "44px", "6px")}
          {bar("280px")}
          {bar("200px")}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {bar("120px", "36px", "8px")}
            {bar("100px", "36px", "8px")}
          </div>
        </div>
      </div>
      {/* row skeletons */}
      {[0, 1].map((s) => (
        <div key={s} style={{ padding: "32px 40px 0" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {bar("100px")} {bar("160px")}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 100,
                  flexShrink: 0,
                  aspectRatio: "2/3",
                  borderRadius: 10,
                  background: "var(--color-bg-card)",
                  animation: `fv-pulse 1.6s ${i * 80}ms ease infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
      <style>{`@keyframes fv-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
    </div>
  );
}

/* ─── hero ───────────────────────────────────────────────── */
function Hero({ movie }) {
  if (!movie) return null;
  const backdrop =
    IMG(movie.backdrop_path, "original") || IMG(movie.poster_path, "w780");

  return (
    <div
      style={{
        position: "relative",
        height: 420,
        overflow: "hidden",
        background: "var(--color-bg-page)",
      }}
    >
      {/* backdrop */}
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .7s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      )}
      {/* gradients */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, var(--color-bg-base) 0%, rgba(9,9,11,.75) 50%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, var(--color-bg-base) 0%, rgba(9,9,11,.5) 35%, transparent 100%)",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "36px 40px",
          maxWidth: 600,
          animation: "fv-up .5s ease both",
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-brand)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-brand)",
            }}
          >
            Featured Pick
          </span>
        </div>

        {/* title */}
        <h2
          style={{
            fontFamily: "var(--font-swash, 'Cinzel', serif)",
            fontSize: "clamp(28px,4vw,44px)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            lineHeight: 1.05,
            letterSpacing: "-.5px",
            marginBottom: 10,
          }}
        >
          {movie.title}
        </h2>

        {/* overview */}
        {movie.overview && (
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              lineHeight: 1.65,
              marginBottom: 18,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: 420,
            }}
          >
            {movie.overview}
          </p>
        )}

        {/* actions row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            to={`/movie/tmdb/${movie.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "var(--color-brand)",
              color: "#09090b",
              borderRadius: 8,
              padding: "9px 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "background .2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--color-brand-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "var(--color-brand)")
            }
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M2 1l7 4-7 4V1z" />
            </svg>
            Watch Now
          </Link>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,.07)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
              borderRadius: 8,
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.11)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.07)")
            }
          >
            + Add to List
          </button>

          {/* rating */}
          {movie.vote_average > 0 && (
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                  lineHeight: 1,
                }}
              >
                {movie.vote_average.toFixed(1)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-brand)",
                  letterSpacing: 2,
                  marginTop: 2,
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
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
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/movie/tmdb/${movie.id}`}
      draggable={false}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        userSelect: "none",
        animation: `fv-up .45s ${index * 35}ms ease both`,
      }}
    >
      {/* poster */}
      <div
        style={{
          position: "relative",
          aspectRatio: "2/3",
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--color-bg-card)",
        }}
      >
        {IMG(movie.poster_path) ? (
          <img
            src={IMG(movie.poster_path)}
            alt={movie.title}
            draggable={false}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .5s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--color-bg-elevated)",
            }}
          />
        )}

        {/* hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, rgba(9,9,11,.8) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity .3s",
          }}
        />

        {/* rating badge */}
        {movie.vote_average > 0 && (
          <span
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(9,9,11,.8)",
              backdropFilter: "blur(4px)",
              borderRadius: 6,
              padding: "2px 6px",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--color-brand)",
              opacity: hovered ? 1 : 0,
              transition: "opacity .3s",
            }}
          >
            ★ {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>

      {/* meta */}
      <p
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: 600,
          color: hovered
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)",
          lineHeight: 1.3,
          transition: "color .2s",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {movie.title}
      </p>
      {movie.release_date && (
        <p
          style={{
            marginTop: 3,
            fontSize: 10,
            color: "var(--color-text-muted)",
          }}
        >
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
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        paddingBottom: 8,
        cursor: "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {movies.slice(skip, skip + 16).map((m, i) => (
        <div key={m.id} style={{ width: 100, flexShrink: 0 }}>
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
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}
    >
      {list.map((movie, i) => {
        const big = i < 2;
        const src = big
          ? IMG(movie.backdrop_path, "w780") || IMG(movie.poster_path)
          : IMG(movie.poster_path);

        return (
          <Link
            key={movie.id}
            to={`/movie/tmdb/${movie.id}`}
            style={{
              gridColumn: big ? "span 2" : "span 1",
              aspectRatio: big ? "16/9" : "2/3",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              background: "var(--color-bg-card)",
              display: "block",
              textDecoration: "none",
              animation: `fv-up .45s ${i * 40}ms ease both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector(".t-overlay").style.opacity = "1";
              e.currentTarget.querySelector(".t-info").style.opacity = "1";
              e.currentTarget.querySelector(".t-info").style.transform =
                "translateY(0)";
              const img = e.currentTarget.querySelector("img");
              if (img) img.style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector(".t-overlay").style.opacity = "0";
              e.currentTarget.querySelector(".t-info").style.opacity = "0";
              e.currentTarget.querySelector(".t-info").style.transform =
                "translateY(6px)";
              const img = e.currentTarget.querySelector("img");
              if (img) img.style.transform = "scale(1)";
            }}
          >
            {src && (
              <img
                src={src}
                alt={movie.title}
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform .5s ease",
                }}
              />
            )}

            {/* always-on dark base */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(9,9,11,.25)",
              }}
            />

            {/* hover overlay */}
            <div
              className="t-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(9,9,11,.88) 0%, rgba(9,9,11,.1) 60%, transparent 100%)",
                opacity: 0,
                transition: "opacity .3s",
              }}
            />

            {/* rank — always visible */}
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(9,9,11,.65)",
                backdropFilter: "blur(4px)",
                borderRadius: 6,
                padding: "3px 7px",
                fontSize: 9,
                fontWeight: 800,
                color: "var(--color-text-muted)",
                letterSpacing: "0.1em",
              }}
            >
              #{i + 1}
            </span>

            {/* teal rating badge — always visible on big tiles */}
            {big && movie.vote_average > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "var(--color-brand-subtle)",
                  border: "1px solid var(--color-brand-border)",
                  borderRadius: 6,
                  padding: "3px 7px",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--color-brand)",
                }}
              >
                ★ {movie.vote_average.toFixed(1)}
              </span>
            )}

            {/* title + year — slides up on hover */}
            <div
              className="t-info"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: big ? "12px 14px" : "8px 10px",
                opacity: 0,
                transform: "translateY(6px)",
                transition: "opacity .3s, transform .3s",
              }}
            >
              <p
                style={{
                  fontSize: big ? 14 : 10,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {movie.title}
              </p>
              {big && movie.release_date && (
                <p
                  style={{
                    marginTop: 3,
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                  }}
                >
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

/* ─── section wrapper ────────────────────────────────────── */
function Section({ eyebrow, title, count, children }) {
  return (
    <section style={{ padding: "32px 40px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--color-brand)",
            flexShrink: 0,
          }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-.2px",
            flexShrink: 0,
          }}
        >
          {title}
        </span>
        <div
          style={{ flex: 1, height: 1, background: "var(--color-border)" }}
        />
        {count && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--color-text-muted)",
              letterSpacing: "0.1em",
              flexShrink: 0,
            }}
          >
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
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg-base)",
          paddingBottom: 80,
        }}
      >
        {/* hero — no top padding, bleeds to nav */}
        {featured && <Hero movie={featured} />}

        {/* because you saved */}
        {saved.length > 1 && (
          <Section
            eyebrow="Because You Saved"
            title="More Like What You Love"
            count={`${Math.min(saved.length - 1, 16)} FILMS`}
          >
            <DragRow movies={saved} skip={1} />
          </Section>
        )}

        {/* genre picks */}
        {genre.length > 0 && (
          <Section
            eyebrow="Your Taste"
            title="From Your Favorite Genres"
            count={`${Math.min(genre.length, 16)} FILMS`}
          >
            <DragRow movies={genre} />
          </Section>
        )}

        {/* trending mosaic */}
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
