import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sileo";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MovieListingPage from "./components/MovieListingPage";
import MovieDetailPage from "./components/MovieDetailPage";
import ProtectedRoute from "./protection/ProtectedRoute";
import SavedMoviesPage from "./components/SavedMoviesPage";
import LandingPage from "./components/LandingPage";

import ProfilePage from "./components/ProfilePage";
import GuestRoute from "./protection/GuestRoute";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Toaster
          position="top-center"
          options={{
            fill: "rgba(14, 51, 93)",
            className:
              "mt-20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white",

            styles: {
              title: "text-teal-300 font-semibold",
              description: "text-slate-200",
            },
          }}
        />
        <Routes>
          {/* Public — anyone can visit */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest only — logged-in users get sent to /movies */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* Protected — guests get sent to /login */}
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MovieListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/tmdb/:tmdbId"
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedMoviesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
