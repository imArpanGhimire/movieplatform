import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sileo";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MovieListingPage from "./components/MovieListingPage";
import MovieDetailPage from "./components/MovieDetailPage";
import ProtectedRoute from "./protection/ProtectedRoute";
import GuestRoute from "./protection/GuestRoute";
import SavedMoviesPage from "./components/SavedMoviesPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";
import PersonalizedHome from "./components/PersonalizedHome";
import MovieBattle from "./components/MovieBattle";

const AUTH_ROUTES = ["/login", "/register"];

const AppContent = () => {
  const location = useLocation();
  const hideFooter = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
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
        {/* key={location.key} forces LandingPage to remount on every visit
            so useEffect re-runs and the marquee animation always plays */}
        <Route path="/" element={<LandingPage key={location.key} />} />

        {/* Guest only */}
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

        {/* Protected */}
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
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <PersonalizedHome />
            </ProtectedRoute>
          }
        />
        <Route path="/battle" element={<MovieBattle />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
