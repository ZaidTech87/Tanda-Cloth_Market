import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // ✅ ADD

export default function ResetPassword() {

  const location = useLocation(); // ✅ ADD
  const mobileFromState = location.state?.mobile || "";

  const [mobile, setMobile] = useState(mobileFromState);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    await axios.post("http://localhost:8080/api/auth/reset-password", {
      mobile,
      otp,
      newPassword: password,
    });
    alert("Password updated");
  };

  return (
    <div>
      {/* ✅ Mobile auto-filled */}
      <input
        value={mobile}
        onChange={(e)=>setMobile(e.target.value)}
        placeholder="Mobile"
      />

      <input
        placeholder="OTP"
        onChange={(e)=>setOtp(e.target.value)}
      />

      <input
        placeholder="New Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
}