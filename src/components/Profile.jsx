import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import {
  getUserIdentity,
  getTasteDescription,
  getCharacterProfile,
  getViewedGenres
} from "../utils/identity";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from "recharts";

const API_URL = "https://eddytwiga.alwaysdata.net";

/* GENRE MAP */
const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);

  const identity = getUserIdentity();
  const taste = getTasteDescription();

  const [characterStats, setCharacterStats] = useState({});
  const [genreStats, setGenreStats] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setCharacterStats(getCharacterProfile());
    setGenreStats(getViewedGenres());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user.id);

    try {
      const res = await axios.post(`${API_URL}/api/upload_profile_pic`, formData);

      const updatedUser = {
        ...user,
        profile_pic: res.data.profile_pic,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (!user) return <p>Loading...</p>;

  /* DATA TRANSFORM */
  const genreData = Object.entries(genreStats).map(([id, value]) => ({
    name: GENRE_MAP[id] || id,
    value
  }));

  const characterData = [
    { subject: "OP MC", value: characterStats.op_mc || 0 },
    { subject: "Villain", value: characterStats.villain || 0 },
    { subject: "Romance", value: characterStats.romance || 0 },
    { subject: "Introvert", value: characterStats.shy || 0 }
  ];

  const COLORS = ["#00e5ff", "#ff5252", "#ffb300", "#7c4dff", "#00c853"];

  /* INSIGHTS */
  const getInsight = () => {
    const topGenre = genreData.sort((a, b) => b.value - a.value)[0];
    const topCharacter = characterData.sort((a, b) => b.value - a.value)[0];

    if (!topGenre && !topCharacter) {
      return "Not enough data yet. Start watching to unlock insights.";
    }

    return `You are focused on ${topGenre?.name || "mixed genres"} with a tendency toward ${topCharacter?.subject}.`;
  };

  const getAlterEgo = () => {
    if (identity.includes("Strategist")) {
      return "Calculated, strategic viewer who values power and control.";
    }
    if (identity.includes("Dark")) {
      return "Drawn to intense, complex and darker narratives.";
    }
    if (identity.includes("Romance")) {
      return "Emotion-driven viewer who values relationships.";
    }
    if (identity.includes("Observer")) {
      return "Quiet analyst of subtle storytelling.";
    }
    return "Evolving unique viewer identity.";
  };

  const getRecommendation = () => {
    const topGenre = genreData.sort((a, b) => b.value - a.value)[0];
    if (!topGenre) return "Start watching to get recommendations.";
    return `Watch more ${topGenre.name} content.`;
  };

  return (
    <div className="profile-container">

      {/* LEFT DASHBOARD */}
      <div className="dashboard-panel">

        <h2 className="dashboard-title">Your Taste Dashboard</h2>

        <div className="chart-block">
          <h4>Personality Profile</h4>

          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={characterData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar dataKey="value" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <h4>Genre Distribution</h4>

          {genreData.length === 0 ? (
            <p>No data yet...</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genreData} dataKey="value" nameKey="name" outerRadius={80}>
                  {genreData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="profile-middle-space">

        <div className="center-panel">

          <h2 className="dashboard-title">EDITH Insights</h2>

          <div className="insight-box">
            <h4>Analysis</h4>
            <p>{getInsight()}</p>
          </div>

          <div className="insight-box">
            <h4>Decision Assistant</h4>
            <p>{getRecommendation()}</p>
          </div>

          <div className="insight-box">
            <h4>Alter Ego</h4>
            <p>{getAlterEgo()}</p>
          </div>

        </div>
      </div>

      {/* RIGHT PROFILE (HEIGHT FIX CORE) */}
      <div className="profile-right">

        {/* KEY FIX: force full stretch container */}
        <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}>

          <div className="profile-card" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>

            <h1 className="profile-title">Edit Profile</h1>

            <div className="profile-image-wrapper">
              <img
                src={
                  user.profile_pic
                    ? `${API_URL}/${user.profile_pic}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                className="profile-image"
              />

              <input type="file" id="fileUpload" onChange={handleImageChange} hidden />
              <label htmlFor="fileUpload" className="upload-btn">Change</label>
            </div>

            <div className="profile-info">
              <p className="profile-name"><strong>Username:</strong> {user.username}</p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Your Viewer Identity</h3>
              <p style={{ color: "#00e5ff", fontWeight: "bold" }}>{identity}</p>
              <p>{taste}</p>
            </div>

            <div className="profile-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;