import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Trending from "./components/TrendingSection";
import Recommended from "./components/RecommendedSection";
import Profile from "./components/Profile";
import SearchBar from "./components/SearchBar";
import FullPageLoader from "./components/FullPageLoader";
import AuthPage from "./components/AuthPage";
import Watchlist from "./components/Watchlist";
import Footer from "./components/Footer";
import MoreDetails from "./components/MoreDetails";
import EDITHChat from "./components/EDITHChat";


// MONETIZATION IMPORTS
// import PremiumStatus from "./components/PremiumStatus";
// import PremiumButton from "./components/PremiumButton";
// import WatchlistInsights from "./components/WatchlistInsights";
// import MpesaPayment from "./components/MpesaPayment";
// import { trackAdClick } from "./components/AdTracker";
// import { trackSponsoredClick } from "./components/SponsoredTracker";



function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingApp(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user || token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  //GLOBAL
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BrowserRouter>
      {loadingApp ? (
        <FullPageLoader />
      ) : !isAuthenticated ? (
        <AuthPage onLogin={setIsAuthenticated} />
      ) : (
        <div className="App">

          <NavBar
            onSelectMovie={handleSelectMovie}
            onLogout={handleLogout}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  selectedMovie={selectedMovie}
                  setSelectedMovie={handleSelectMovie}
                  heroMovie={heroMovie}
                  setHeroMovie={setHeroMovie}
                />
              }
            />

            <Route path="/trending" element={<Trending />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/search" element={<SearchBar onSelectMovie={handleSelectMovie} />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="/watchlist" element={<Watchlist onSelectMovie={handleSelectMovie} />} />
          </Routes>

          {selectedMovie && (
            <MoreDetails
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />
          )}

          <Footer />
          <EDITHChat />

        </div>
      )}
    </BrowserRouter>
  );
}

export default App;