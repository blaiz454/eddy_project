import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Trending from "./components/Trending";
import Recommended from "./components/Recommended";
import Watchlist from "./components/Watchlist";
import FullPageLoader from "./components/FullPageLoader";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <FullPageLoader onFinish={() => setLoading(false)} />
    );
  }

  return (
    <BrowserRouter>
      <NavBar onSelectMovie={setSelectedMovie} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
            />
          }
        />

        <Route
          path="/trending"
          element={<Trending onSelectMovie={setSelectedMovie} />}
        />

        <Route
          path="/recommended"
          element={<Recommended onSelectMovie={setSelectedMovie} />}
        />

      
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;