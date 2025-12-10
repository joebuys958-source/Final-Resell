import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

export default function Analytics() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  const fetchData = async () => {
    // INVENTORY
    const invSnap = await getDocs(collection(db, "inventory"));
    let revenue = 0;
    let cost = 0;

    invSnap.forEach((d) => {
      const data = d.data();
      if (data.userId === auth.currentUser?.uid && data.status === "Sold") {
        revenue += Number(data.price);
        cost += Number(data.cost);
      }
    });

    // EXPENSES
    const expSnap = await getDocs(collection(db, "expenses"));
    let expenses = 0;

    expSnap.forEach((d) => {
      const data = d.data();
      if (data.userId === auth.currentUser?.uid) {
        expenses += Number(data.amount);
      }
    });

    setTotalRevenue(revenue);
    setTotalCost(cost);
    setTotalExpenses(expenses);
    setNetProfit(revenue - cost - expenses);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <h1>Analytics</h1>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginTop: 30
        }}
      >
        <div className="glass" style={{ padding: 20 }}>
          <h3>Total Revenue</h3>
          <h2>£{totalRevenue.toFixed(2)}</h2>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <h3>Total Cost</h3>
          <h2>£{totalCost.toFixed(2)}</h2>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <h3>Total Expenses</h3>
          <h2>£{totalExpenses.toFixed(2)}</h2>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <h3>Net Profit</h3>
          <h2>£{netProfit.toFixed(2)}</h2>
        </div>
      </div>
    </Layout>
  );
}
