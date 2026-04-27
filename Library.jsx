import { useState } from "react";
import { useApp } from "../App";
import Sidebar from "../components/Sidebar";
import { CONTENT_LIBRARY, MOCK_GROUPS } from "../data/mockData";

const CATS = [
  { key: "anime", label: "🎌 Anime", color: "badge-purple" },
  { key: "movies", label: "🎬 Movies", color: "badge-amber" },
  { key: "games", label: "🎮 Games", color: "badge-green" },
  { key: "shows", label: "📺 TV Shows", color: "badge-cyan" },
];

export default function Library() {
  const { navigate } = useApp();
  const [activePage, setActivePage] = useState("library");
  const [cat, setCat] = useState("anime");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");

  if (activePage !== "library") {
    navigate(activePage);
    return null;
  }

  const items = CONTENT_LIBRARY[cat] || [];
  let filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.genre?.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - (a.rating || a.metacritic / 10));
  if (sort === "year") filtered = [...filtered].sort((a, b) => b.year - a.year);
  if (sort === "az") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  const getRelatedGroups = (item) =>
    MOCK_GROUPS.filter(g => g.category === cat).slice(0, 2);

  return (
    <div className="app-layout">
      <Sidebar activePage="library" onNavigate={setActivePage} />
      <div className="main-content fade-in">
        <h1 className="page-title">Content Library</h1>
        <p style={{ color: "var(--text2)", marginBottom: 24, marginTop: -16 }}>
          Browse and discover anime, movies, games & shows. Click any item to find groups.
        </p>

        {/* Category tabs */}
        <div className="tabs">
          {CATS.map(c => (
            <button key={c.key} className={`tab ${cat === c.key ? "active" : ""}`} onClick={() => setCat(c.key)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <input className="input" placeholder="🔍 Search..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 140, cursor: "pointer" }}>
            <option value="rating">Top Rated</option>
            <option value="year">Newest First</option>
            <option value="az">A–Z</option>
          </select>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {filtered.map(item => (
            <LibraryCard key={item.id} item={item} cat={cat} relatedGroups={getRelatedGroups(item)} onGroupClick={(g) => navigate("group", g)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LibraryCard({ item, cat, relatedGroups, onGroupClick }) {
  const [expanded, setExpanded] = useState(false);
  const score = item.rating || (item.metacritic / 10);
  const scoreColor = score >= 8 ? "var(--green)" : score >= 6 ? "var(--amber)" : "var(--red)";

  return (
    <div className="card" style={{ cursor: "pointer", transition: "all 0.2s" }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 60, height: 60, borderRadius: 12, background: "var(--bg3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, flexShrink: 0
        }}>
          {item.img}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>{item.genre}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>
              ⭐ {score?.toFixed(1)}
            </span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              {item.year} •{" "}
              {cat === "anime" ? `${item.episodes} eps` :
               cat === "shows" ? `${item.seasons} seasons` :
               cat === "games" ? item.platform :
               item.director || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Status badge */}
      {item.status && (
        <div style={{ marginTop: 10 }}>
          <span className={`badge ${item.status === "Ongoing" ? "badge-green" : item.status === "Completed" ? "badge-cyan" : "badge-amber"}`} style={{ fontSize: 10 }}>
            {item.status}
          </span>
        </div>
      )}

      {/* Expanded — related groups */}
      {expanded && relatedGroups.length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>Active groups:</div>
          {relatedGroups.map(g => (
            <div key={g.id}
              onClick={e => { e.stopPropagation(); onGroupClick(g); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                background: "var(--bg3)", borderRadius: 8, marginBottom: 6, cursor: "pointer",
                border: "1px solid var(--border)", transition: "border-color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <span style={{ fontSize: 16 }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{g.memberCount}/{g.maxMembers} members</div>
              </div>
              <span style={{ fontSize: 11, color: "var(--purple3)" }}>Join →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
