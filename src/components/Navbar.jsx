import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../logo.png";
import SearchBar from "./SearchBar";
import PremiumStatus from "./PremiumStatus";
import "../navbar.css";

const API_URL = "https://eddytwiga.alwaysdata.net";

const NavBar = ({ onSelectMovie, onLogout }) => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      fetch(`${API_URL}/api/get_watchlist/${storedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length !== count) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 300);
          }
          setCount(data.length);
        })
        .catch(() => setCount(0));

      setUser(storedUser);
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("watchlistUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("watchlistUpdated", updateCount);
    };
  }, [count]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active fw-semibold text-info" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid px-3">
        {/* LOGO */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center fw-bold">
          <img
            src={Logo}
            alt="logo"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
          <span className="ms-2 d-none d-md-block">
            MediaOrbit <br />Explore
          </span>
        </NavLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* LEFT LINKS */}
          <ul className="navbar-nav me-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/trending" className={linkClass}>
                Trending
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/recommended" className={linkClass}>
                Recommended
              </NavLink>
            </li>

            <li className="nav-item position-relative">
              <NavLink to="/watchlist" className={linkClass}>
                Watchlist
              </NavLink>

              {count > 0 && (
                <span className={`watchlist-badge ${animate ? "badge-animate" : ""}`}>
                  {count}
                </span>
              )}
            </li>
          </ul>

          {/* CENTER SEARCH */}
          <div className="search-wrapper">
            <SearchBar onSelectMovie={onSelectMovie} />
          </div>

          {/* RIGHT PROFILE */}
          <ul className="navbar-nav align-items-center">
            <li className="nav-item dropdown-container" ref={dropdownRef}>
              <div className="nav-profile-wrapper">
                <img
                  src={
                    user?.profile_pic
                      ? `${API_URL}/${user.profile_pic}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="nav-profile-pic"
                  onClick={() => setOpen(!open)}
                />

                {user?.username && (
                  <div className="nav-username">
                    {user.username}
                    <span className="username-line"></span>
                  </div>
                )}
              </div>

              {open && (
                <div className="profile-dropdown">
                  <div className="navbar-premium-status">
                    <PremiumStatus />
                  </div>

                  <Link to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/watchlist" onClick={() => setOpen(false)}>
                    Watchlist
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;