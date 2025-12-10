import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchExpenses = async () => {
    const snap = await getDocs(collection(db, "expenses"));
    const data = [];
    snap.forEach((d) => data.push({ id: d.id, ...d.data() }));

    const myExpenses = data.filter(
      (e) => e.userId === auth.currentUser?.uid
    );

    setExpenses(myExpenses);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    if (!name || !amount) return alert("Fill in all fields");

    await addDoc(collection(db, "expenses"), {
      name,
      amount: Number(amount),
      userId: auth.currentUser.uid,
      createdAt: Date.now()
    });

    setName("");
    setAmount("");
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    fetchExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ padding: 30 }}>
      <h1>Expenses</h1>

      {/* ADD EXPENSE */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Expense name (e.g. Shipping)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Amount £"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="btn" onClick={addExpense}>
          Add Expense
        </button>
      </div>

      <h2 style={{ marginTop: 30 }}>Total: £{total.toFixed(2)}</h2>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {expenses.length === 0 && <p>No expenses yet</p>}

        {expenses.map((e) => (
          <div
            key={e.id}
            className="glass"
            style={{ padding: 15, marginBottom: 10 }}
          >
            <b>{e.name}</b> — £{e.amount}
            <button
              style={{ marginLeft: 15 }}
              onClick={() => deleteExpense(e.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
