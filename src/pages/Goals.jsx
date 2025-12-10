import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState("profit");
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    const snap = await getDocs(collection(db, "goals"));
    const data = [];

    snap.forEach((d) => data.push({ id: d.id, ...d.data() }));

    const myGoals = data.filter(
      (g) => g.userId === auth.currentUser?.uid
    );

    setGoals(myGoals);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async () => {
    if (!title || !target) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "goals"), {
        title,
        target: Number(target),
        type,
        userId: auth.currentUser.uid,
        createdAt: Date.now(),
        progress: 0
      });

      setTitle("");
      setTarget("");
      setType("profit");

      fetchGoals();
    } catch (err) {
      console.error("Failed to add goal:", err);
      alert("Goal failed to save. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>Goals</h1>

      <div style={{ maxWidth: 400, display: "grid", gap: 10 }}>
        <input
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Target amount"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="profit">Profit</option>
          <option value="sales">Sales</option>
          <option value="reviews">Reviews</option>
        </select>

        <button className="btn" onClick={addGoal} disabled={loading}>
          {loading ? "Saving..." : "Add Goal"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        {goals.map((g) => (
          <div
            key={g.id}
            className="glass"
            style={{ padding: 15, marginBottom: 10 }}
          >
            <b>{g.title}</b><br />
            Target: {g.target} ({g.type})<br />
            Progress: {g.progress}
          </div>
        ))}
      </div>
    </Layout>
  );
}
