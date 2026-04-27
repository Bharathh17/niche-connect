import { useApp } from "../App";

const FEATURES = [
  { icon: "🎯", title: "Interest-Based Groups", desc: "Auto-matched into small groups of 15 people who share your exact fandoms" },
  { icon: "📍", title: "Proximity Matching", desc: "Meet fans near you first — local communities, real connections" },
  { icon: "⚖️", title: "Balanced Groups", desc: "Gender-balanced, size-capped groups ensure everyone gets heard" },
  { icon: "💬", title: "Real-Time Chat", desc: "WebSocket-powered live chat with reactions, spoiler tags & meme sharing" },
  { icon: "🏆", title: "Fandom Ranks", desc: "Earn badges and ranks for your passion in each fandom" },
  { icon: "🎮", title: "Group Events", desc: "Schedule watch parties, game nights, and weekly challenges together" },
];

const FLOATERS = [
  { style: { top: "20%", left: "5%", animationDelay: "0s" }, content: "⚔️ Tokyo Ghoul Squad #3\n13/15 members • 7 online" },
  { style: { top: "15%", right: "5%", animationDelay: "-2s" }, content: "🔫 Valorant Agents #12\n14/15 members • 9 online" },
  { style: { bottom: "25%", left: "3%", animationDelay: "-4s" }, content: "🌀 Cursed Energy Crew #2\n11/15 members • 5 online" },
];

export default function Landing() {
  const { navigate } = useApp();

  return (
    <div>
      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        {FLOATERS.map((f, i) => (
          <div key={i} className="floating-card" style={f.style}>
            {f.content.split("\n").map((l, j) => (
              <div key={j} style={{ fontSize: j === 0 ? "13px" : "11px", color: j === 0 ? "var(--text)" : "var(--text2)" }}>{l}</div>
            ))}
          </div>
        ))}

        <div className="hero-content fade-in">
          <div style={{ marginBottom: 20 }}>
            <span className="badge badge-purple" style={{ fontSize: 13 }}>
              ✨ Find your people, not just followers
            </span>
          </div>
          <h1 className="hero-title">NicheConnect</h1>
          <p className="hero-sub">
            The social platform built around <strong style={{ color: "var(--purple3)" }}>shared obsessions</strong>.
            Join small, curated groups of anime fans, gamers, movie lovers and more —
            matched by your interests and your neighborhood.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>
              Find Your Tribe 🚀
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate("login")}>
              Sign In
            </button>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["12,000+ members", "500+ active groups", "50+ fandoms covered"].map(s => (
              <span key={s} style={{ fontSize: 13, color: "var(--text2)" }}>✓ {s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Why NicheConnect?
        </h2>
        <p style={{ textAlign: "center", color: "var(--text2)", marginBottom: 48, fontSize: 16 }}>
          Built different. Designed for real connection.
        </p>
        <div className="grid-3" style={{ gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Group size science */}
      <section style={{ padding: "60px 40px", background: "var(--bg2)", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          The Science of 15
        </h2>
        <p style={{ color: "var(--text2)", maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Based on <strong style={{ color: "var(--purple3)" }}>Dunbar's Number research</strong>, 
          groups of 12–15 people are scientifically proven to be the ideal size for active engagement, 
          trust, and meaningful conversation — no one gets lost, everyone gets heard.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[["15", "Max group size"], ["50km", "Proximity radius"], ["24/7", "Real-time chat"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "Syne", background: "linear-gradient(135deg,var(--purple2),var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to find your people?</h2>
        <p style={{ color: "var(--text2)", marginBottom: 32 }}>It takes 2 minutes to set up and you'll be matched instantly.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>
          Get Started — It's Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 40px", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
        © 2025 NicheConnect • Built for fans, by fans • All data encrypted & GDPR compliant
      </footer>
    </div>
  );
}
