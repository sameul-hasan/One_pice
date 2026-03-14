import { useState, useEffect } from "react";
import { getIslands, getMissions } from "../firebase/firestore";
import { AnimatePresence } from "framer-motion";
import PirateMap from "../components/PirateMap";
import Leaderboard from "../components/Leaderboard";
import MissionCard from "../components/MissionCard";
import CrewPopup from "../components/CrewPopup";
import { toast } from "react-toastify";

const ALL_CREW = [
  { name: "Luffy", icon: "👒", island: 1 },
  { name: "Zoro", icon: "⚔️", island: 2 },
  { name: "Nami", icon: "🗺️", island: 3 },
  { name: "Usopp", icon: "🎯", island: 4 },
  { name: "Sanji", icon: "🍳", island: 5 },
  { name: "Robin", icon: "📚", island: 6 },
  { name: "One Piece", icon: "👑", island: 7 },
];

export default function Dashboard({ user, profile, refreshProfile }) {
  const [islands, setIslands] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crewPopup, setCrewPopup] = useState(null);

  useEffect(() => {
    Promise.all([getIslands(), getMissions()]).then(([islandData, missionData]) => {
      setIslands(islandData);
      setMissions(missionData);
      setLoading(false);
    });
  }, []);

  if (loading || !profile) return <div className="page-loading">Charting the seas...</div>;

  const completedCount = profile.completedIslands?.length || 0;
  const crewCount = profile.crewMembers?.length || 0;
  const unlockedCrew = profile.crewMembers || [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Ahoy, {profile.name || "Pirate"}!</h1>
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">💰 {profile.points || 0}</div>
            <div className="stat-label">Bounty</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">🏝️ {completedCount}/7</div>
            <div className="stat-label">Islands</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">🏴‍☠️ {crewCount}</div>
            <div className="stat-label">Crew</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">⚓ {profile.currentIsland || 1}</div>
            <div className="stat-label">Current Island</div>
          </div>
        </div>
      </div>

      {/* Pirate Map */}
      <h2 className="section-title">🗺️ The Grand Line</h2>
      <PirateMap islands={islands} profile={profile} />

      {/* Crew Members */}
      <h2 className="section-title">🏴‍☠️ Your Crew</h2>
      <div className="crew-grid">
        {ALL_CREW.map((member) => {
          const unlocked = unlockedCrew.includes(member.name);
          return (
            <div
              key={member.name}
              className={`crew-card ${unlocked ? "" : "locked"}`}
              onClick={() => unlocked && setCrewPopup(member.name)}
            >
              <div className="crew-icon">{member.icon}</div>
              <div className="crew-name">{unlocked ? member.name : "???"}</div>
            </div>
          );
        })}
      </div>

      {/* Daily/Weekly Missions */}
      <h2 className="section-title">📜 Pirate Missions</h2>
      <div className="mission-list">
        {missions.map((m) => (
          <MissionCard
            key={m.id}
            mission={m}
            onAccept={() => toast.info(`Mission "${m.title}" accepted! Complete it to earn ${m.points} bounty.`)}
          />
        ))}
      </div>

      {/* Leaderboard */}
      <h2 className="section-title">🏆 Bounty Board</h2>
      <Leaderboard />

      {/* Crew Popup */}
      <AnimatePresence>
        {crewPopup && (
          <CrewPopup member={crewPopup} onClose={() => setCrewPopup(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
