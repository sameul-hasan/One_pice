import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CrewPopup from "../components/CrewPopup";

const ALL_CREW = [
  { name: "Luffy", icon: "👒", island: "Foosha Village" },
  { name: "Zoro", icon: "⚔️", island: "Baratie" },
  { name: "Nami", icon: "🗺️", island: "Skypiea" },
  { name: "Usopp", icon: "🎯", island: "Water 7" },
  { name: "Sanji", icon: "🍳", island: "Fishman Island" },
  { name: "Robin", icon: "📚", island: "Sabaody Archipelago" },
  { name: "One Piece", icon: "👑", island: "Laugh Tale" },
];

const ALL_BADGES = [
  { name: "HTML Hero", icon: "🏷️", desc: "Complete all HTML challenges" },
  { name: "CSS Wizard", icon: "🎨", desc: "Complete all CSS challenges" },
  { name: "JS Pirate", icon: "⚡", desc: "Complete all JavaScript challenges" },
  { name: "DOM Master", icon: "🧩", desc: "Complete all DOM challenges" },
  { name: "API Captain", icon: "🌐", desc: "Complete all API challenges" },
  { name: "Bug Slayer", icon: "🐛", desc: "Complete all Debugging challenges" },
  { name: "Pirate King of Code", icon: "👑", desc: "Complete the Final Project" },
];

export default function Rewards({ user, profile }) {
  const [crewPopup, setCrewPopup] = useState(null);
  const unlockedCrew = profile?.crewMembers || [];
  const unlockedBadges = profile?.badges || [];

  return (
    <div className="rewards-page">
      <h1 style={{ fontFamily: "var(--font-pirate)", color: "var(--gold)", marginBottom: "0.5rem" }}>
        🏴‍☠️ Treasure Vault
      </h1>
      <p style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
        Your earned rewards, crew members, and badges from the Grand Line.
      </p>

      {/* Bounty Summary */}
      <div className="stats-bar" style={{ marginBottom: "2rem" }}>
        <div className="stat-item">
          <div className="stat-value">💰 {profile?.points || 0}</div>
          <div className="stat-label">Total Bounty</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">🏝️ {profile?.completedIslands?.length || 0}</div>
          <div className="stat-label">Islands Conquered</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">🏴‍☠️ {unlockedCrew.length}</div>
          <div className="stat-label">Crew Members</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">🎖️ {unlockedBadges.length}</div>
          <div className="stat-label">Badges</div>
        </div>
      </div>

      {/* Crew Members */}
      <h2 className="section-title">🏴‍☠️ Straw Hat Crew</h2>
      <div className="crew-grid" style={{ marginBottom: "2rem" }}>
        {ALL_CREW.map((member) => {
          const unlocked = unlockedCrew.includes(member.name);
          return (
            <motion.div
              key={member.name}
              className={`crew-card ${unlocked ? "" : "locked"}`}
              whileHover={unlocked ? { scale: 1.08 } : {}}
              onClick={() => unlocked && setCrewPopup(member.name)}
              style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
            >
              <div className="crew-icon">{member.icon}</div>
              <div className="crew-name">{unlocked ? member.name : "???"}</div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, marginTop: "0.2rem" }}>
                {member.island}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badges */}
      <h2 className="section-title">🎖️ Badges</h2>
      <div className="badges-grid">
        {ALL_BADGES.map((badge) => {
          const unlocked = unlockedBadges.includes(badge.name);
          return (
            <div key={badge.name} className={`badge-card ${unlocked ? "" : "locked"}`}>
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{unlocked ? badge.name : "???"}</div>
              {unlocked && (
                <div style={{ fontSize: "0.65rem", opacity: 0.7, marginTop: "0.2rem" }}>
                  {badge.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {crewPopup && <CrewPopup member={crewPopup} onClose={() => setCrewPopup(null)} />}
      </AnimatePresence>
    </div>
  );
}
