import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 30 }}>
        <div className="glass" style={{ padding: 20 }}>
          Revenue
          <h2>£0.00</h2>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          Profit
          <h2>£0.00</h2>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          Inventory
          <h2>0 Items</h2>
        </div>
      </div>
    </Layout>
  );
}
