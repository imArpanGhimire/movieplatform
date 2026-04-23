import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sileo";

import { ThemeProvider } from "./context/ThemeContext";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MovieListingPage from "./components/MovieListingPage";
import ProtectedRoute from "./protection/ProtectedRoute";
import MovieDetailPage from "./components/MovieDetailPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          options={{
            fill: "oklch(37.3% 0.034 259.733)",
            styles: {
              description:
                "text-white/75! text-center flex items-center justify-center flex-col w-full",
              button: "px-3 py-1 w-[50%]",
            },
          }}
          position="top-center"
        />

        <Navbar />

        <Routes>
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
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/movies" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
