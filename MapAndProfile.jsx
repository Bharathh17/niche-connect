import { useState } from "react";
import { useApp } from "../App";
import Sidebar from "../components/Sidebar";
import { MOCK_GROUPS } from "../data/mockData";

// ── MAP PAGE ──────────────────────────────────────────────────────────────────
export function MapPage() {
  const { navigate } = useApp();
  const [activePage, setActivePage] = useState("map");
  const [hoveredGroup, setHoveredGroup] = useState(null);

  if (activePage !== "map") {
    navigate(activePage);
    return null;
  }

  // Simulated map dots — pseudo-coordinates for demo
  const dots = [
    { group: MOCK_GROUPS[0], x: 48, y: 38, color: "var(--purple2)" },
    { group: MOCK_GROUPS[1], x: 52, y: 55, color: "var(--pink)" },
    { group: MOCK_GROUPS[2], x: 44, y: 60, color: "var(--cyan)" },
    { group: MOCK_GROUPS[3], x: 60, y: 30, color: "var(--green)" },
    { group: MOCK_GROUPS[4], x: 35, y: 70, color: "var(--amber)" },
    { group: MOCK_GROUPS[5], x: 70, y: 48, color: "var(--pink)" },
  ];

  return (
    <div className="app-layout">
      <Sidebar activePage="map" onNavigate={setActivePage} />
      <div className="main-content fade-in">
        <h1 className="page-title">Interest Map</h1>
        <p style={{ color: "var(--text2)", marginBottom: 24, marginTop: -16 }}>
          Groups near your location. Hover dots to preview.
        </p>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          {[["var(--purple2)", "Anime"], ["var(--pink)", "Movies/Shows"], ["var(--green)", "Games"], ["var(--cyan)", "Memes"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              {l}
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="map-zone" style={{ position: "relative" }}>
          {/* Grid lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
            {[20, 40, 60, 80].map(v => (
              <g key={v}>
                <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="var(--text2)" strokeWidth="1" />
                <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="var(--text2)" strokeWidth="1" />
              </g>
            ))}
          </svg>

          {/* Location label */}
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 12, color: "var(--text3)", background: "var(--bg2)", padding: "4px 10px", borderRadius: 8 }}>
            📍 Vijayawada & surroundings
          </div>

          {/* You dot */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            width: 20, height: 20, borderRadius: "50%", background: "var(--purple)",
            border: "3px solid #fff", zIndex: 10,
            boxShadow: "0 0 20px rgba(124,58,237,0.6)"
          }} title="You are here" />
          <div style={{ position: "absolute", left: "50%", top: "calc(50% + 16px)", transform: "translateX(-50%)", fontSize: 10, color: "var(--purple3)", whiteSpace: "nowrap" }}>You</div>

          {/* Radius ring */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 200, height: 200, borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            border: "1px dashed rgba(124,58,237,0.3)"
          }} />

          {/* Group dots */}
          {dots.map(({ group, x, y, color }) => (
            <div key={group.id}
              className="map-dot"
              style={{ left: `${x}%`, top: `${y}%`, background: color, zIndex: 5 }}
              onMouseEnter={() => setHoveredGroup(group)}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={() => navigate("group", group)}
            />
          ))}

          {/* Tooltip */}
          {hoveredGroup && (
            <div style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
              padding: "12px 16px", minWidth: 220, zIndex: 20
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{hoveredGroup.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{hoveredGroup.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    {hoveredGroup.memberCount}/{hoveredGroup.maxMembers} members • {hoveredGroup.distance}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>Click to open group</div>
            </div>
          )}
        </div>

        {/* Nearby list */}
        <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 14 }}>Groups Sorted by Distance</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...MOCK_GROUPS].sort((a, b) => parseInt(a.distance) - parseInt(b.distance)).map(g => (
            <div key={g.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px", background: "var(--card)", borderRadius: 12,
              border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s"
            }}
              onClick={() => navigate("group", g)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
              <span style={{ fontSize: 24 }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {g.memberCount}/{g.maxMembers} members • {g.online} online
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: 11 }}>📍 {g.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export function ProfilePage({ profileUser }) {
  const { user, navigate } = useApp();
  const [activePage, setActivePage] = useState("profile");
  const displayUser = profileUser || user;

  if (activePage !== "profile") {
    navigate(activePage);
    return null;
  }

  const isMe = displayUser?.id === user?.id || displayUser?.id?.startsWith("me_") || displayUser?.id === "demo_user";
  const userGroups = MOCK_GROUPS.slice(0, 3);

  return (
    <div className="app-layout">
      <Sidebar activePage="profile" onNavigate={setActivePage} />
      <div className="main-content fade-in" style={{ maxWidth: 800 }}>
        {/* Profile header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))",
          border: "1px solid var(--border)", borderRadius: 24, padding: 28, marginBottom: 24,
          display: "flex", gap: 24, alignItems: "flex-start"
        }}>
          <div className="avatar avatar-xl" style={{ fontSize: 40, flexShrink: 0 }}>
            {displayUser?.avatar || displayUser?.initials || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>{displayUser?.name}</h2>
              {isMe && <span className="badge badge-purple" style={{ fontSize: 11 }}>You</span>}
            </div>
            <div style={{ color: "var(--text2)", fontSize: 14, marginBottom: 8 }}>
              {displayUser?.username || `@${displayUser?.name?.toLowerCase().replace(/ /g, "")}`}
            </div>
            {displayUser?.bio && (
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                {displayUser.bio}
              </p>
            )}
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text2)", flexWrap: "wrap" }}>
              <span>📍 {displayUser?.city}</span>
              <span>🎂 Age {displayUser?.age}</span>
              <span>📅 Joined {displayUser?.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString() : "Recently"}</span>
            </div>
          </div>
          {isMe && (
            <button className="btn btn-outline btn-sm">Edit Profile</button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid-4" style={{ gap: 12, marginBottom: 24 }}>
          {[
            { n: 3, l: "Groups" },
            { n: displayUser?.interests?.length || 0, l: "Interests" },
            { n: displayUser?.badges?.length || 0, l: "Badges" },
            { n: 142, l: "Messages Sent" },
          ].map(s => (
            <div key={s.l} className="stat-box">
              <div className="stat-num" style={{ fontSize: 22 }}>{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Interests */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎯 Interests</h3>
            <div className="chips-wrap">
              {(displayUser?.interests || []).map(i => (
                <span key={i.id} className="chip selected" style={{ fontSize: 12 }}>
                  {i.emoji} {i.label}
                </span>
              ))}
              {(!displayUser?.interests?.length) && (
                <span style={{ color: "var(--text3)", fontSize: 13 }}>No interests added yet</span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🏅 Badges</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(displayUser?.badges || []).map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--bg3)", borderRadius: 10 }}>
                  <span style={{ fontSize: 20 }}>🏅</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b}</div>
                  </div>
                </div>
              ))}
              {(!displayUser?.badges?.length) && (
                <span style={{ color: "var(--text3)", fontSize: 13 }}>No badges yet — join groups to earn some!</span>
              )}
            </div>
          </div>
        </div>

        {/* Groups */}
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>👥 Active Groups</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {userGroups.map(g => (
              <div key={g.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
                cursor: "pointer"
              }} onClick={() => navigate("group", g)}>
                <span style={{ fontSize: 24 }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{g.memberCount}/{g.maxMembers} members</div>
                </div>
                {g.active && <div className="pulse-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        {isMe && (
          <div style={{ marginTop: 24, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#34d399" }}>
            🔒 Your email and exact location are never shown to other users. Only your display name, city zone, and interests are visible.
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
