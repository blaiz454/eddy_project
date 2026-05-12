import axios from "axios";

function PremiumButton() {
  const activatePremium = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post("https://eddytwiga.alwaysdata.net/api/activate_premium", {
        user_id: user?.id,
      });

      alert("Premium Activated!");
    } catch (err) {
      alert("Activation failed");
    }
  };

  return (
    <button onClick={activatePremium}>
      Activate Premium
    </button>
  );
}

export default PremiumButton;