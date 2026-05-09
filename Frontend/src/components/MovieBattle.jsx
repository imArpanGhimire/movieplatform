import { useEffect, useState } from "react";
import { getTodayBattles, voteBattle } from "../services/battleApi";
import BattleHistoryPanel from "../components/BattleHistoryPanel";
import { ArrowRight, Swords, Check } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieBattle() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTodayBattles();
      setBattles((data.battles || []).slice(0, 3));
    } catch (error) {
      console.log(error);
      setError("Failed to load today's battles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  const handleVote = async (battleId, selectedMovie) => {
    try {
      setVotingId(battleId);

      const data = await voteBattle(battleId, selectedMovie);

      setBattles((prev) =>
        prev.map((b) => (b._id === battleId ? data.battle : b)).slice(0, 3),
      );
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to vote");
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <BattleSkeleton />;

  const completedCount = battles.filter((b) => b.hasVoted).length;
  const allComplete = battles.length > 0 && completedCount === battles.length;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-teal-500/[0.04] blur-3xl" />
        </div>

        <main className="relative z-10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <section className="mb-16">
              <div className="flex items-end justify-between gap-6 border-b border-white/[0.06] pb-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-teal-400">
                    <Swords size={12} strokeWidth={2.5} />
                    Daily Battle
                  </div>

                  <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                    This or that.
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Three matchups. One winner each. Pick yours and see how the
                    community voted.
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                  {battles.map((b, i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 rounded-full transition-all duration-500 ${
                        b.hasVoted ? "bg-teal-400" : "bg-zinc-500/40"
                      }`}
                    />
                  ))}

                  <span className="ml-2 text-xs font-medium text-[var(--color-text-muted)]">
                    {completedCount}/{battles.length}
                  </span>
                </div>
              </div>
            </section>

            {error && (
              <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {battles.map((battle, index) => (
                <BattleCard
                  key={battle._id}
                  battle={battle}
                  index={index}
                  votingId={votingId}
                  onVote={handleVote}
                />
              ))}
            </div>

            {allComplete && (
              <section className="mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--color-bg-card)]">
                <div className="grid items-center gap-8 p-10 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-teal-400">
                      <Check size={12} strokeWidth={3} />
                      All Done
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      You've voted on today's battles.
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
                      Check back tomorrow for three new matchups.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowHistory(true)}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-300"
                  >
                    Battle history
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {showHistory && (
        <BattleHistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}

function BattleCard({ battle, index, votingId, onVote }) {
  const isVoting = votingId === battle._id;

  return (
    <section className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--color-bg-card)] transition hover:border-white/[0.12]">
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              0{index + 1}
            </span>

            <span className="h-px w-8 bg-white/10" />

            <span className="text-xs font-medium tracking-wide text-[var(--color-text-secondary)]">
              {battle.hasVoted ? "Voted" : "Choose one"}
            </span>
          </div>

          {battle.hasVoted && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-400">
              <Check size={12} strokeWidth={3} />
              {battle.totalVotes?.toLocaleString() || 0} votes
            </span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 md:gap-5">
          <MovieOption
            movie={battle.movieA}
            side="movieA"
            battle={battle}
            votingId={votingId}
            onVote={onVote}
          />

          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[var(--color-bg-base)] text-[10px] font-semibold tracking-widest text-[var(--color-text-muted)]">
              VS
            </div>
          </div>

          <MovieOption
            movie={battle.movieB}
            side="movieB"
            battle={battle}
            votingId={votingId}
            onVote={onVote}
          />
        </div>

        {battle.hasVoted && <SplitResultBar battle={battle} />}
      </div>

      {isVoting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
        </div>
      )}
    </section>
  );
}

function MovieOption({ movie, side, battle, votingId, onVote }) {
  const isSelected = battle.selectedMovie === side;
  const hasVoted = battle.hasVoted;
  const isVoting = votingId === battle._id;
  const isLoser = hasVoted && !isSelected;

  return (
    <button
      type="button"
      disabled={hasVoted || isVoting}
      onClick={() => onVote(battle._id, side)}
      className={`group/card relative h-[280px] overflow-hidden rounded-xl border transition-all duration-300 md:h-[320px] ${
        isSelected
          ? "border-teal-400/50 ring-1 ring-teal-400/30"
          : isLoser
            ? "border-white/[0.06] opacity-60"
            : "border-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
      }`}
    >
      <img
        src={`${IMAGE_BASE_URL}${movie.poster}`}
        alt={movie.title}
        className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
          !hasVoted ? "group-hover/card:scale-105" : ""
        } ${isLoser ? "grayscale" : ""}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {isSelected && (
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-teal-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
          <Check size={10} strokeWidth={3} />
          Pick
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white md:text-lg">
          {movie.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/60">
          <span>{movie.releaseDate?.slice(0, 4) || "—"}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/40" />
          <span>★ {movie.rating?.toFixed(1) || "—"}</span>
        </div>
      </div>
    </button>
  );
}

function SplitResultBar({ battle }) {
  const a = battle.percentageA ?? 50;
  const b = battle.percentageB ?? 50;
  const userPicked = battle.selectedMovie;

  return (
    <div className="mt-6">
      <div className="relative flex h-2 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className={`h-full transition-all duration-1000 ease-out ${
            userPicked === "movieA" ? "bg-teal-400" : "bg-zinc-500/40"
          }`}
          style={{ width: `${a}%` }}
        />

        <div className="w-px bg-[var(--color-bg-card)]" />

        <div
          className={`h-full transition-all duration-1000 ease-out ${
            userPicked === "movieB" ? "bg-teal-400" : "bg-zinc-500/40"
          }`}
          style={{ width: `${b}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold tabular-nums ${
              userPicked === "movieA" ? "text-teal-400" : "text-white/50"
            }`}
          >
            {a}%
          </span>

          <span className="line-clamp-1 max-w-[140px] text-[var(--color-text-muted)]">
            {battle.movieA.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="line-clamp-1 max-w-[140px] text-right text-[var(--color-text-muted)]">
            {battle.movieB.title}
          </span>

          <span
            className={`font-semibold tabular-nums ${
              userPicked === "movieB" ? "text-teal-400" : "text-white/50"
            }`}
          >
            {b}%
          </span>
        </div>
      </div>
    </div>
  );
}

function BattleSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg-base)]">
      <main className="relative z-10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <section className="mb-16 border-b border-white/[0.06] pb-8">
            <div className="mb-4 h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-12 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/[0.06]" />
          </section>

          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-2xl border border-white/[0.06] bg-[var(--color-bg-card)]"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieBattle;
