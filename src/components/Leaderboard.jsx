import { useState, useEffect } from "react";
import { getLeaderboard } from "../firebase/firestore";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(10).then((data) => {
      setLeaders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page-loading">Loading Bounty Board...</div>;

  return (
    <div className="leaderboard">
      <h2>☠️ Bounty Board ☠️</h2>
      {leaders.length === 0 ? (
        <p className="empty-state">No pirates on the board yet!</p>
      ) : (
        leaders.map((pirate, idx) => (
          <div className="leaderboard-entry" key={pirate.id}>
            <span className="leaderboard-rank">
              {idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
            </span>
            <span className="leaderboard-name">{pirate.name || "Unknown Pirate"}</span>
            <span className="leaderboard-crew-count">
              🏴‍☠️ {pirate.crewMembers?.length || 0}
            </span>
            <span className="leaderboard-bounty">💰 {pirate.points || 0}</span>
          </div>
        ))
      )}
    </div>
  );
}
