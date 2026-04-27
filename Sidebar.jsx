import { useApp } from "../App";

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout, navigate } = useApp();

  const links = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "groups", icon: "👥", label: "Groups" },
    { id: "library", icon: "📚", label: "Library" },
    { id: "map", icon: "🗺️", label: "Interest Map" },
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">NicheConnect</div>

      {links.map(l => (
        <button key={l.id} className={`sidebar-link ${activePage === l.id ? "active" : ""}`}
          onClick={() => l.id === "profile" ? navigate("profile", user) : onNavigate(l.id)}>
          <span className="sidebar-icon">{l.icon}</span>
          {l.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />
      <div className="divider" />

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <div className="avatar avatar-sm" style={{ fontSize: 18 }}>
          {user?.avatar || user?.initials || "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.name || "User"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>{user?.city || ""}</div>
        </div>
      </div>
      <button className="sidebar-link" onClick={logout} style={{ color: "var(--red)", marginTop: 4 }}>
        <span className="sidebar-icon">🚪</span>
        Sign Out
      </button>
    </div>
  );
}
