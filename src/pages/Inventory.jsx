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
import vintedGroups from "../data/vintedGroups.json";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");

  const [gender, setGender] = useState("");
  const [mainCat, setMainCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [finalCat, setFinalCat] = useState("");

  const conditionOptions = [
    "New with tags",
    "New without tags",
    "Very good",
    "Good",
    "Satisfactory"
  ];

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

  const genderOptions = Object.keys(vintedGroups);

  const mainOptions =
    gender && vintedGroups[gender]
      ? Object.entries(vintedGroups[gender].children)
      : [];

  const subOptions =
    mainCat && vintedGroups[gender]?.children[mainCat]
      ? Object.entries(
          vintedGroups[gender].children[mainCat].children
        )
      : [];

  const finalOptions =
    subCat &&
    vintedGroups[gender]?.children[mainCat]?.children[subCat]
      ? Object.entries(
          vintedGroups[gender].children[mainCat].children[subCat].children
        )
      : [];

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBrand("");
    setCost("");
    setPrice("");
    setSize("");
    setCondition("");
    setGender("");
    setMainCat("");
    setSubCat("");
    setFinalCat("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setBrand(item.brand);
    setCost(item.cost);
    setPrice(item.price);
    setSize(item.size);
    setCondition(item.condition);
    setGender(item.gender?.name || "");
    setMainCat(item.mainCategory?.name || "");
    setSubCat(item.subCategory?.name || "");
    setFinalCat(item.finalCategory?.name || "");
  };

  const saveItem = async () => {
    if (
      !name || !brand || !cost || !price ||
      !size || !condition ||
      !gender || !mainCat || !subCat || !finalCat
    ) return alert("Fill in all fields");

    const main = vintedGroups[gender].children[mainCat];
    const sub = main.children[subCat];
    const final = sub.children[finalCat];

    if (editingId) {
      await updateDoc(doc(db, "inventory", editingId), {
        name,
        brand,
        cost: Number(cost),
        price: Number(price),
        profit: Number(price) - Number(cost),
        size,
        condition,
        gender: { name: gender, id: vintedGroups[gender].id, slug: vintedGroups[gender].slug },
        mainCategory: { name: mainCat, id: main.id, slug: main.slug },
        subCategory: { name: subCat, id: sub.id, slug: sub.slug },
        finalCategory: { name: finalCat, id: final.id, slug: final.slug }
      });
    } else {
      await addDoc(collection(db, "inventory"), {
        name,
        brand,
        cost: Number(cost),
        price: Number(price),
        profit: Number(price) - Number(cost),
        status: "In Stock",
        size,
        condition,
        userId: auth.currentUser.uid,
        createdAt: Date.now(),
        gender: { name: gender, id: vintedGroups[gender].id, slug: vintedGroups[gender].slug },
        mainCategory: { name: mainCat, id: main.id, slug: main.slug },
        subCategory: { name: subCat, id: sub.id, slug: sub.slug },
        finalCategory: { name: finalCat, id: final.id, slug: final.slug }
      });
    }

    resetForm();
    fetchItems();
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
    fetchItems();
  };

  const markAsSold = async (id) => {
    await updateDoc(doc(db, "inventory", id), { status: "Sold" });
    fetchItems();
  };

  return (
    <Layout>
      <h1>{editingId ? "Edit Item" : "Add Item"}</h1>

      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input placeholder="Title" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input placeholder="Cost £" value={cost} onChange={(e) => setCost(e.target.value)} />
        <input placeholder="Sale £" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} />

        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Condition</option>
          {conditionOptions.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={gender} onChange={(e) => { setGender(e.target.value); setMainCat(""); }}>
          <option value="">Gender</option>
          {genderOptions.map(g => <option key={g}>{g}</option>)}
        </select>

        <select value={mainCat} onChange={(e) => { setMainCat(e.target.value); setSubCat(""); }} disabled={!gender}>
          <option value="">Category</option>
          {mainOptions.map(([n]) => <option key={n}>{n}</option>)}
        </select>

        <select value={subCat} onChange={(e) => { setSubCat(e.target.value); setFinalCat(""); }} disabled={!mainCat}>
          <option value="">Sub Category</option>
          {subOptions.map(([n]) => <option key={n}>{n}</option>)}
        </select>

        <select value={finalCat} onChange={(e) => setFinalCat(e.target.value)} disabled={!subCat}>
          <option value="">Final Category</option>
          {finalOptions.map(([n]) => <option key={n}>{n}</option>)}
        </select>

        <button className="btn" onClick={saveItem}>
          {editingId ? "Save Changes" : "Add Item"}
        </button>

        {editingId && (
          <button onClick={resetForm}>Cancel Edit</button>
        )}
      </div>

      <div style={{ marginTop: 40 }}>
        {items.map((item) => (
          <div key={item.id} className="glass" style={{ padding: 15, marginBottom: 12 }}>
            <b>{item.name}</b> ({item.brand})<br />
            Size: {item.size} | {item.condition}<br />
            Cost £{item.cost} | Sale £{item.price} | Profit £{item.profit}<br />
            Status: {item.status}

            <div style={{ marginTop: 8 }}>
              <button onClick={() => startEdit(item)}>Edit</button>

              {item.status === "In Stock" && (
                <button onClick={() => markAsSold(item.id)} style={{ marginLeft: 8 }}>
                  Sold
                </button>
              )}

              <button onClick={() => deleteItem(item.id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
