import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    active: 0,
    sold: 0,
    revenue: 0,
    cost: 0,
    expenses: 0,
    profit: 0,
  });

  const [goals, setGoals] = useState([]);
  const [demo, setDemo] = useState(false);
  const [aiTips, setAiTips] = useState([]);

  useEffect(() => {
    fetchAll();
    fetchGoals();
  }, []);

  const fetchAll = async () => {
    const invSnap = await getDocs(collection(db, "inventory"));
    const expSnap = await getDocs(collection(db, "expenses"));

    let active = 0;
    let sold = 0;
    let revenue = 0;
    let cost = 0;
    let expenses = 0;

    invSnap.forEach((d) => {
      const i = d.data();
      if (i.userId !== auth.currentUser?.uid) return;

      if (i.status === "In Stock") active++;
      if (i.status === "Sold") {
        sold++;
        revenue += Number(i.price);
        cost += Number(i.cost);
      }
    });

    expSnap.forEach((d) => {
      const e = d.data();
      if (e.userId === auth.currentUser?.uid)
        expenses += Number(e.amount);
    });

    const profit = revenue - cost - expenses;

    if (active === 0 && sold === 0 && expenses === 0) {
      setDemo(true);
      setStats({
        active: 12,
        sold: 8,
        revenue: 840,
        cost: 420,
        expenses: 55,
        profit: 365,
      });
      return;
    }

    setDemo(false);
    setStats({ active, sold, revenue, cost, expenses, profit });
    generateAiTips(profit, active, sold);
  };

  const fetchGoals = async () => {
    const snap = await getDocs(collection(db, "goals"));
    const data = [];

    snap.forEach((d) => {
      const g = d.data();
      if (g.userId === auth.currentUser?.uid)
        data.push({ id: d.id, ...g });
    });

    setGoals(data);
  };

  const generateAiTips = (profit, active, sold) => {
    const tips = [];

    if (profit < 100) tips.push("💡 Try increasing sale prices by 5–10%.");
    if (active > sold * 3)
      tips.push("⚠️ You have slow-moving stock. Review pricing.");
    if (sold > active)
      tips.push("🚀 Your sales velocity is strong. Scale listings.");

    setAiTips(tips);
  };

  return (
    <Layout>
      <h1>Dashboard</h1>

      {/* KPI STRIP */}
      <div style={grid}>
        <Card title="Active Listings" value={stats.active} />
        <Card title="Sold Orders" value={stats.sold} />
        <Card title="Revenue" value={`£${stats.revenue}`} />
        <Card title="Costs" value={`£${stats.cost}`} />
        <Card title="Expenses" value={`£${stats.expenses}`} />
        <Card title="Net Profit" value={`£${stats.profit}`} />
      </div>

      {/* PERFORMANCE + GOALS + AI */}
      <div style={{ ...grid, marginTop: 30 }}>
        <GlassBox title="Goal Progress">
          {goals.length === 0 && (
            <p>No goals yet. Add one in Goals.</p>
          )}
          {goals.map((g) => {
            const pct =
              stats.profit > 0
                ? Math.min(
                    100,
                    Math.round((stats.profit / g.target) * 100)
                  )
                : 0;

            return (
              <div key={g.id} style={{ marginBottom: 10 }}>
                <b>{g.title}</b>
                <div style={barBg}>
                  <div style={{ ...barFill, width: `${pct}%` }} />
                </div>
                <small>{pct}% complete</small>
              </div>
            );
          })}
        </GlassBox>

        <GlassBox title="AI Recommendations">
          {aiTips.length === 0 && <p>No alerts right now ✅</p>}
          {aiTips.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </GlassBox>

        <GlassBox title="System Status">
          {demo ? (
            <p>👁️ Demo mode active for new users</p>
          ) : (
            <p>✅ Live business tracking active</p>
          )}
        </GlassBox>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ ...grid, marginTop: 30 }}>
        <GlassBox title="Quick Actions">
          <button className="btn" style={mb}>Add Item</button>
          <button className="btn" style={mb}>Add Expense</button>
          <button className="btn">New Goal</button>
        </GlassBox>

        <GlassBox title="Performance Summary">
          <p>Margin: {stats.revenue ? Math.round((stats.profit / stats.revenue) * 100) : 0}%</p>
          <p>Stock Turnover Ratio: {stats.sold || 0}</p>
          <p>Expense Ratio: {stats.expenses || 0}</p>
        </GlassBox>
      </div>
    </Layout>
  );
}

/* ----------------- UI HELPERS ------------------ */

function Card({ title, value }) {
  return (
    <div className="glass" style={{ padding: 20 }}>
      <small>{title}</small>
      <h2>{value}</h2>
    </div>
  );
}

function GlassBox({ title, children }) {
  return (
    <div className="glass" style={{ padding: 20 }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const grid = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};

const barBg = {
  width: "100%",
  height: 8,
  background: "#222",
  borderRadius: 10,
  margin: "6px 0",
};

const barFill = {
  height: "100%",
  background: "#00ffff",
  borderRadius: 10,
};

const mb = { marginBottom: 10 };
