import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: "100%", padding: 30 }}>
        {children}
      </div>
    </div>
  );
}
