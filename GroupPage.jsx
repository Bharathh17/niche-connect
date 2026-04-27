import { useState, useRef, useEffect } from "react";
import { useApp } from "../App";
import { ICE_BREAKERS } from "../data/mockData";

const EMOJI_REACTIONS = ["🔥", "😭", "💀", "😂", "🤯", "❤️", "👏", "🏆"];

export default function GroupPage({ group }) {
  const { user, navigate, showNotif } = useApp();
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState(group?.messages || []);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [poll, setPoll] = useState(group?.polls?.[0] || null);
  const [votedPoll, setVotedPoll] = useState(null);
  const [rsvps, setRsvps] = useState({});
  const [memeInput, setMemeInput] = useState("");
  const [memes, setMemes] = useState(group?.memes || []);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const responses = [
      "That's such a good point! 🔥", "EXACTLY what I was thinking omg",
      "No way, you're so wrong lmao 😂", "This is the best group fr fr",
      "okay but hear me out...", "I literally just rewatched this yesterday",
    ];
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && tab === "chat") {
        const member = group.members[Math.floor(Math.random() * group.members.length)];
        if (!member) return;
        const newMsg = {
          id: "auto_" + Date.now(),
          user: member.name, uid: member.id, initials: member.initials,
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          reactions: {}
        };
        setMessages(prev => [...prev, newMsg]);
        setTyping(false);
      } else if (Math.random() < 0.2 && tab === "chat") {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [tab, group.members]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: "my_" + Date.now(),
      user: user.name, uid: "me", initials: user.initials || "ME",
      text: input, isMe: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: {}
    };
    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  const addReaction = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const r = { ...m.reactions };
      r[emoji] = (r[emoji] || 0) + 1;
      return { ...m, reactions: r };
    }));
  };

  const votePoll = (optIdx) => {
    if (votedPoll !== null) return;
    setVotedPoll(optIdx);
    setPoll(p => ({
      ...p,
      opts: p.opts.map((o, i) => i === optIdx ? { ...o, v: o.v + 1 } : o)
    }));
  };

  const totalVotes = poll ? poll.opts.reduce((a, o) => a + o.v, 0) : 0;

  if (!group) return <div style={{ padding: 40 }}>Group not found.</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Main area */}
      <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)" }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 14, background: "var(--bg2)",
          position: "sticky", top: 0, zIndex: 10
        }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("home")}>← Back</button>
          <div style={{ fontSize: 28 }}>{group.emoji}</div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{group.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {group.memberCount}/{group.maxMembers} members • {group.online} online • 📍 {group.location}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span className="badge badge-purple" style={{ fontSize: 11 }}>📌 {group.topicOfWeek?.slice(0, 40)}...</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ padding: "0 20px", margin: 0 }}>
          {["chat", "polls", "memes", "events"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "chat" ? "💬 Chat" : t === "polls" ? "📊 Polls" : t === "memes" ? "😂 Memes" : "🗓️ Events"}
            </button>
          ))}
        </div>

        {/* Chat tab */}
        {tab === "chat" && (
          <div className="chat-wrap">
            <div className="chat-messages">
              {/* Ice breaker */}
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <span style={{ background: "var(--bg3)", borderRadius: 12, padding: "6px 16px", fontSize: 12, color: "var(--text2)" }}>
                  🎲 {ICE_BREAKERS[0]}
                </span>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={`chat-msg ${msg.isMe ? "mine" : ""}`}>
                  {!msg.isMe && (
                    <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: 12 }}>
                      {msg.initials}
                    </div>
                  )}
                  <div>
                    {!msg.isMe && (
                      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{msg.user}</div>
                    )}
                    <div className={`chat-bubble ${msg.isMe ? "mine" : "theirs"}`}>
                      {msg.isSpoiler ? (
                        <SpoilerText text={msg.text} />
                      ) : msg.text}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: msg.isMe ? "flex-end" : "flex-start" }}>
                      <span className="chat-msg-meta">{msg.time}</span>
                    </div>
                    {/* Reactions */}
                    {Object.keys(msg.reactions || {}).length > 0 && (
                      <div className="reaction-bar" style={{ justifyContent: msg.isMe ? "flex-end" : "flex-start" }}>
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <button key={emoji} className="reaction-btn" onClick={() => addReaction(msg.id, emoji)}>
                            {emoji} {count}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Add reaction */}
                    <div style={{ display: "flex", gap: 2, marginTop: 3, justifyContent: msg.isMe ? "flex-end" : "flex-start" }}>
                      {EMOJI_REACTIONS.slice(0, 4).map(e => (
                        <button key={e} onClick={() => addReaction(msg.id, e)}
                          style={{ background: "none", border: "none", fontSize: 12, cursor: "pointer", opacity: 0.4, transition: "opacity 0.2s", padding: "0 2px" }}
                          onMouseEnter={ev => ev.target.style.opacity = 1}
                          onMouseLeave={ev => ev.target.style.opacity = 0.4}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="chat-msg">
                  <div className="avatar avatar-sm" style={{ fontSize: 12 }}>...</div>
                  <div className="chat-bubble theirs" style={{ padding: "8px 14px" }}>
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-wrap">
              <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}
                onClick={() => showNotif("GIF/Image upload coming soon!", "info")}>📎</button>
              <input className="chat-input" placeholder="Type a message..." value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()} />
              <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}
                onClick={() => showNotif("Emoji picker coming soon!", "info")}>😊</button>
              <button className="chat-send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        )}

        {/* Polls tab */}
        {tab === "polls" && (
          <div style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>📊 Weekly Poll</h3>
            {poll ? (
              <div className="card">
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{poll.q}</h4>
                {poll.opts.map((opt, i) => {
                  const pct = totalVotes > 0 ? Math.round((opt.v / totalVotes) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className={`poll-option ${votedPoll === i ? "voted" : ""}`} onClick={() => votePoll(i)}>
                        <span>{opt.t}</span>
                        {votedPoll !== null && <span style={{ fontWeight: 600, color: "var(--purple3)" }}>{pct}%</span>}
                      </div>
                      {votedPoll !== null && (
                        <div className="poll-bar-wrap" style={{ marginBottom: 8 }}>
                          <div className="poll-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 12 }}>{totalVotes} votes total</div>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--text2)", padding: "40px 0" }}>
                No polls yet — check back soon!
              </div>
            )}
          </div>
        )}

        {/* Meme Board tab */}
        {tab === "memes" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>😂 Meme Board</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="Drop an emoji meme..." value={memeInput}
                  onChange={e => setMemeInput(e.target.value)} style={{ width: 200 }} />
                <button className="btn btn-primary btn-sm" onClick={() => {
                  if (memeInput.trim()) { setMemes(prev => [memeInput.trim(), ...prev]); setMemeInput(""); }
                }}>Post</button>
              </div>
            </div>
            <div className="meme-grid">
              {memes.map((m, i) => (
                <div key={i} className="meme-item" onClick={() => showNotif(`React: ${m} 🔥`, "info")}>
                  {m}
                  <div style={{
                    position: "absolute", bottom: 4, right: 4,
                    fontSize: 10, color: "var(--text3)", background: "rgba(0,0,0,0.5)",
                    borderRadius: 4, padding: "2px 4px"
                  }}>
                    {Math.floor(Math.random() * 20 + 1)} 🔥
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events tab */}
        {tab === "events" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>🗓️ Group Events</h3>
              <button className="btn btn-primary btn-sm" onClick={() => showNotif("Event creation coming soon!", "info")}>
                + New Event
              </button>
            </div>
            {(group.events || []).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {group.events.map(ev => (
                  <div key={ev.id} className="event-card">
                    <div className="event-date">
                      <div className="event-date-day" style={{ color: "var(--purple2)" }}>{ev.day}</div>
                      <div className="event-date-month">{ev.month}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
                        {ev.rsvp} members RSVP'd
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm"
                      onClick={() => { rsvps[ev.id] ? showNotif("Already RSVP'd!", "info") : (setRsvps(r => ({ ...r, [ev.id]: true })), showNotif("RSVP confirmed! 🎉", "success")); }}>
                      {rsvps[ev.id] ? "✓ Going" : "RSVP"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--text2)", padding: "40px 0" }}>
                No upcoming events — create one!
              </div>
            )}

            {/* Weekly challenge */}
            <div className="challenge-card" style={{ marginTop: 24 }}>
              <div className="challenge-icon">🏆</div>
              <div className="challenge-title">This Week's Challenge</div>
              <div className="challenge-desc">{group.challenge}</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}
                onClick={() => showNotif("Challenge response submitted!", "success")}>
                Submit Response
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar — members */}
      <div style={{ padding: 20, background: "var(--bg2)", overflowY: "auto" }}>
        <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          Members ({group.memberCount}/{group.maxMembers})
        </h4>

        {/* Gender ratio */}
        <div style={{ marginBottom: 16 }}>
          <div className="gender-bar" style={{ height: 8, marginBottom: 4 }}>
            <div className="gender-bar-m" style={{ flex: group.maleRatio }} />
            <div className="gender-bar-f" style={{ flex: group.femaleRatio }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)" }}>
            <span style={{ color: "var(--cyan)" }}>♂ {Math.round(group.maleRatio * 100)}%</span>
            <span style={{ color: "var(--pink)" }}>♀ {Math.round(group.femaleRatio * 100)}%</span>
          </div>
        </div>

        {/* Me */}
        <div className="member-row">
          <div className="avatar avatar-sm" style={{ fontSize: 16, background: "linear-gradient(135deg,var(--purple),var(--pink))" }}>
            {user?.avatar || user?.initials || "ME"}
          </div>
          <div style={{ flex: 1 }}>
            <div className="member-name">{user?.name} <span style={{ fontSize: 11, color: "var(--purple3)" }}>(you)</span></div>
            <div className="member-meta">{user?.city}</div>
          </div>
          <div className="pulse-dot" />
        </div>

        {group.members.map(m => (
          <div key={m.id} className="member-row">
            <div className="avatar avatar-sm" style={{ fontSize: 12 }}>{m.initials}</div>
            <div style={{ flex: 1 }}>
              <div className="member-name">{m.name}</div>
              <div className="member-meta">{m.city}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ "--pct": `${m.vibe}%` }} className="vibe-ring" style={{ width: 38, height: 38, background: `conic-gradient(var(--purple) 0%, var(--pink) ${m.vibe}%, var(--bg3) ${m.vibe}%)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ position: "absolute", fontSize: 9, fontWeight: 700, color: "var(--purple3)" }}>{m.vibe}%</span>
              </div>
            </div>
          </div>
        ))}

        {/* Badges */}
        {group.badges?.length > 0 && (
          <>
            <div className="divider" />
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Group Badges</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {group.badges.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text2)" }}>
                  <span>🏅</span> {b}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divider" />
        <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.7 }}>
          <div>📌 Topic of the week:</div>
          <div style={{ color: "var(--text2)", marginTop: 4 }}>"{group.topicOfWeek}"</div>
        </div>
      </div>
    </div>
  );
}

function SpoilerText({ text }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span className={`spoiler ${revealed ? "revealed" : ""}`} onClick={() => setRevealed(true)}
      title={revealed ? "" : "Click to reveal spoiler"}>
      {text}
      {!revealed && <span style={{ fontSize: 10, marginLeft: 6, color: "rgba(255,255,255,0.5)" }}>🚨 spoiler</span>}
    </span>
  );
}
