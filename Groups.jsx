import { useState } from "react";
import { useApp } from "../App";
import Sidebar from "../components/Sidebar";
import GroupCard from "../components/GroupCard";
import { MOCK_GROUPS } from "../data/mockData";

const CATEGORIES = ["all", "anime", "movies", "shows", "games", "memes"];
const SORT_OPTIONS = [
  { v: "distance", l: "Nearest First" },
  { v: "activity", l: "Most Active" },
  { v: "size", l: "Most Members" },
  { v: "available", l: "Has Space" },
];

export default function Groups() {
  const { navigate } = useApp();
  const [activePage, setActivePage] = useState("groups");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("distance");
  const [search, setSearch] = useState("");

  if (activePage !== "groups") {
    navigate(activePage);
    return null;
  }

  let filtered = MOCK_GROUPS;
  if (category !== "all") filtered = filtered.filter(g => g.category === category);
  if (search) filtered = filtered.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "distance") filtered = [...filtered].sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
  if (sort === "activity") filtered = [...filtered].sort((a, b) => b.online - a.online);
  if (sort === "size") filtered = [...filtered].sort((a, b) => b.memberCount - a.memberCount);
  if (sort === "available") filtered = [...filtered].filter(g => g.memberCount < g.maxMembers);

  return (
    <div className="app-layout">
      <Sidebar activePage="groups" onNavigate={setActivePage} />
      <div className="main-content fade-in">
        <h1 className="page-title">Browse Groups</h1>

        {/* Search + sort */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input className="input" placeholder="🔍 Search groups..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 160, cursor: "pointer" }}>
            {SORT_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`chip ${category === c ? "selected" : ""}`} onClick={() => setCategory(c)}
              style={{ textTransform: "capitalize" }}>
              {c === "anime" ? "🎌" : c === "movies" ? "🎬" : c === "shows" ? "📺" : c === "games" ? "🎮" : c === "memes" ? "😂" : "✨"} {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
          {filtered.length} group{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Groups grid */}
        {filtered.length > 0 ? (
          <div className="grid-3" style={{ gap: 16 }}>
            {filtered.map(g => (
              <GroupCard key={g.id} group={g} onClick={() => navigate("group", g)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <h3>No groups found</h3>
            <p style={{ marginTop: 8, fontSize: 14 }}>Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
