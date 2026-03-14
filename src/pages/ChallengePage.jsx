import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getChallenges,
  getIslands,
  addBounty,
  completeIsland,
  addCrewMember,
  addBadge,
} from "../firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CrewPopup from "../components/CrewPopup";
import TreasureChest from "../components/TreasureChest";

const ISLAND_CREW = {
  "1": "Luffy",
  "2": "Zoro",
  "3": "Nami",
  "4": "Usopp",
  "5": "Sanji",
  "6": "Robin",
  "7": "One Piece",
};

const ISLAND_BADGES = {
  "1": "HTML Hero",
  "2": "CSS Wizard",
  "3": "JS Pirate",
  "4": "DOM Master",
  "5": "API Captain",
  "6": "Bug Slayer",
  "7": "Pirate King of Code",
};

export default function ChallengePage({ user, profile, refreshProfile }) {
  const { islandId } = useParams();
  const navigate = useNavigate();
  const [islands, setIslands] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [crewPopup, setCrewPopup] = useState(null);
  const [treasureReward, setTreasureReward] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      const [challengeData, islandData] = await Promise.all([
        getChallenges(islandId || null),
        getIslands(),
      ]);
      setChallenges(challengeData);
      setIslands(islandData);
      setLoading(false);
    };
    load();
  }, [islandId]);

  const currentIsland = islands.find((i) => i.id === islandId);
  const currentIslandNum = profile?.currentIsland || 1;
  const isLocked = islandId && Number(currentIsland?.order || 0) > currentIslandNum &&
    !(profile?.completedIslands || []).includes(islandId);

  const handleSubmit = async () => {
    if (!selectedChallenge || !code.trim()) {
      toast.warn("Write some code before submitting!");
      return;
    }

    setSubmitting(true);
    try {
      const points = selectedChallenge.points || 100;
      await addBounty(user.uid, points);
      setCompletedChallenges((prev) => new Set([...prev, selectedChallenge.id]));

      toast.success(`+${points} Bounty Points earned!`);

      // Check if all challenges for this island are completed
      if (islandId) {
        const islandChallenges = challenges.filter((c) => c.islandId === islandId);
        const newCompleted = new Set([...completedChallenges, selectedChallenge.id]);
        const allDone = islandChallenges.every((c) => newCompleted.has(c.id));

        if (allDone && !(profile.completedIslands || []).includes(islandId)) {
          await completeIsland(user.uid, islandId, 100);

          // Unlock crew member
          const crewMember = ISLAND_CREW[islandId];
          if (crewMember && !(profile.crewMembers || []).includes(crewMember)) {
            await addCrewMember(user.uid, crewMember);
            setCrewPopup(crewMember);
          }

          // Award badge
          const badge = ISLAND_BADGES[islandId];
          if (badge && !(profile.badges || []).includes(badge)) {
            await addBadge(user.uid, badge);
            toast.success(`Badge unlocked: ${badge}!`);
          }

          // Show treasure for final island
          if (islandId === "7") {
            setTreasureReward(500);
          } else {
            setTreasureReward(100);
          }
        }
      }

      await refreshProfile();
    } catch (err) {
      toast.error("Failed to submit: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading challenges...</div>;

  if (isLocked) {
    return (
      <div className="challenge-page">
        <h1 style={{ fontFamily: "var(--font-pirate)", color: "var(--gold)" }}>
          🔒 Island Locked
        </h1>
        <p style={{ marginTop: "1rem" }}>
          Complete the previous islands to unlock {currentIsland?.name || "this island"}!
        </p>
        <button className="btn-pirate" style={{ marginTop: "1rem", width: "auto" }} onClick={() => navigate("/dashboard")}>
          Back to Map
        </button>
      </div>
    );
  }

  // Challenge detail view
  if (selectedChallenge) {
    const isCompleted = completedChallenges.has(selectedChallenge.id);
    return (
      <div className="challenge-page">
        <div className="challenge-header">
          <h1>{selectedChallenge.title}</h1>
          <span className={`difficulty-badge ${selectedChallenge.difficulty?.toLowerCase()}`}>
            {selectedChallenge.difficulty}
          </span>
        </div>

        <div className="challenge-desc">{selectedChallenge.description}</div>

        <div className="points-display">💰 +{selectedChallenge.points} bounty</div>

        {showHint && selectedChallenge.hint && (
          <div className="challenge-hint">💡 Hint: {selectedChallenge.hint}</div>
        )}

        {!showHint && selectedChallenge.hint && (
          <button
            className="btn-admin edit"
            style={{ marginBottom: "1rem" }}
            onClick={() => setShowHint(true)}
          >
            Show Hint
          </button>
        )}

        <textarea
          className="code-editor-area"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here, pirate..."
          spellCheck={false}
        />

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            className="btn-submit-challenge"
            onClick={handleSubmit}
            disabled={submitting || isCompleted}
          >
            {isCompleted ? "Completed!" : submitting ? "Submitting..." : "Submit Answer"}
          </button>
          <button
            className="btn-admin edit"
            onClick={() => { setSelectedChallenge(null); setCode(""); setShowHint(false); }}
          >
            Back to List
          </button>
        </div>

        <AnimatePresence>
          {crewPopup && <CrewPopup member={crewPopup} onClose={() => setCrewPopup(null)} />}
          {treasureReward && (
            <TreasureChest
              points={treasureReward}
              onClose={() => setTreasureReward(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Challenge list view
  const groupedByIsland = {};
  challenges.forEach((c) => {
    const key = c.islandId || "unknown";
    if (!groupedByIsland[key]) groupedByIsland[key] = [];
    groupedByIsland[key].push(c);
  });

  return (
    <div className="challenge-page">
      <h1 style={{ fontFamily: "var(--font-pirate)", color: "var(--gold)", marginBottom: "1rem" }}>
        {islandId && currentIsland
          ? `⚓ ${currentIsland.name} — ${currentIsland.topic}`
          : "⚓ All Challenges"}
      </h1>

      {islandId ? (
        <div className="challenge-list">
          {challenges
            .filter((c) => c.islandId === islandId)
            .map((challenge) => (
              <div
                key={challenge.id}
                className="challenge-card"
                onClick={() => { setSelectedChallenge(challenge); setCode(challenge.starterCode || ""); }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>{challenge.title}</h3>
                  <span className={`difficulty-badge ${challenge.difficulty?.toLowerCase()}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p>{challenge.description}</p>
                <span className="points-display" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  💰 +{challenge.points}
                </span>
              </div>
            ))}
        </div>
      ) : (
        Object.entries(groupedByIsland).map(([key, list]) => {
          const island = islands.find((i) => i.id === key);
          return (
            <div key={key}>
              <h2 className="section-title">
                🏝️ {island?.name || `Island ${key}`} — {island?.topic || ""}
              </h2>
              <div className="challenge-list">
                {list.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="challenge-card"
                    onClick={() => { setSelectedChallenge(challenge); setCode(challenge.starterCode || ""); }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3>{challenge.title}</h3>
                      <span className={`difficulty-badge ${challenge.difficulty?.toLowerCase()}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p>{challenge.description}</p>
                    <span className="points-display" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                      💰 +{challenge.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {!islandId && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="btn-pirate" style={{ width: "auto" }} onClick={() => navigate("/dashboard")}>
            Back to Map
          </button>
        </div>
      )}
    </div>
  );
}
