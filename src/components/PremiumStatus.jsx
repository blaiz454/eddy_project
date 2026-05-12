import { useEffect, useState } from "react";
import axios from "axios";

function PremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `https://eddytwiga.alwaysdata.net/api/get_premium_status/${user?.id}`
        );

        setIsPremium(res.data.premium);
      } catch (err) {
        console.log("Failed to fetch premium status");
      }
    };

    fetchStatus();
  }, []);

  return (
    <div>
      {isPremium ? (
        <h3>💎 Premium User</h3>
      ) : (
        <h3>🔓 Free User</h3>
      )}
    </div>
  );
}

export default PremiumStatus;