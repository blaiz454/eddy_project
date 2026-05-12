import { useEffect, useState } from "react";
import "./Loader.css";

function FullPageLoader() {
  const [index, setIndex] = useState(0);

  const slides = [
    "⚡ Welcome to MediaOrbit",
    "🎬 Discover Movies, Series & Anime",
    "🔥 Stream Your Favorites Anytime",
    "🌌 Your Entertainment Universe Starts Here",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fullpage-loader">

      <div className="aura-bg"></div>

      <div className="loader-content">

        <div className="energy-ring"></div>
        <div className="energy-core"></div>

        <h1 className="logo glow-blue">MediaOrbit</h1>

        <p key={index} className="slide-text fade-slide">
          {slides[index]}
        </p>

        <div className="loader-bar">
          <div className="loader-fill"></div>
        </div>

      </div>
    </div>
  );
}

export default FullPageLoader;