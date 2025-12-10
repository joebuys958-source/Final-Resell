import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    console.log("Login clicked"); // DEBUG
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", res.user);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div style={box}>
      <h1>Login</h1>

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

      <button type="button" className="btn" onClick={login}>
        Login
      </button>

      <p onClick={() => nav("/signup")}>Create Account</p>
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
