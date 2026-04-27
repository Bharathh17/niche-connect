export default function GroupCard({ group, onClick, compact }) {
  const fillPct = (group.memberCount / group.maxMembers) * 100;
  const isFull = group.memberCount >= group.maxMembers;

  const bannerColors = {
    anime: "linear-gradient(135deg, #1a0533, #2d1b69)",
    movies: "linear-gradient(135deg, #1a0a00, #5c2a00)",
    shows: "linear-gradient(135deg, #001a33, #005c99)",
    games: "linear-gradient(135deg, #0a1a00, #1a4d00)",
    memes: "linear-gradient(135deg, #1a001a, #4d004d)",
  };

  return (
    <div className="group-card" onClick={onClick}>
      <div className="group-card-banner" style={{ background: bannerColors[group.category] || bannerColors.anime }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: compact ? 36 : 48, opacity: 0.8
        }}>
          {group.emoji}
        </div>
        {group.active && (
          <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.6)", borderRadius: 12, padding: "3px 8px" }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 11, color: "#fff" }}>{group.online} online</span>
          </div>
        )}
        {isFull && (
          <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(239,68,68,0.8)", borderRadius: 8, padding: "2px 8px", fontSize: 11, color: "#fff" }}>
            FULL
          </div>
        )}
      </div>

      <div className="group-card-body">
        <div className="group-card-title">{group.name}</div>
        {!compact && (
          <div style={{ fontSize: 12, color: "var(--text2)", margin: "4px 0 8px", lineHeight: 1.5 }}>
            {group.description?.slice(0, 80)}...
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>
            <span>{group.memberCount}/{group.maxMembers} members</span>
            <span>{group.distance}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${fillPct}%`, background: isFull ? "var(--red)" : undefined }} />
          </div>
        </div>

        {/* Gender ratio */}
        <div style={{ marginBottom: 8 }}>
          <div className="gender-bar">
            <div className="gender-bar-m" style={{ flex: group.maleRatio }} />
            <div className="gender-bar-f" style={{ flex: group.femaleRatio }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
            <span style={{ color: "var(--cyan)" }}>♂ {Math.round(group.maleRatio * 100)}%</span>
            <span style={{ color: "var(--pink)" }}>♀ {Math.round(group.femaleRatio * 100)}%</span>
          </div>
        </div>

        <div className="group-card-meta">
          <span className={`badge ${group.category === "anime" ? "badge-purple" : group.category === "games" ? "badge-green" : group.category === "movies" ? "badge-amber" : "badge-cyan"}`} style={{ fontSize: 10 }}>
            {group.category}
          </span>
          <span>📍 {group.location}</span>
        </div>
      </div>
    </div>
  );
}
