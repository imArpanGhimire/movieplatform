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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
