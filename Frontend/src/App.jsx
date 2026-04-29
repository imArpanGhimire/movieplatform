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

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999,
              marginTop: "80px", // adjust based on navbar height
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
