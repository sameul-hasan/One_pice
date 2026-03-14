import { useNavigate } from "react-router-dom";
import Island from "./Island";
import Avatar from "./Avatar";

const ISLAND_POSITIONS = [
  { x: "8%", y: "65%" },
  { x: "22%", y: "35%" },
  { x: "38%", y: "60%" },
  { x: "50%", y: "28%" },
  { x: "64%", y: "55%" },
  { x: "78%", y: "30%" },
  { x: "90%", y: "50%" },
];

export default function PirateMap({ islands, profile }) {
  const navigate = useNavigate();
  const currentIsland = profile?.currentIsland || 1;
  const completed = profile?.completedIslands || [];

  const sorted = [...islands].sort((a, b) => (a.order || 0) - (b.order || 0));

  const getStatus = (island) => {
    if (completed.includes(island.id)) return "completed";
    if (Number(island.order) === currentIsland) return "current";
    return "locked";
  };

  const avatarIdx = Math.min(currentIsland - 1, ISLAND_POSITIONS.length - 1);
  const avatarPos = {
    x: `calc(${ISLAND_POSITIONS[avatarIdx].x} + 15px)`,
    y: `calc(${ISLAND_POSITIONS[avatarIdx].y} - 50px)`,
  };

  return (
    <div className="pirate-map-container">
      {/* Dashed path connecting islands */}
      <svg className="map-path">
        {ISLAND_POSITIONS.map((pos, i) => {
          if (i === 0) return null;
          const prev = ISLAND_POSITIONS[i - 1];
          return (
            <line
              key={i}
              x1={prev.x}
              y1={prev.y}
              x2={pos.x}
              y2={pos.y}
            />
          );
        })}
      </svg>

      {/* Islands */}
      {sorted.map((island, i) => {
        const pos = ISLAND_POSITIONS[i] || ISLAND_POSITIONS[ISLAND_POSITIONS.length - 1];
        return (
          <Island
            key={island.id}
            island={island}
            status={getStatus(island)}
            onClick={() => navigate(`/challenges/${island.id}`)}
            style={{ left: pos.x, top: pos.y }}
          />
        );
      })}

      {/* Avatar */}
      <Avatar position={{ x: ISLAND_POSITIONS[avatarIdx].x, y: `calc(${ISLAND_POSITIONS[avatarIdx].y} - 55px)` }} />
    </div>
  );
}
