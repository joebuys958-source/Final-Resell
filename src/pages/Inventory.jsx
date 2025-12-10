import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, "inventory"));
    const data = [];
    snap.forEach((d) => data.push({ id: d.id, ...d.data() }));

    const myItems = data.filter(
      (item) => item.userId === auth.currentUser?.uid
    );

    setItems(myItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!name || !brand || !cost || !price)
      return alert("Fill in all fields");

    await addDoc(collection(db, "inventory"), {
      name,
      brand,
      cost: Number(cost),
      price: Number(price),
      profit: Number(price) - Number(cost),
      status: "In Stock",
      userId: auth.currentUser.uid,
      createdAt: Date.now()
    });

    setName("");
    setBrand("");
    setCost("");
    setPrice("");
    fetchItems();
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
    fetchItems();
  };

  const markAsSold = async (id) => {
    await updateDoc(doc(db, "inventory", id), {
      status: "Sold"
    });
    fetchItems();
  };

  return (
    <Layout>
      <h1>Inventory</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input placeholder="Cost £" value={cost} onChange={(e) => setCost(e.target.value)} />
        <input placeholder="Sale £" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button className="btn" onClick={addItem}>Add</button>
      </div>

      <div style={{ marginTop: 30 }}>
        {items.map((item) => (
          <div key={item.id} className="glass" style={{ padding: 15, marginBottom: 12 }}>
            <b>{item.name}</b> ({item.brand}) <br />
            Cost: £{item.cost} | Sale: £{item.price} | Profit: £{item.profit} <br />
            Status: {item.status}

            <div style={{ marginTop: 10 }}>
              {item.status === "In Stock" && (
                <button style={{ marginRight: 10 }} onClick={() => markAsSold(item.id)}>
                  Mark as Sold
                </button>
              )}

              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
