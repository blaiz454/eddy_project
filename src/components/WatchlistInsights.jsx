import { useEffect, useState } from "react";
import axios from "axios";

function WatchlistInsights() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchInsights = async () => {
      try {
        const res = await axios.get(
          `https://eddytwiga.alwaysdata.net/api/watchlist_insights/${user?.id}`
        );

        setData(res.data);
      } catch (err) {
        console.log("Insights error");
      }
    };

    fetchInsights();
  }, []);

  return (
    <div>
      <h2> Watchlist Insights</h2>

      {data && (
        <>
          <p>Total: {data.watchlist_total}</p>
          <p>{data.insight}</p>
        </>
      )}
    </div>
  );
}

export default WatchlistInsights;