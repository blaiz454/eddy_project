import axios from "axios";

export const trackSponsoredClick = async (contentName) => {
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    await axios.post("https://eddytwiga.alwaysdata.net/api/save_sponsored_click", {
      user_id: user?.id,
      content_name: contentName,
    });
  } catch (err) {
    console.log("Sponsored tracking failed");
  }
};