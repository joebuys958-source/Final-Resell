import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div style={box}>
      <h1>Sign Up</h1>
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={() => navigate("/")}>Register</button>
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