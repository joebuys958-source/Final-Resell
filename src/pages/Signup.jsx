import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const register = async () => {
    console.log("Register clicked"); // DEBUG
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered:", res.user);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div style={box}>
      <h1>Sign Up</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="button" className="btn" onClick={register}>
        Register
      </button>
    </div>
  );
}

const box = {
  maxWidth: "320px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
