import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={styles.main}>
        <h1>Dashboard</h1>

        <div style={styles.grid}>
          <div className="glass" style={styles.card}>
            Revenue
            <h2>£0.00</h2>
          </div>

          <div className="glass" style={styles.card}>
            Profit
            <h2>£0.00</h2>
          </div>

          <div className="glass" style={styles.card}>
            Inventory
            <h2>0 Items</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  main: {
    marginLeft: 220,
    padding: 30,
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginTop: 30,
  },
  card: {
    padding: 20,
  },
};
