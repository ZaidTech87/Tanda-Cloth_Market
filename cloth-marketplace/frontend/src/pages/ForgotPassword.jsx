import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ADD

export default function ForgotPassword() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate(); // ✅ ADD

  const sendOtp = async () => {
    await axios.post("http://localhost:8080/api/auth/forgot-password", {
      mobile,
    });

    alert("OTP sent (check backend console)");

    // ✅ IMPORTANT FIX
    navigate("/reset-password", { state: { mobile } });
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        placeholder="Enter mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
}