import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const hasStartedAudio = useRef(false);

  const [isLogin, setIsLogin] = useState(true);
  const [showCard, setShowCard] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone,setPhone]=useState("");

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  //  SAFE AUDIO START 
  const startAudio = () => {
    if (hasStartedAudio.current) return;

    if (audioRef.current) {
      audioRef.current.volume = 0.4;

      audioRef.current.play()
        .then(() => {
          hasStartedAudio.current = true;
        })
        .catch(() => {});
    }
  };

  //  LOGIN / SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading("Please wait...");
    setError("");
    setSuccess("");

    try {
      const url = isLogin
        ? "https://eddytwiga.alwaysdata.net/api/signin"
        : "https://eddytwiga.alwaysdata.net/api/signup";

      const payload = isLogin
        ? { email: email.trim(), password }
        : {
            username: username.trim(),
            email: email.trim(),
            password,
              phone: phone.trim(),
          };

      const response = await axios.post(url, payload);

      setLoading("");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Welcome to MediaOrbit ");

        setTimeout(() => {
          onLogin(true);
          navigate("/");
        }, 1000);
      } else {
        setError(response.data.message || "Authentication failed");
      }
    } catch (err) {
      setLoading("");
      setError(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div className="auth-wrapper" onClick={startAudio}>

      {/* AUDIO */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/reze-theme.mp3" type="audio/mpeg" />
      </audio>

      {/*  VIDEO GRID */}
      <div className="video-grid">

        {/* Anime */}
        <video autoPlay muted loop playsInline preload="auto" src="/videos/demon_slayer.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/solo_leveling.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/jujutsu_kaisen.mp4" />

        {/* Series */}
        <video autoPlay muted loop playsInline preload="auto" src="/videos/chainsaw.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/slayers.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/naruto.mp4" />

        {/* KDrama */}
        <video autoPlay muted loop playsInline preload="auto" src="/videos/kdrama1.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/kdrama2.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/kdrama3.mp4" />

        {/* Movies */}
        <video autoPlay muted loop playsInline preload="auto" src="/videos/movie1.mp4" />
        <video autoPlay muted loop playsInline preload="auto" src="/videos/solo.mp4" />

        {/* Trending mix */}
        <video autoPlay muted loop playsInline preload="auto" src="/videos/chainsaw_reze.mp4" />

      </div>

      {/* OVERLAY */}
      <div className="auth-overlay"></div>

      {/* AUTH CARD */}
      <div className={`auth-card ${showCard ? "show" : ""}`}>

        <h1 className="auth-logo">MediaOrbit</h1>
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

        {loading && <p>{loading}</p>}
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
  />
)}

          <button className="auth-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>

        </form>

        <p>
          {isLogin ? "New here?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign up" : " Sign in"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;