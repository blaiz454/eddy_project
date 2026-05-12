import axios from "axios";

export const trackAdClick = async (adName) => {
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    await axios.post("https://eddytwiga.alwaysdata.net/api/save_ad_click", {
      user_id: user?.id,
      ad_name: adName,
    });
  } catch (err) {
    console.log("Ad tracking failed");
  }
};