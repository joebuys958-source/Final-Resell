import {
  FaHome,
  FaBox,
  FaChartBar,
  FaMoneyBill,
  FaBullseye,
  FaCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  return (
    <div style={styles.sidebar} className="glass">
      <h2 style={styles.logo}>Resell</h2>

      <div style={styles.link} onClick={() => nav("/dashboard")}>
        <FaHome /> Dashboard
      </div>

      <div style={styles.link} onClick={() => nav("/inventory")}>
        <FaBox /> Inventory
      </div>

      <div style={styles.link} onClick={() => nav("/expenses")}>
        <FaMoneyBill /> Expenses
      </div>

      {/* ✅ NEW GOALS LINK */}
      <div style={styles.link} onClick={() => nav("/goals")}>
        <FaBullseye /> Goals
      </div>

      <div style={styles.link} onClick={() => nav("/analytics")}>
        <FaChartBar /> Analytics
      </div>

      <div style={styles.link}>
        <FaCog /> Settings
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 220,
    height: "100vh",
    padding: 20,
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  logo: {
    color: "#00ffff",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    cursor: "pointer",
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 8,
  },
};
