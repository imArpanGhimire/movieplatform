import React from "react";

const Review = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button className="text-teal-500 hover:text-teal-400 font-medium mb-8 transition-colors">
        ← Back to Films
      </button>

      {/* Movie Header */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Inception
            </h1>
            <p className="text-slate-400">Christopher Nolan</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-teal-500 mb-2">4.5</div>
            <p className="text-sm text-slate-400">12 reviews</p>
          </div>
        </div>

        <div className="flex gap-6 text-slate-300 text-sm">
          <div>
            <span className="text-slate-400">Genre:</span> Sci-Fi
          </div>
          <div>
            <span className="text-slate-400">Duration:</span> 148 min
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          Write Your Review
        </h2>

        <form className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-3xl text-teal-500 scale-110"
              >
                ★
              </button>
              <button
                type="button"
                className="text-3xl text-teal-500 scale-110"
              >
                ★
              </button>
              <button
                type="button"
                className="text-3xl text-teal-500 scale-110"
              >
                ★
              </button>
              <button
                type="button"
                className="text-3xl text-teal-500 scale-110"
              >
                ★
              </button>
              <button
                type="button"
                className="text-3xl text-teal-500 scale-110"
              >
                ★
              </button>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Thoughts
            </label>
            <textarea
              placeholder="Share your thoughts about this film..."
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-900 font-semibold py-3 rounded-lg transition-all"
          >
            Post Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Reviews (12)</h2>

        <div className="space-y-4">
          {/* Review Card */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-slate-100">John Doe</p>
                <p className="text-xs text-slate-400">2024-03-20</p>
              </div>
              <div className="flex gap-1">
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
              </div>
            </div>
            <p className="text-slate-300">
              Mind-bending masterpiece. One of the best films ever made.
            </p>
          </div>

          {/* Review Card */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-slate-100">Jane Smith</p>
                <p className="text-xs text-slate-400">2024-03-19</p>
              </div>
              <div className="flex gap-1">
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-zinc-600">★</span>
              </div>
            </div>
            <p className="text-slate-300">
              Excellent but a bit long. Worth watching.
            </p>
          </div>

          {/* Review Card */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-slate-100">Alex Johnson</p>
                <p className="text-xs text-slate-400">2024-03-18</p>
              </div>
              <div className="flex gap-1">
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-teal-500">★</span>
                <span className="text-zinc-600">★</span>
                <span className="text-zinc-600">★</span>
              </div>
            </div>
            <p className="text-slate-300">
              Good movie, but confusing at times. Still worth the watch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
