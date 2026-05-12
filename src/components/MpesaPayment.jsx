import { useState } from "react";
import axios from "axios";

function MpesaPayment() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const pay = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("amount", amount);
      formData.append("user_id", user?.id);

      const res = await axios.post(
        "https://eddytwiga.alwaysdata.net/api/mpesa_payment",
        formData
      );

      alert(res.data.message);
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div>
      <h2>MPESA Payment</h2>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={pay}>Pay</button>
    </div>
  );
}

export default MpesaPayment;