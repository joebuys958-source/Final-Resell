import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics"; // ✅ ADDED

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/inventory"
          element={user ? <Inventory /> : <Navigate to="/" />}
        />

        <Route
          path="/expenses"
          element={user ? <Expenses /> : <Navigate to="/" />}
        />

        {/* ✅ ANALYTICS */}
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
