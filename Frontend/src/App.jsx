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
import ScrollToTop from "./components/ScrollToTop";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MovieListingPage from "./components/MovieListingPage";
import MovieDetailPage from "./components/MovieDetailPage";
import SavedMoviesPage from "./components/SavedMoviesPage";
import ProfilePage from "./components/ProfilePage";
import PersonalizedHome from "./components/PersonalizedHome";
import MovieBattle from "./components/MovieBattle";

import ProtectedRoute from "./protection/ProtectedRoute";
import GuestRoute from "./protection/GuestRoute";

const AUTH_ROUTES = ["/login", "/register"];

const TOASTER_OPTIONS = {
  fill: "rgba(14, 51, 93)",
  className:
    "mt-20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white",
  styles: {
    title: "text-teal-300 font-semibold",
    description: "text-slate-200",
  },
};

const protectedRoutes = [
  { path: "/movies", element: <MovieListingPage /> },
  { path: "/movie/tmdb/:tmdbId", element: <MovieDetailPage /> },
  { path: "/saved", element: <SavedMoviesPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/home", element: <PersonalizedHome /> },
  { path: "/battle", element: <MovieBattle /> },
];

const AppContent = () => {
  const location = useLocation();
  const hideFooter = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Toaster position="top-center" options={TOASTER_OPTIONS} />

      <Routes>
        <Route path="/" element={<LandingPage key={location.key} />} />

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

        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}
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
