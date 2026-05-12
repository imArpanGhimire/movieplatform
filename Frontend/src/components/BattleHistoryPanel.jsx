import { useEffect, useMemo, useState } from "react";
import { X, History, Trophy } from "lucide-react";
import { getBattleHistory } from "../services/battleApi";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const BattleHistoryPanel = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getBattleHistory();
        setHistory(data.history || []);
      } catch (error) {
        console.log("Battle history fetch failed:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const groupedHistory = useMemo(() => groupBattlesByDate(history), [history]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-bg-card)] shadow-2xl">
        <PanelHeader onClose={onClose} />

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {loading ? (
            <LoadingState />
          ) : history.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, battles]) => (
                <DayHistoryGroup key={date} date={date} battles={battles} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PanelHeader = ({ onClose }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[var(--color-bg-card)]/95 p-6 backdrop-blur-xl">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
          <History size={13} />
          Battle History
        </div>

        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Your previous movie battles
        </h2>
      </div>

      <button
        onClick={onClose}
        className="rounded-full border border-white/10 p-2 text-[var(--color-text-muted)] transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-40 animate-pulse rounded-3xl bg-white/[0.05]"
        />
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="mb-5 rounded-full border border-white/10 bg-white/[0.04] p-5 text-teal-400">
        <History size={32} />
      </div>

      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
        No battle history yet
      </h3>

      <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
        Once you vote in movie battles, your previous matchups will appear here.
      </p>
    </div>
  );
};

const groupBattlesByDate = (history) => {
  return history.reduce((groups, battle) => {
    const date = battle.battleDate || battle.createdAt?.slice(0, 10);

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(battle);

    return groups;
  }, {});
};

const DayHistoryGroup = ({ date, battles }) => {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[var(--color-bg-base)] p-5">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-teal-400">
            Battle Day
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
            {new Date(date).toLocaleDateString()}
          </h3>
        </div>

        <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-[var(--color-text-muted)]">
          {battles.length} matchups
        </span>
      </div>

      <div className="space-y-4">
        {battles.map((battle, index) => (
          <HistoryCard key={battle._id} battle={battle} index={index} />
        ))}
      </div>
    </div>
  );
};

const HistoryCard = ({ battle, index }) => {
  const winner =
    battle.percentageA >= battle.percentageB ? battle.movieA : battle.movieB;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          Matchup 0{index + 1}
        </span>

        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-xs text-teal-400">
          <Trophy size={12} />
          Winner: {winner.title}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <HistoryMovie
          movie={battle.movieA}
          percentage={battle.percentageA}
          selected={battle.selectedMovie === "movieA"}
        />

        <div className="text-xs font-bold text-[var(--color-text-muted)]">
          VS
        </div>

        <HistoryMovie
          movie={battle.movieB}
          percentage={battle.percentageB}
          selected={battle.selectedMovie === "movieB"}
        />
      </div>
    </div>
  );
};

const HistoryMovie = ({ movie, percentage, selected }) => {
  return (
    <div
      className={`flex min-h-[96px] items-center gap-3 rounded-xl border p-3 ${
        selected
          ? "border-teal-400/30 bg-teal-500/10"
          : "border-white/[0.06] bg-white/[0.03]"
      }`}
    >
      <img
        src={`${IMAGE_BASE_URL}${movie.poster}`}
        alt={movie.title}
        className="h-20 w-14 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0">
        <h4 className="line-clamp-2 text-sm font-semibold text-[var(--color-text-primary)]">
          {movie.title}
        </h4>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {percentage ?? 0}% votes
        </p>

        {selected && (
          <p className="mt-1 text-[11px] font-medium text-teal-400">
            Your pick
          </p>
        )}
      </div>
    </div>
  );
};

export default BattleHistoryPanel;
