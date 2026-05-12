import React from "react";
import "./footer.css";
import instagramIcon from "../assets/icons/instagram.png";
import gmailIcon from "../assets/icons/gmail.png";
import mediaOrbit from "../assets/icons/mediaorbit_icon.png";
import PremiumButton from "./PremiumButton";

function Footer() {
  return (
    <footer className="anime-footer">
      <div className="footer-content">
        {/* LEFT */}
        <div className="footer-left">
          <h2 className="footer-title"> MediaOrbit Nexus</h2>
          <p className="footer-quote">
            Explore cinematic worlds beyond your imagination.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <p className="footer-quote">
            “In a world where stories never end, MediaOrbit becomes the gateway between reality and imagination. Every scroll reveals a new legend, every click opens a new arc, and every watchlist becomes a personal journey through countless worlds waiting to be discovered.”
          </p>

          <p className="footer-quote">
            “Every viewer is the main character of their own story. From rising heroes to forgotten realms, MediaOrbit connects you to endless cinematic adventures where every movie is a new power to unlock and every series is a new battle to experience.”
          </p>

          <p className="footer-quote">
            “Across infinite genres and timelines, stories converge here. MediaOrbit is your personal gateway to cinematic worlds — from action-packed sagas to emotional journeys, all just one click away in your evolving watchlist universe.”
          </p>
        </div>

        {/* ABOUT US */}
        <div className="footer-box">
          <h3 className="footer-subtitle">About Us</h3>
          <p className="footer-quote">
            MediaOrbit is an anime-inspired streaming discovery universe where movies and series become interconnected story arcs.
            We blend entertainment with immersive storytelling so every user feels like the main character of their own journey.
          </p>
        </div>

        {/* CONTACT US */}
        <div className="footer-box">
          <h3 className="footer-subtitle">Contact Us</h3>

          <p className="footer-quote">
            Got feedback, ideas, or issues? Reach out and help shape the MediaOrbit universe.
          </p>

          <p className="contact-item">
            <img src={instagramIcon} alt="Instagram" className="contact-icon" />
            <span>@mediaorbit</span>
          </p>

          <p className="contact-item">
            <img src={gmailIcon} alt="Gmail" className="contact-icon" />
            <span>support@mediaorbit.com</span>
          </p>

          <div className="footer-premium-btn">
            <PremiumButton />
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-right footer-links">
          <a href="/">Home</a>
          <a href="/trending">Trending</a>
          <a href="/recommended">Recommended</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/profile">Profile</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MediaOrbit • Built with anime energy ✨
      </div>
    </footer>
  );
}

export default Footer;