import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={box}>
      <h1>Login</h1>
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={() => navigate("/dashboard")}>Login</button>
      <p onClick={() => navigate("/signup")}>Create Account</p>
    </div>
  );
}

const box = {
  maxWidth: "300px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};