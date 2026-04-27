import { useState } from "react";
import { useApp } from "../App";
import Sidebar from "../components/Sidebar";
import GroupCard from "../components/GroupCard";
import { MOCK_GROUPS } from "../data/mockData";

export default function Home() {
  const { user, navigate } = useApp();
  const [activePage, setActivePage] = useState("home");

  if (activePage !== "home") {
    navigate(activePage);
    return null;
  }

  const userInterestIds = (user?.interests || []).map(i => i.id);
  const myGroups = MOCK_GROUPS.filter(g => userInterestIds.includes(g.interest)).slice(0, 4);
  const nearbyGroups = [...MOCK_GROUPS].sort((a, b) => parseInt(a.distance) - parseInt(b.distance)).slice(0, 3);
  const trendingGroups = MOCK_GROUPS.filter(g => g.active).slice(0, 3);

  const weeklyChallenge = {
    icon: "🏆",
    title: "This Week's Challenge",
    desc: myGroups[0] ? `"${myGroups[0].challenge}"` : "Check back soon for a new challenge!",
    group: myGroups[0]?.name
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="home" onNavigate={setActivePage} />
      <div className="main-content fade-in">
        {/* Welcome banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.15))",
          border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20,
          padding: "24px 28px", marginBottom: 28,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              Hey {user?.name?.split(" ")[0]} {user?.avatar || "👋"}
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              You're in <strong style={{ color: "var(--purple3)" }}>{myGroups.length} groups</strong> • {" "}
              <strong style={{ color: "var(--green)" }}>{myGroups.reduce((a, g) => a + g.online, 0)} people</strong> online now
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePage("groups")}>Browse Groups</button>
            <button className="btn btn-outline btn-sm" onClick={() => setActivePage("library")}>Library 📚</button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid-4" style={{ marginBottom: 28, gap: 12 }}>
          {[
            { n: myGroups.length, l: "My Groups", c: "var(--purple2)" },
            { n: user?.interests?.length || 0, l: "Interests", c: "var(--pink)" },
            { n: user?.badges?.length || 0, l: "Badges", c: "var(--amber)" },
            { n: myGroups.reduce((a, g) => a + g.online, 0), l: "Friends Online", c: "var(--green)" },
          ].map(s => (
            <div key={s.l} className="stat-box">
              <div className="stat-num" style={{ color: s.c }}>{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Weekly challenge */}
        <div className="challenge-card" style={{ marginBottom: 28 }}>
          <div className="challenge-icon">{weeklyChallenge.icon}</div>
          <div className="challenge-title">{weeklyChallenge.title}</div>
          <div className="challenge-desc">{weeklyChallenge.desc}</div>
          {weeklyChallenge.group && (
            <div style={{ marginTop: 12 }}>
              <span className="badge badge-purple">📍 {weeklyChallenge.group}</span>
            </div>
          )}
        </div>

        {/* My Groups */}
        {myGroups.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Groups</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActivePage("groups")}>View all →</button>
            </div>
            <div className="grid-2">
              {myGroups.map(g => <GroupCard key={g.id} group={g} onClick={() => navigate("group", g)} />)}
            </div>
          </section>
        )}

        {/* Nearby groups */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>📍 Near You</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePage("map")}>View map →</button>
          </div>
          <div className="grid-3">
            {nearbyGroups.map(g => <GroupCard key={g.id} group={g} onClick={() => navigate("group", g)} compact />)}
          </div>
        </section>

        {/* Trending */}
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔥 Trending This Week</h3>
          <div className="grid-3">
            {trendingGroups.map(g => <GroupCard key={g.id} group={g} onClick={() => navigate("group", g)} compact />)}
          </div>
        </section>

        {/* Your interests */}
        <section>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Your Interests</h3>
          <div className="chips-wrap">
            {(user?.interests || []).map(i => (
              <span key={i.id} className="chip selected">{i.emoji} {i.label}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
