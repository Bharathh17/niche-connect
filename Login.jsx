import { useState } from "react";
import { useApp } from "../App";

export default function Login() {
  const { navigate, login, showNotif } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { showNotif("Fill all fields", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login({
      id: "demo_user", name: "Demo User", username: "@demo",
      email: form.email, city: "Vijayawada", gender: "m", age: 22,
      avatar: "🦊", initials: "DU", bio: "Anime fan & gamer",
      badges: ["Newcomer", "S-Rank Otaku"],
      interests: [
        { id: "aot", label: "Attack on Titan", emoji: "⚔️", category: "anime" },
        { id: "op", label: "One Piece", emoji: "🏴‍☠️", category: "anime" },
        { id: "valorant", label: "Valorant", emoji: "🔫", category: "games" },
        { id: "jjk", label: "Jujutsu Kaisen", emoji: "🌀", category: "anime" },
      ]
    });
    setLoading(false);
  };

  return (
    <div className="onboard-wrap">
      <div className="onboard-card" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg,var(--purple2),var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            NicheConnect
          </span>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }}>Welcome back</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text3)" }}>
            New here?{" "}
            <span style={{ color: "var(--purple3)", cursor: "pointer" }} onClick={() => navigate("register")}>
              Create account
            </span>
          </span>
          <span style={{ fontSize: 12, color: "var(--text3)", cursor: "pointer" }}>Forgot password?</span>
        </div>

        <button className="btn btn-ghost" style={{ width: "100%", marginTop: 16, fontSize: 13 }}
          onClick={() => navigate("landing")}>
          ← Back to home
        </button>
      </div>
    </div>
  );
}
