import { useState, useEffect, useRef } from "react";
import "./EDITH.css";
import { getUserIdentity, getTasteDescription } from "../utils/identity";

function EDITHChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* PREMIUM SYSTEM */

  const currentUser =
    JSON.parse(localStorage.getItem("user")) || null;

  const premiumKey = currentUser
    ? `edith_premium_${currentUser.id}`
    : "edith_premium_guest";

  const isPremiumUser = () =>
    localStorage.getItem(premiumKey) === "true";

  const activatePremium = () => {
    localStorage.setItem(premiumKey, "true");
    window.location.reload();
  };

  /* CHAT STATE */
  const [messages, setMessages] = useState(() => {
    const seen = localStorage.getItem("edith_seen");

    if (!seen) {
      localStorage.setItem("edith_seen", "true");

      return [
        {
          role: "bot",
          text: "Hey, I'm EDITH — your AI assistant. Ask me what to watch or describe your taste.",
          media: null
        }
      ];
    }

    return [
      {
        role: "bot",
        text: "EDITH online... MediaOrbit system active.",
        media: null
      }
    ];
  });

  const chatBoxRef = useRef(null);

  const toggleChat = () => setOpen((p) => !p);

  /* AUTO SCROLL */
  useEffect(() => {
    if (!chatBoxRef.current) return;

    requestAnimationFrame(() => {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    });
  }, [messages, loading]);

  /* TMDB SEARCH */
  const fetchMedia = async (query) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=6ef0e924214c3ce773dbc4b104a5e723&query=${encodeURIComponent(query)}`
      );

      const data = await res.json();
      const item = data?.results?.[0];

      if (!item) return null;

      return {
        title: item.title || item.name,
        overview: item.overview,
        image: item.poster_path
          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
          : null,
        type: item.media_type
      };
    } catch {
      return null;
    }
  };

  /* SMART ADS */
  /* MONETIZATION METHOD 1 */
  /* Replace placeholder links with real affiliate links later */

  const SMART_ADS = [
    {
      keyword: "anime",
      ad: " Sponsored: Crunchyroll Premium — Watch Anime Ad-Free"
    },
    {
      keyword: "action",
      ad: " Sponsored: Netflix Action Collection"
    },
    {
      keyword: "movie",
      ad: " Sponsored: Disney+ Featured Picks"
    },
    {
      keyword: "dark",
      ad: "Sponsored: HBO Max Thriller Collection"
    }
  ];

  const getSmartAd = (text) => {
    const t = text.toLowerCase();

    const match = SMART_ADS.find((a) =>
      t.includes(a.keyword)
    );

    return match
      ? match.ad
      : " Sponsored: Discover premium content from MediaOrbit partners";
  };

  /* SPONSORED RECOMMENDATIONS */
  /* MONETIZATION METHOD 2 */

  const SPONSORED_CONTENT = [
    "Sponsored Pick: Arcane",
    "Sponsored Pick: The Witcher",
    "Sponsored Pick: Cyberpunk Edgerunners"
  ];

  /* WATCHLIST INTELLIGENCE */
  /* MONETIZATION METHOD 3 */

  const getWatchlistInsight = () => {
    const watchlist =
      JSON.parse(localStorage.getItem("watchlist")) || [];

    if (watchlist.length < 3) {
      return "Your watchlist intelligence report is still learning your behavior.";
    }

    return `
WATCHLIST INTELLIGENCE REPORT:

- You prefer high intensity content
- You revisit action-oriented stories
- Your behavior matches binge-watch patterns
- EDITH predicts you enjoy darker narratives
`;
  };

  /* INTENT DETECTION */

  const detectIntent = (text) => {
    const t = text.toLowerCase();

    if (
      t.includes("recommend") ||
      t.includes("what should i watch") ||
      t.includes("suggest") ||
      t.includes("what fits") ||
      t.includes("matches my personality") ||
      t.includes("give me something") ||
      t.includes("watch")
    ) {
      return "recommend";
    }

    if (
      t.includes("why") ||
      t.includes("explain") ||
      t.includes("who am i") ||
      t.includes("my taste") ||
      t.includes("analyze") ||
      t.includes("analysis")
    ) {
      return "analyze";
    }

    return "chat";
  };

  /* RECOMMENDATION DATABASE */

  const ANIME_DB = [
    "Attack on Titan",
    "Jujutsu Kaisen",
    "Death Note",
    "Solo Leveling",
    "Demon Slayer",
    "Tokyo Ghoul",
    "Vinland Saga",
    "Naruto"
  ];

  const MOVIE_DB = [
    "John Wick",
    "The Batman",
    "Inception",
    "Interstellar",
    "Fight Club",
    "The Dark Knight",
    "Mad Max Fury Road",
    "Spider-Man No Way Home"
  ];

  const pickRandom = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  /* EDITH ENGINE */

  const generateResponse = async (text) => {
    const identity = getUserIdentity();
    const taste = getTasteDescription();

    const intent = detectIntent(text);

    const media = await fetchMedia(text);

    const premium = isPremiumUser();

    let responseText = "";

    /* RECOMMENDATION MODE */

    if (intent === "recommend") {
      const isAnime =
        text.toLowerCase().includes("anime");

      const pool = isAnime ? ANIME_DB : MOVIE_DB;

      const picks = [
        pickRandom(pool),
        pickRandom(pool),
        pickRandom(pool)
      ];

      /* PREMIUM MONETIZATION */
      /* MONETIZATION METHOD 4 */

      responseText = premium
        ? `EDITH PREMIUM ACTIVE

