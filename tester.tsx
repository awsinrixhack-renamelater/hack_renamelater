import { useState } from "react";

export default function UserScores() {
  const [users, setUsers] = useState([
    { name: "Alice", score: 0 },
    { name: "Bob", score: 0 },
    { name: "Charlie", score: 0 },
  ]);
  const [newUser, setNewUser] = useState("");
  const [yourName, setYourName] = useState("Alice"); // Default "your user"

  function addUser() {
    const trimmed = newUser.trim();
    if (!trimmed) return;
    if (users.some((u) => u.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("That username already exists!");
      return;
    }
    setUsers([...users, { name: trimmed, score: 0 }]);
    setNewUser("");
  }

  function increaseScore(index) {
    setUsers(users.map((u, i) =>
      i === index ? { ...u, score: u.score + 1 } : u
    ));
  }

  function resetScores() {
    setUsers(users.map((u) => ({ ...u, score: 0 })));
  }

  const rankedUsers = [...users].sort((a, b) => b.score - a.score);

  // soft mountain palette colors
  const colors = {
    coral: "#DE807B",
    blush: "#EAB7A9",
    mint: "#B7D6CC",
    teal: "#4C96A8",
    navy: "#2C3E58",
    white: "#ffffff",
  };

  const yourUser = users.find(u => u.name === yourName);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: colors.mint,
        minHeight: "100vh",
        color: colors.navy,
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: colors.navy }}>
       🏆 Scoreboard 🏆
      </h2>

      {/* Input section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter username"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addUser()}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: `1px solid ${colors.teal}`,
            marginRight: "0.5rem",
            width: "200px",
          }}
        />
        <button
          onClick={addUser}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: colors.coral,
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add User
        </button>
      </div>

      {/* Leaderboard banners */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {rankedUsers.map((user, index) => {
          const bannerColor =
            index === 0
              ? colors.coral
              : index === 1
              ? colors.blush
              : index === 2
              ? colors.mint
              : colors.white;

          const textColor = index <= 2 ? colors.white : colors.navy;

          return (
            <div
              key={user.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: bannerColor,
                borderRadius: "14px",
                padding: "1rem 2rem",
                width: "60%",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: textColor }}>
                #{index + 1}
              </div>
              <div
                style={{
                  flexGrow: 1,
                  textAlign: "left",
                  marginLeft: "1rem",
                  fontSize: "1.1rem",
                  color: textColor,
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  marginRight: "1rem",
                  fontSize: "1.1rem",
                  color: textColor,
                }}
              >
                {user.score}
              </div>
              <button
                onClick={() =>
                  increaseScore(users.findIndex((u) => u.name === user.name))
                }
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  backgroundColor: colors.teal,
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                +1
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={resetScores}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: colors.coral,
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Reset Scores
      </button>

      {/* Your Score banner */}
      {yourUser && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.teal,
            color: "white",
            borderRadius: "14px",
            padding: "1rem 2rem",
            width: "60%",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            margin: "1rem auto 0 auto", // <-- centers horizontally
          }}
        >
          <div>Your Score ({yourUser.name})</div>
          <div>{yourUser.score}</div>
        </div>
      )}
    </div>
  );
}
