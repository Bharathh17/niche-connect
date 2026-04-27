import { useState } from "react";
import { useApp } from "../App";
import { INTERESTS } from "../data/mockData";

const STEPS = ["Basic Info", "Interests", "Profile", "Done!"];

export default function Register() {
  const { navigate, login, showNotif } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "",
    age: "", gender: "", city: "", bio: "",
    interests: [], avatar: ""
  });
  const [selectedInterests, setSelectedInterests] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleInterest = (cat, item) => {
    const key = `${cat}_${item.id}`;
    setSelectedInterests(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = { ...item, category: cat };
      return next;
    });
  };

  const isSelected = (cat, id) => !!selectedInterests[`${cat}_${id}`];
  const totalSelected = Object.keys(selectedInterests).length;

  const next = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password || !form.age || !form.gender || !form.city) {
        showNotif("Please fill all fields", "error"); return;
      }
    }
    if (step === 1 && totalSelected < 3) {
      showNotif("Pick at least 3 interests", "error"); return;
    }
    if (step < 2) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const userData = {
      ...form,
      id: "me_" + Date.now(),
      interests: Object.values(selectedInterests),
      initials: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      badges: ["Newcomer"],
      joinedAt: new Date().toISOString(),
    };
    setStep(3);
    setTimeout(() => login(userData), 1500);
    setLoading(false);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const avatarEmojis = ["🦊", "🐉", "🦁", "🐺", "🦅", "🐯", "🦋", "🌟"];

  return (
    <div className="onboard-wrap">
      <div className="onboard-card">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,var(--purple2),var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            NicheConnect
          </span>
        </div>

        {/* Step indicators */}
        <div className="step-indicators">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i <= step ? "done" : "pending"}`} />
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{STEPS[step]}</h2>

        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 8 }}>Let's get to know you</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Full Name</label>
                <input className="input" placeholder="Arjun Kumar" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Username</label>
                <input className="input" placeholder="@arjunk" value={form.username} onChange={e => set("username", e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Password</label>
              <input className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set("password", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Age</label>
                <input className="input" type="number" placeholder="22" min="13" max="99" value={form.age} onChange={e => set("age", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Gender</label>
                <select className="input" value={form.gender} onChange={e => set("gender", e.target.value)} style={{ cursor: "pointer" }}>
                  <option value="">Select</option>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                  <option value="nb">Non-binary</option>
                  <option value="pnts">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>City</label>
                <input className="input" placeholder="Vijayawada" value={form.city} onChange={e => set("city", e.target.value)} />
              </div>
            </div>
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#34d399" }}>
              🔒 Your location is stored as a zone, never exact coordinates. All data is AES-256 encrypted.
            </div>
          </div>
        )}

        {/* Step 1 — Interests */}
        {step === 1 && (
          <div className="fade-in">
            <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16 }}>
              Pick at least 3 interests. The more you pick, the better your matches!
              <span style={{ marginLeft: 8, color: "var(--purple3)", fontWeight: 600 }}>{totalSelected} selected</span>
            </p>
            <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
              {Object.entries(INTERESTS).map(([cat, items]) => (
                <div key={cat} className="category-section">
                  <div className="category-title">
                    {cat === "anime" ? "🎌 Anime" : cat === "movies" ? "🎬 Movies" : cat === "shows" ? "📺 TV Shows" : cat === "games" ? "🎮 Games" : "😂 Memes"}
                  </div>
                  <div className="chips-wrap">
                    {items.map(item => (
                      <div key={item.id} className={`chip ${isSelected(cat, item.id) ? "selected" : ""}`}
                        onClick={() => toggleInterest(cat, item)}>
                        {item.emoji} {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Profile */}
        {step === 2 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>Almost done! Personalize your profile.</p>
            <div>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 8 }}>Pick an avatar</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {avatarEmojis.map(e => (
                  <div key={e}
                    onClick={() => set("avatar", e)}
                    style={{
                      width: 48, height: 48, borderRadius: "50%", background: "var(--bg3)",
                      border: `2px solid ${form.avatar === e ? "var(--purple)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, cursor: "pointer", transition: "all 0.2s"
                    }}>
                    {e}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Bio (optional)</label>
              <textarea className="input" placeholder="Tell your future group members something about you..." rows={3}
                value={form.bio} onChange={e => set("bio", e.target.value)}
                style={{ resize: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 8 }}>Your selected interests ({totalSelected})</label>
              <div className="chips-wrap">
                {Object.values(selectedInterests).slice(0, 8).map(i => (
                  <span key={i.id} className="badge badge-purple">{i.emoji} {i.label}</span>
                ))}
                {totalSelected > 8 && <span className="badge badge-purple">+{totalSelected - 8} more</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Done */}
        {step === 3 && (
          <div className="fade-in" style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You're in!</h3>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              Matching you with your tribes right now...
            </p>
            <div style={{ marginTop: 24 }}>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: "100%", animation: "progressLoad 1.5s ease forwards" }} />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "center" }}>
            <button className="btn btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate("landing")}>
              ← {step === 0 ? "Back to home" : "Back"}
            </button>
            <button className="btn btn-primary" onClick={next} disabled={loading}>
              {loading ? "Creating account..." : step === 2 ? "Create Account 🚀" : "Continue →"}
            </button>
          </div>
        )}

        {step === 0 && (
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text3)" }}>
            Already have an account?{" "}
            <span style={{ color: "var(--purple3)", cursor: "pointer" }} onClick={() => navigate("login")}>Sign in</span>
          </p>
        )}
      </div>
    </div>
  );
}
