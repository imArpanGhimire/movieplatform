import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sileo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { fetchTopRatedMovies } from "./api/queries";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["top-rated-movies"],
      queryFn: fetchTopRatedMovies,
      staleTime: 1000 * 60 * 15,
    });
  }, []);

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