Identity: ${identity}

Advanced Taste Profile:
${taste}

Top AI Recommendations:

1. ${picks[0]}
2. ${picks[1]}
3. ${picks[2]}

${SPONSORED_CONTENT[0]}

${getWatchlistInsight()}

Premium Features Enabled:
- Deep AI profiling
- Behavioral recommendation engine
- Advanced watch prediction
- Premium recommendation ranking
`
        : `Based on your profile (${identity}):

Here are recommendations for you:

1. ${picks[0]}
2. ${picks[1]}
3. ${picks[2]}

Your taste insight:
${taste}

${SPONSORED_CONTENT[1]}

Upgrade to EDITH Premium for:
- Deep analysis
- Smarter AI recommendations
- Hidden gems engine
- Watchlist intelligence reports`;
    }

    /* ANALYSIS MODE */

    else if (intent === "analyze") {
      responseText = premium
        ? `EDITH DEEP ANALYSIS MODE

Identity:
${identity}

Taste Profile:
${taste}

${getWatchlistInsight()}

Behavior tracking active.

Your cinematic patterns indicate:
- Strategic viewing behavior
- High engagement with darker narratives
- Preference for intelligent protagonists

${SPONSORED_CONTENT[2]}
`
        : `EDITH Analysis:

Identity:
${identity}

Taste Profile:
${taste}

You are evolving based on your viewing behavior patterns.

Premium unlocks:
- Full behavior analysis
- Watch prediction engine
- Personality intelligence system`;
    }

    /* CHAT MODE */

    else {
      responseText = premium
        ? `EDITH PREMIUM ACTIVE

Try asking:
- recommend dark anime
- analyze my taste
- best psychological movies
- hidden gems
- binge recommendations

${getWatchlistInsight()}`
        : `I understand.

If you want recommendations, try:
- "recommend anime"
- "what should i watch"
- "suggest movies for me"

Premium unlocks smarter recommendations.`;
    }

    /* SMART AD INSERTION */

    responseText += `\n\n${getSmartAd(text)}`;

    return {
      text: responseText,
      media
    };
  };

  /* SEND MESSAGE */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
        media: null
      }
    ]);

    setInput("");
    setLoading(true);

    const res = await generateResponse(userText);

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: res.text,
        media: res.media
      }
    ]);

    setLoading(false);
  };

  return (
    <>
      {/* FLOATING BUTTON */}

      <div className="edith-wrapper">
        <div className="arc-reactor" onClick={toggleChat}>
          <div className="arc-ring ring1"></div>
          <div className="arc-ring ring2"></div>
          <div className="arc-ring ring3"></div>
          <div className="arc-core"></div>
        </div>

        <div className="edith-label">EDITH AI</div>

        <div className="edith-tooltip">
          Ask for recommendations
        </div>
      </div>

      {/* CHAT WINDOW */}

      {open && (
        <div className="edith-container">

          <div className="edith-header">

            <div className="edith-title-section">
              <span>EDITH - MediaOrbit AI</span>

              {!isPremiumUser() && (
                <button
                  className="premium-btn"
                  onClick={activatePremium}
                >
                  Upgrade to Premium
                </button>
              )}
            </div>

            <span
              className="close-btn"
              onClick={toggleChat}
            >
              ✕
            </span>

          </div>

          {/* PREMIUM BADGE */}

          {isPremiumUser() && (
            <div className="premium-banner">
              EDITH PREMIUM ACTIVE
            </div>
          )}

          <div
            className="edith-chatbox"
            ref={chatBoxRef}
          >
            {messages.map((m, i) => (
              <div key={i} className={m.role}>

                <div>{m.text}</div>

                {m.media?.image && (
                  <div className="media-preview">

                    <img
                      src={m.media.image}
                      alt="media"
                    />

                    <div className="media-info">
                      <h4>{m.media.title}</h4>

                      <p>{m.media.overview}</p>
                    </div>

                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="bot">
                EDITH is thinking...
              </div>
            )}
          </div>

          {/* INPUT AREA */}

          <div className="edith-input">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask EDITH anything..."
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button
              className="send-btn"
              onClick={sendMessage}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default EDITHChat;